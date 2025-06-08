package cn.edu.scnu.peripheraltradingplatform.Entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("comments")
public class Comment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long productId;

    private Long userId;

    private String content;

    private Integer rating; // 1~5

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
