# WAP to Count the Number of Words in a text file
total = 0
with open(r'/Users/maheshrajpurohit/Documents/Question1/question4/a.txt','r') as file: #Actually there were some errors with vs code not having permission to access files had to use path to access the file
    a = file.read()
    b = a.split()
    total += len(b)
print(total)