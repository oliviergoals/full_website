package com.example.escproject_testing;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminPanel {

    static String[] invalidUsernames = {"admin@swaggy.com", " ", "003.escistd50.", "@", "2", "escistd500.03", "escistd50.003"};
    static String myPassword = "@Swaggy97";

    public static void main(String[] args) throws InterruptedException {
        System.setProperty("webdriver.gecko.driver","C:\\Users\\User\\Downloads\\geckodriver-v0.26.0-win64\\geckodriver.exe");
        WebDriver driver = new FirefoxDriver();


        for(int i = 0; i < invalidUsernames.length; i++){
            driver.get("https://poc-open-rainbow-swaggy.herokuapp.com");


            // get the user name field of the account page
            WebElement username = driver.findElement(By.name("email"));

            // send my user name to fill up the box
            username.sendKeys(invalidUsernames[i]);

            // locate the "Next" button in the account page
            WebElement password = driver.findElement(By.name("password"));
            password.sendKeys(myPassword);

            // login and :)
            WebElement nextButton = driver.findElement(By.xpath("//button[contains(text(),'Login')]"));
            nextButton.click();

//            //explicitly wait until the password field is present in the page
//            try {
//                WebDriverWait wait = new WebDriverWait(driver, 10);
//                // wait only until the project front page loads
//                wait.until(ExpectedConditions.elementToBeClickable(By.id("project-name-p12207705")));
//                // click project link
//                driver.findElement(By.id("project-name-p12207705")).click();
//            } catch (Exception NoSuchElementException) {
//                System.out.println("login/password name invalid");
//
//            }
        }
    }

}
