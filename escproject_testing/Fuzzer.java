import java.io.File;
import java.io.FileWriter;
import java.math.BigInteger;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.google.common.base.Function;


class Fuzzer 
{
    public static void main(String[] args) {
        String filename = "fuzzerinput.txt";

        List<Function<String,String>> mutationOperators = new ArrayList<Function<String,String>>();        
        mutationOperators.add(a->SwapMutate(a));
        mutationOperators.add(a->BitFlipMutate(a));
        mutationOperators.add(a->TrimMutate(a));

        Path path = FileSystems.getDefault().getPath(filename);
        
        try {
            List<String> lines = Files.readAllLines(path);

            File myObj = new File("fuzzeroutput.txt");
            myObj.createNewFile();
            FileWriter myWriter = new FileWriter("fuzzeroutput.txt");            

            for(String line : lines) 
            {                                            
                int index = new Random().nextInt(mutationOperators.size());
                String mutatedLine = mutationOperators.get(index).apply(line);
                myWriter.write(mutatedLine);
            }
                        
            myWriter.close();
        }
        catch (Exception e)
        {
          System.err.format("Exception occurred trying to read '%s'.", filename);
          e.printStackTrace();
        }



    }

    static String SwapMutate(String line)
    {
        if(line.length() == 0) 
        {
            return line;
        }

        int first = new Random().nextInt(line.length());
        int second = new Random().nextInt(line.length());

        char[] charArray = line.toCharArray();
        char temp = charArray[first];
        char temp2 = charArray[second];
        charArray[first] = temp2;
        charArray[second] = temp;

        return new String(charArray) + "\n";
    }
    
    static String BitFlipMutate(String line)
    {
        
        if(line.length() == 0) 
        {
            return line;
        }

        int randomCharIndex = new Random().nextInt(line.length());
        
        char[] charArray = line.toCharArray();
        // char charToMutate = charArray[randomCharIndex];
        
        String binary = new BigInteger(line.substring(randomCharIndex, randomCharIndex+1).getBytes()).toString(2);        
        int randomBitIndex = new Random().nextInt(binary.length());
        binary = binary.substring(0, randomBitIndex) + binary.substring(randomBitIndex, randomBitIndex+1).replace("0","2").replace("1","0").replace("2", "1") + binary.substring(randomBitIndex+1);
        int charCode = Integer.parseInt(binary, 2);        
        charArray[randomCharIndex] = (char)charCode;
        // System.out.println((char)charCode);
        
        return new String(charArray) + "\n";
    }
    
    static String TrimMutate(String line)
    {
        if(line.length() == 0) 
        {
            return line;
        }
        
        int cutIndex = new Random().nextInt(line.length());            
        return line.substring(0, cutIndex) + "\n";
    }
}