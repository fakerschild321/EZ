package cn.edu.scnu.peripheraltradingplatform.Mapper;

import cn.edu.scnu.peripheraltradingplatform.Entity.Auction;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fasterxml.jackson.databind.ser.Serializers;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuctionMapper extends BaseMapper<Auction> {
}
