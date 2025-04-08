package com.sismics.util;

import org.junit.Assert;
import org.junit.Test;

import static org.mockito.Mockito.*;

import javax.mail.Part;

public class TestEmailUtil {
    @Test
    public void testParseMailContentWithTextPlain() throws Exception {
        Part part = mock(Part.class);
        when(part.getContent()).thenReturn("This is a plain text message");
        when(part.isMimeType("text/plain")).thenReturn(true);
        EmailUtil.MailContent mailContent = new EmailUtil.MailContent();
        EmailUtil.parseMailContent(part, mailContent);
        Assert.assertEquals("This is a plain text message", mailContent.getMessage());
    }

    @Test
    public void testParseMailContentWithTextHtml() throws Exception {
        Part part = mock(Part.class);
        when(part.getContent()).thenReturn("<html><body>This is an <b>HTML</b> message</body></html>");
        when(part.isMimeType("text/html")).thenReturn(true);
        EmailUtil.MailContent mailContent = new EmailUtil.MailContent();
        EmailUtil.parseMailContent(part, mailContent);
        Assert.assertEquals("This is an HTML message", mailContent.getMessage());
    }
}