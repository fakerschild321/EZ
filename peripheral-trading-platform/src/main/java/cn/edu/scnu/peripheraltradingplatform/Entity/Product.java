package cn.edu.scnu.peripheraltradingplatform.Entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class Product {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private String item_condition;
    private String imageUrl;
    private Boolean featured;
}



