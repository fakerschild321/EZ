package cn.edu.scnu.peripheraltradingplatform.Service;

import cn.edu.scnu.peripheraltradingplatform.Entity.Auction;
import cn.edu.scnu.peripheraltradingplatform.Mapper.AuctionMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class AuctionService extends ServiceImpl<AuctionMapper, Auction> {
    @Autowired
    private AuctionMapper auctionMapper;

    public Boolean findAcution() {
        List<Auction> list = auctionMapper.selectList(null);
        System.out.println(list);
        if (list.isEmpty()){
            return false;
        }
        else{
            return true;
        }
    }
}


