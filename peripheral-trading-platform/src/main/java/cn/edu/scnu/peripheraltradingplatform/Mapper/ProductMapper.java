package cn.edu.scnu.peripheraltradingplatform.Mapper;

import cn.edu.scnu.peripheraltradingplatform.Entity.Product;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
    // BaseMapper提供了CRUD基础方法，通常不需要额外定义方法
}