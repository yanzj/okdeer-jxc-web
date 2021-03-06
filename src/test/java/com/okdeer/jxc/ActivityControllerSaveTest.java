/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年11月14日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc;

import java.math.BigDecimal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.alibaba.fastjson.JSON;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.config.test.ResourceConfig;
import com.okdeer.jxc.config.test.ShiroConfiguration;
import com.okdeer.jxc.sale.activity.vo.ActivityDetailVo;
import com.okdeer.jxc.sale.activity.vo.ActivityVo;
import com.okdeer.jxc.sale.enums.ActivityType;
import com.okdeer.jxc.system.entity.SysUser;

/**
 * ClassName: ActivityControllerTest 
 * @author xiaoj02
 * @date 2016年11月14日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RunWith(SpringJUnit4ClassRunner.class) // SpringJUnit支持，由此引入Spring-Test框架支持！ 
@SpringApplicationConfiguration(classes = Application.class) // 指定我们SpringBoot工程的Application启动类
@WebAppConfiguration(value = "src/main/webapp") // 由于是Web项目，Junit需要模拟ServletContext，因此我们需要给我们的测试类加上@WebAppConfiguration。
@ContextConfiguration(classes={ ResourceConfig.class, ShiroConfiguration.class })
public class ActivityControllerSaveTest {
	
	@Autowired  
    private WebApplicationContext wac;  
  
    private MockMvc mockMvc; 
    
    @Before  
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }
    
//    @Test
//    @Rollback(false)//设置是否回滚 
//    public void save() throws Exception {
//    	MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/sale/activity/save");
//    	requestBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
//    	
//    	SysUser user = new SysUser();
//    	user.setId("junit测试用户Id");
//    	user.setBranchCode("00000");
//    	requestBuilder.sessionAttr(Constant.SESSION_USER, user);
//    	
//    	ActivityVo1 activityVo = new ActivityVo1();
//    	activityVo.setActivityName("junit测试活动");
//    	activityVo.setActivityType(ActivityType.SALE_PRICE.getValue());
//    	activityVo.setActivityScope(0);
//    	activityVo.setDailyStartTime("00:00:00");
//    	activityVo.setDailyEndTime("23:59:59");
//    	activityVo.setStartTime(new Date());
//    	activityVo.setEndTime(new Date(System.currentTimeMillis() + 1000*60*60*24));
//    	activityVo.setWeeklyActivityDay("1234567");
//    	activityVo.setBranchIds("junit测试机构1,junit测试机构2");
//    	
//    	List<ActivityDetailVo> detailList = new ArrayList<ActivityDetailVo>();
//    	ActivityDetailVo detailVo1= new ActivityDetailVo();
//    	detailVo1.setGoodsSkuId("junit测试商品");
//    	detailVo1.setSaleAmount(new BigDecimal(998));
//    	detailList.add(detailVo1);
//    	activityVo.setDetailList(detailList);
//    	
//    	String jsonText = JSON.toJSONString(activityVo);
//    	requestBuilder.content(jsonText);
//    	
//    	
//        ResultActions resultActions = mockMvc.perform(requestBuilder);
//        resultActions.andDo(MockMvcResultHandlers.print());
//    }
	
    @Test
    @Rollback(false)//设置是否回滚 
    public void saveCombination() throws Exception {
    	MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/sale/activity/save");
    	requestBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
    	
    	SysUser user = new SysUser();
    	user.setId("junit测试用户Id");
    	user.setBranchCode("00000");
    	requestBuilder.sessionAttr(Constant.SESSION_USER, user);
    	
    	ActivityVo activityVo = new ActivityVo();
    	activityVo.setActivityName("junit测试组合活动");
    	activityVo.setActivityType(ActivityType.COMBINATION_SALE.getValue());
    	activityVo.setActivityScope(0);
    	activityVo.setDailyStartTime(Time.valueOf("01:00:00"));
    	activityVo.setDailyEndTime(Time.valueOf("23:59:59"));
    	activityVo.setStartTime(new Date());
    	activityVo.setEndTime(new Date(System.currentTimeMillis() + 1000*60*60*24));
    	activityVo.setWeeklyActivityDay("1234567");
    	activityVo.setBranchIds("junit测试组合机构1,junit测试组合机构2");
    	
    	List<ActivityDetailVo> detailList = new ArrayList<ActivityDetailVo>();
    	ActivityDetailVo detailVo1 = new ActivityDetailVo();
    	detailVo1.setGoodsSkuId("商品A");
    	detailVo1.setSaleAmount(new BigDecimal(998));
    	detailVo1.setLimitCount(new BigDecimal(1));
    	detailVo1.setGroupNum(1);
    	detailList.add(detailVo1);
    	
    	ActivityDetailVo detailVo2 = new ActivityDetailVo();
    	detailVo2.setGoodsSkuId("商品B");
    	detailVo2.setSaleAmount(new BigDecimal(998));
    	detailVo2.setLimitCount(new BigDecimal(1));
    	detailVo2.setGroupNum(1);
    	detailList.add(detailVo2);
    	
    	ActivityDetailVo detailVo3 = new ActivityDetailVo();
    	detailVo3.setGoodsSkuId("商品C");
    	detailVo3.setSaleAmount(new BigDecimal(998));
    	detailVo3.setLimitCount(new BigDecimal(1));
    	detailVo3.setGroupNum(2);
    	detailList.add(detailVo3);
    	
    	activityVo.setDetailList(detailList);
    	
    	String jsonText = JSON.toJSONString(activityVo);
    	requestBuilder.content(jsonText);
    	
    	
        ResultActions resultActions = mockMvc.perform(requestBuilder);
        resultActions.andDo(MockMvcResultHandlers.print());
    }
}
