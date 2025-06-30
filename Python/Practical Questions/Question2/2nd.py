# Create a function to check whether the number is prime or not
a = int(input("Enter a number: "))
if a > 1:
    for i in range(2, int(a ** 0.5) + 1):
        if a % i == 0:
            print(f"{a} is not a prime number.")
            break
    else:
        print(f"{a} is a prime number.")
else:
    print(f"{a} is not a prime number.")