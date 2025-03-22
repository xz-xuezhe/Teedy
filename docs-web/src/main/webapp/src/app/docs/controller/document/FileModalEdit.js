'use strict';

/**
 * File modal edit controller.
 */
angular.module('docs').controller('FileModalEdit', function ($uibModalInstance, $scope, $rootScope, $state, $stateParams, $sce, Restangular, $transitions, $timeout, $location, $translate, Upload) {
  const setFile = function (files) {
    // Search current file
    _.each(files, function (value) {
      if (value.id === $stateParams.fileId) {
        $scope.file = value;
        $scope.trustedFileUrl = $sce.trustAsResourceUrl('../api/file/' + $stateParams.fileId + '/data');
      }
    });
  };

  // Load files
  Restangular.one('file/list').get({ id: $stateParams.id }).then(function (data) {
    $scope.files = data.files;
    setFile(data.files);

    // File not found, maybe it's a version
    if (!$scope.file) {
      Restangular.one('file/' + $stateParams.fileId + '/versions').get().then(function (data) {
        setFile(data.files);
      });
    }
  }).then(function() {
    $timeout(async function() {
      /* adapted from mozilla/pdf.js/examples/components/simpleviewer.mjs  */
      const absUrl = $location.absUrl();
      const url = $location.url();
      const rootUrl = absUrl.substring(0, absUrl.length - url.length - 1);
      const LIB_URL = rootUrl + 'lib/pdfjs/';
      pdfjsLib.GlobalWorkerOptions.workerSrc = LIB_URL + 'build/pdf.worker.mjs';
      const CMAP_URL = LIB_URL + 'cmaps/';
      const CMAP_PACKED = true;
      const ENABLE_XFA = true;
      const SANDBOX_BUNDLE_SRC = new URL(LIB_URL + 'build/pdf.sandbox.mjs', window.location);
      const container = document.getElementById('viewerContainer');
      const shadowRoot = container.attachShadow({mode: 'open'});
      for (let styleSheet of document.styleSheets) {
        if (styleSheet.href === null) {
          continue;
        }
        if (styleSheet.href.endsWith('pdf_viewer.css')) {
          const linkNode = document.createElement('link');
          linkNode.rel = 'stylesheet';
          linkNode.href = styleSheet.href;
          linkNode.type = 'text/css';
          shadowRoot.appendChild(linkNode);
          break;
        }
      }
      const styleNode = document.createElement('style');
      styleNode.innerHTML = '#viewerContainer { display: block; position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 80vh; overflow: auto; background-color: darkgray; box-shadow: inset 0 0 10px gray; }';
      shadowRoot.appendChild(styleNode);
      const shadowContainer = document.createElement('div');
      shadowContainer.id = 'viewerContainer';
      const shadowViewer = document.createElement('div');
      shadowViewer.id = 'viewer';
      shadowViewer.classList.add('pdfViewer');
      shadowContainer.appendChild(shadowViewer);
      shadowRoot.appendChild(shadowContainer);
      const eventBus = new pdfjsViewer.EventBus();
      const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
        eventBus,
        sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
      });
      const pdfViewer = new pdfjsViewer.PDFViewer({
        container: shadowContainer,
        eventBus,
        scriptingManager: pdfScriptingManager,
        annotationEditorHighlightColors: '#ffff98',
      });
      pdfScriptingManager.setViewer(pdfViewer);
      eventBus.on("pagesinit", function () {
        pdfViewer.currentScaleValue = "page-width";
      });
      const loadingTask = pdfjsLib.getDocument({
        url: $scope.trustedFileUrl.toString(),
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        enableXfa: ENABLE_XFA,
      });
      const pdfDocument = await loadingTask.promise;
      pdfViewer.setDocument(pdfDocument);
      const resizeObserver = new ResizeObserver(function(entries) {
        if (entries) {
          pdfViewer.currentScaleValue = 'page-width';
        }
      });
      resizeObserver.observe(document.getElementById('editArea'));
      $scope.$on('$destroy', function() {
        resizeObserver.disconnect();
      })

      $scope.Type = {
        NONE: 0,
        INK: 1,
        HIGHLIGHT: 2,
        FREETEXT: 3,
      };

      $scope.mode = $scope.Type.NONE;

      /**
       * Switch to none mode.
       */
      $scope.noneMode = function() {
        $scope.mode = $scope.Type.NONE;
        pdfViewer.annotationEditorMode = {mode: pdfjsLib.AnnotationEditorType.NONE};
      };

      /**
       * Switch to ink mode.
       */
      $scope.inkMode = function() {
        $scope.mode = $scope.Type.INK;
        pdfViewer.annotationEditorMode = {mode: pdfjsLib.AnnotationEditorType.INK};
      };

      /**
       * Switch to highlight mode.
       */
      $scope.highlightMode = function() {
        $scope.mode = $scope.Type.HIGHLIGHT;
        pdfViewer.annotationEditorMode = {mode: pdfjsLib.AnnotationEditorType.HIGHLIGHT};
      };

      /**
       * Switch to freetext mode.
       */
      $scope.freetextMode = function() {
        $scope.mode = $scope.Type.FREETEXT;
        pdfViewer.annotationEditorMode = {mode: pdfjsLib.AnnotationEditorType.FREETEXT};
      };

      /**
       * Discard the edited file.
       */
      $scope.cancel = function () {
        $uibModalInstance.close($stateParams.fileId);
      };

      /**
       * Submit the file as a new version.
       */
      $scope.submit = async function() {
        const data = await pdfViewer.pdfDocument.saveDocument();
        const editedFile = new File([data], $scope.file.name, {type: $scope.file.mimetype});
        const file = $scope.file;
        const previousFileId = file.id;
        file.id = undefined;
        file.progress = 0;
        file.create_date = new Date().getTime();
        file.version++;
        // Upload the file
        file.status = $translate.instant('document.view.content.upload_progress');
        return Upload.upload({
          method: 'PUT',
          url: '../api/file',
          file: editedFile,
          fields: {
            id: $stateParams.id,
            previousFileId: previousFileId
          }
        })
        .progress(function(e) {
          file.progress = parseInt(100.0 * e.loaded / e.total);
        })
        .success(function(data) {
          // Update local model with real data
          file.id = data.id;
          file.size = data.size;
          // New file uploaded, increase used quota
          $rootScope.userInfo.storage_current += data.size;
          $uibModalInstance.close(file.id);
        })
        .error(function (data) {
          file.status = $translate.instant('document.view.content.upload_error');
          if (data.type === 'QuotaReached') {
            file.status += ' - ' + $translate.instant('document.view.content.upload_error_quota');
          }
          $uibModalInstance.close($stateParams.fileId);
        });
      };
    });
  });

  /**
   * Return true if we can display the preview image.
   */
  $scope.canDisplayPreview = function () {
    return $scope.file && $scope.file.mimetype !== 'application/pdf';
  };
});