import random
import string
import csv

list_of_badstrings = ["<script>alert(123)</script>",
"&lt;script&gt;alert(&#39;123&#39;);&lt;/script&gt;",
"<img src=x onerror=alert(123) />",
"<svg><script>123<1>alert(123)</script>",
"><script>alert(123)</script>",
"'><script>alert(123)</script>",
"><script>alert(123)</script>",
"</script><script>alert(123)</script>",
"< / script >< script >alert(123)< / script >",
 "onfocus=JaVaSCript:alert(123) autofocus",
"onfocus=JaVaSCript:alert(123) autofocus",
"onfocus=JaVaSCript:alert(123) autofocus",
"＜script＞alert(123)＜/script＞",
"<sc<script>ript>alert(123)</sc</script>ript>",
"--><script>alert(123)</script>",
";alert(123);t=",
';alert(123);t=',
"JavaSCript:alert(123)",
";alert(123);",
"src=JaVaSCript:prompt(132)",
"><script>alert(123);</script x=",
'><script>alert(123);</script x=',
"><script>alert(123);</script x=",
"' autofocus onkeyup='javascript:alert(123)",
"<scripttype='text/javascript'>javascript:alert(1);</script>'",
"'`><script>javascript:alert(1)</script>",
"'`><script>javascript:alert(1)</script>]"
"1;DROP TABLE users"
"1'; DROP TABLE users-- 1"
"' OR 1=1 -- 1"
"' OR '1'='1"
]

print(len(list_of_badstrings));
for i in list_of_badstrings:
    print(i);


getReqCSA_inject = {"client": "Sean Michael Lim",
    "department": "Graduate Office",
    "communication": "Chat",
    "email" : "tinkitwong@gmail.com", 
    "problem": "rh3ygbr",
    "queueDropped" : True
}
postReq_route = [getReqCSA_inject];
postReq_names = ["getReqCSA_inject"]


def write_csv(filename, postReq,final_dict_arr):
    file_name = "{}.csv".format(filename);
    with open(file_name, mode="w") as csv_file:
        fieldnames = postReq.keys();
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader();
        for i in final_dict_arr:
            writer.writerow(i);

def main(postReq,filename):
    final_dict_arr = []
    #print(mutOps[index]);
    for j in range(50):
        final_dict = {}
        for i in postReq:
            list_len = len(list_of_badstrings);
            index = random.randint(0,(list_len-1));
            if (isinstance(postReq[i] , str)):
                mutated = list_of_badstrings[index];
                final_dict.update({i:mutated});
                #print(mutated);
            # elif (isinstance(postReq[i] , dict)):
                # chat = mutate_chat(postReq[i],index)
                # final_dict.update({i:chat})
            else:
                final_dict.update({i:bool(random.getrandbits(1))});
        final_dict_arr.append(final_dict);
    write_csv(filename,postReq,final_dict_arr);

if __name__ == "__main__":
    # for i in range(len(postReq_names)):
    main(postReq_route[0],postReq_names[0])
    