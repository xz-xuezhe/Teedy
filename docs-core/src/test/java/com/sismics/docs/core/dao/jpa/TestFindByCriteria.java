package com.sismics.docs.core.dao.jpa;

import com.sismics.docs.BaseTransactionalTest;
import com.sismics.docs.core.dao.UserDao;
import com.sismics.docs.core.dao.criteria.UserCriteria;
import com.sismics.docs.core.dao.dto.UserDto;
import com.sismics.docs.core.model.jpa.User;
import com.sismics.docs.core.util.TransactionUtil;
import com.sismics.docs.core.util.authentication.InternalAuthenticationHandler;
import com.sismics.docs.core.util.jpa.SortCriteria;
import java.util.ArrayList;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;

/**
 * Tests the persistance layer.
 *
 * @author jtremeaux
 */
public class TestFindByCriteria extends BaseTransactionalTest {
    @Test
    public void testFindByCriteria() throws Exception {
        // Create a user
        UserDao userDao = new UserDao();
        User user = new User();
        user.setUsername("username");
        user.setPassword("12345678");
        user.setEmail("toto@docs.com");
        user.setRoleId("admin");
        user.setStorageQuota(10L);
        List<UserDto> list = userDao.findByCriteria(new UserCriteria(), new SortCriteria(1,true));

        TransactionUtil.commit();

        // Search a user by his ID

        Assert.assertNotNull(list);
        Assert.assertEquals(list, userDao.findByCriteria(new UserCriteria(), new SortCriteria(1,true)));

        // Authenticate using the database
        Assert.assertNotNull(new InternalAuthenticationHandler().authenticate("username", "12345678"));
    }



}
