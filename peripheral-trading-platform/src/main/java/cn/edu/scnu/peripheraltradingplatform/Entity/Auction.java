package cn.edu.scnu.peripheraltradingplatform.Entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Auction {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String item_condition;
    private BigDecimal startingBid;
    private BigDecimal currentBid;
    private Integer bidCount;
    private LocalDateTime endTime;
    private String imageUrl;
}