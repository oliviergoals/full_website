package com.example.escproject_testing;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Random;

public class Injection_Test {

    static String userNameVal = "Johnny Tan";
    static String userEmailVal = "johnny@gg.com";
    static String problemInfo = "I need to ask about the admission criteria";
    static String[] injection = {"<script>alert(123)</script>", "</script><script>alert(123)</script>", "ABC<div style=\"x:\\x00expression(javascript:alert(1)\">DEF",
                                    "<a href=\"javascript\\x00:javascript:alert(1)\" id=\"fuzzelement1\">test</a>", "<plaintext>" };

    public static void main(String[] args) throws InterruptedException {

        //TODO: comment out the recaptcha in the html and set forms to true
        for(int i = 0; i < injection.length; i++) {

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--allow-insecure-localhost");
            DesiredCapabilities caps = DesiredCapabilities.chrome();
            caps.setCapability(ChromeOptions.CAPABILITY, options);
            caps.setCapability("acceptInsecureCerts", true);



            System.setProperty("webdriver.gecko.driver","C:\\Users\\User\\Downloads\\geckodriver-v0.26.0-win64\\geckodriver.exe");
            WebDriver driver = new FirefoxDriver();



    //        driver.get("http://127.0.0.1:5501/index.html");
            driver.get("https://127.0.0.1:8080/");


            WebElement openChatButt = driver.findElement(By.className("open_chat_button"));
            openChatButt.click();
            Thread.sleep(1000);

            WebElement username = driver.findElement(By.id("username"));
            username.sendKeys(injection[i]);
            Thread.sleep(1000);

            WebElement email = driver.findElement(By.id("email"));
            email.sendKeys(userEmailVal);
            Thread.sleep(1000);

            Select selectDepartment = new Select(driver.findElement(By.name("department")));
            selectDepartment.selectByVisibleText("Graduate Office");
            Thread.sleep(1000);

            Select selectChatType = new Select(driver.findElement(By.name("communication")));
            selectChatType.selectByVisibleText("Chat");
            Thread.sleep(1000);

            WebElement problem = driver.findElement(By.id("problem"));
            problem.sendKeys(injection[i]);

            Thread.sleep(1000);

            WebElement submitButt = driver.findElement(By.className("connectionCmp-btn"));
            submitButt.click();

        }
    }


    public static String generateString(Random random, String characters, int length) {
        char[] text = new char[length];
        for (int i = 0; i < length; i++) {
            text[i] = characters.charAt(random.nextInt(characters.length()));
        }
        return new String(text);
    }
}
