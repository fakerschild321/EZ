package cn.edu.scnu.peripheraltradingplatform.Controller;

import cn.edu.scnu.peripheraltradingplatform.Entity.Auction;
import cn.edu.scnu.peripheraltradingplatform.Service.AuctionService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;


@Controller
public class IndexController {

    @Resource
    private AuctionService auctionService;
    // 首页
    @GetMapping("/index")
    public String index() {
        return "index";  // 返回 templates/index.html
    }

    @GetMapping("/auction")
    public String listAuctions(Model model) {
        Boolean single = auctionService.findAcution();
        Auction auction = new Auction();
        model.addAttribute("singleAuction", single);
        model.addAttribute("auction", auction);
        return "auction"; // 返回 auction.html
    }

    @GetMapping("/cart")
    public String cart(){return "cart";}

    @GetMapping("/login")
    public String login(Model model){return "login";}

    @GetMapping("/product_detail")
    public String product_detail(){return "product_detail";}

    @GetMapping("/products")
    public String products(){return "products";}

    @GetMapping("/register")
    public String register(){return "register";}

    @GetMapping("/products")
    public String products(){return "products";}
}
