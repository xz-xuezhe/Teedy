package com.sismics.util;

import org.junit.Assert;
import org.junit.Test;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Test of the image utilities.
 *
 * @author bgamard
 */
public class TestImageUtil {

    @Test
    public void computeGravatarTest() {
        Assert.assertEquals("0bc83cb571cd1c50ba6f3e8a78ef1346", ImageUtil.computeGravatar("MyEmailAddress@example.com "));
    }

    @Test
    public void writeJpegTest() {
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_ARGB);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            ImageUtil.writeJpeg(image, outputStream);
            Assert.assertTrue(outputStream.size() > 0);
        } catch (IOException e) {
            Assert.fail("IOException thrown: " + e.getMessage());
        }
    }

    @Test
    public void isBlackTest() {
        BufferedImage image = new BufferedImage(100, 100, BufferedImage.TYPE_INT_ARGB);
        // Set a black pixel at position (10, 10)
        image.setRGB(10, 10, 0xFF000000);
        Assert.assertTrue(ImageUtil.isBlack(image, 10, 10));
        // Set a white pixel at position (20, 20)
        image.setRGB(20, 20, 0xFFFFFFFF);
        Assert.assertFalse(ImageUtil.isBlack(image, 20, 20));
    }
}
