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

public class SubmitButtTest {

    static String userNameVal = "Johnny Tan";
    static String userEmailVal = "johnny@gg.com";
    static String problemInfo = "I need to ask about the admission criteria";

    public static void main(String[] args) throws InterruptedException {

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--allow-insecure-localhost");
        DesiredCapabilities caps = DesiredCapabilities.chrome();
        caps.setCapability(ChromeOptions.CAPABILITY, options);
        caps.setCapability("acceptInsecureCerts", true);

//        System.setProperty("webdriver.chrome.driver", "C:\\Users\\User\\Downloads\\chromedriver_win32\\chromedriver.exe");
//        WebDriver driver = new ChromeDriver(caps);


        for (int i = 0; i < 4; i++) {
//            System.setProperty("webdriver.chrome.driver", "C:\\Users\\User\\Downloads\\chromedriver_win32\\chromedriver.exe");
//            WebDriver driver = new ChromeDriver(caps);

            System.setProperty("webdriver.gecko.driver","C:\\Users\\User\\Downloads\\geckodriver-v0.26.0-win64\\geckodriver.exe");
            WebDriver driver = new FirefoxDriver();


            driver.get("https://127.0.0.1:8080/");
            Thread.sleep(5000);

            WebElement openChatButt = driver.findElement(By.className("open_chat_button"));
            openChatButt.click();
            Thread.sleep(1000);

            WebElement username = driver.findElement(By.id("username"));
            username.sendKeys(userNameVal);
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
            problem.sendKeys(problemInfo);

            Thread.sleep(1000);

            WebElement submitButt = driver.findElement(By.className("connectionCmp-btn"));
            submitButt.click();
        }

    }
}
