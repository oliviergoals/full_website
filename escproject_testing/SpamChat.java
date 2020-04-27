package com.example.escproject_testing;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.concurrent.ThreadLocalRandom;

import static org.openqa.selenium.net.PortProber.findFreePort;

public class SpamChat {

    static String userNameVal = "Johnny Tan";
    static String userEmailVal = "johnny@gg.com";
    static String problemInfo = "I need to ask about the admission criteria";
    static int numMsgSpam = 20;
    public static final String SOURCES =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890 !@'#$%^&*()_+|}{:<>?/.,[];'`~=";

    public static void main(String[] args) throws InterruptedException {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--allow-insecure-localhost");
        options.addArguments("--disable-web-security");
        options.addArguments("--allow-running-insecure-content");
        DesiredCapabilities caps = DesiredCapabilities.chrome();
        caps.setCapability(ChromeOptions.CAPABILITY, options);
        caps.setCapability("acceptInsecureCerts", true);
        caps.setCapability(CapabilityType.ACCEPT_SSL_CERTS, true);

        options.setExperimentalOption("useAutomationExtension", false);
        options.addArguments("--headless", "--window-size=1920,1200","--ignore-certificate-errors");


        System.setProperty("webdriver.gecko.driver","C:\\Users\\User\\Downloads\\geckodriver-v0.26.0-win64\\geckodriver.exe");
        WebDriver driver = new FirefoxDriver();


        driver.get("https://127.0.0.1:8080/");
//        driver.get("http://127.0.0.1:5501/index.html");

        try {
            login(driver);
            Thread.sleep(5000);
        }
        catch (InterruptedException err){
            System.out.println("Interrupted exception error");
        }

        Thread.sleep(10000);



        WebDriverWait waitChat = new WebDriverWait(driver, 60);
        WebElement chatInput = waitChat.until(ExpectedConditions.visibilityOfElementLocated(By.className("conversationCmp-editor")));



//        WebElement chatInput = driver.findElement(By.className("conversationCmp-editor"));
        for(int i = 0; i < numMsgSpam; i++){
            chatInput.sendKeys(generateString(new Random(), SOURCES, ThreadLocalRandom.current().nextInt(1, 1500 + 1)));
            WebElement pressEnter = driver.findElement(By.cssSelector("button[class='conversationCmp-upload']"));
            pressEnter.click();
        }
    }


    public static void login(WebDriver driver) throws InterruptedException{
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

//        WebElement submitButt = driver.findElement(By.cssSelector("button[class='connectionCmp-btn']"));
        WebElement submitButt = driver.findElement(By.id("submitBut"));

        System.out.println("before pressed click");
        submitButt.click();
        Thread.sleep(2000);
    }


    public static String generateString(Random random, String characters, int length) {
        char[] text = new char[length];
        for (int i = 0; i < length; i++) {
            text[i] = characters.charAt(random.nextInt(characters.length()));
        }
        return new String(text);
    }
}

