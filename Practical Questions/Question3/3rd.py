# WAP to get unique items from two sets
value1 = set(map(str, input("Enter the elements of the first set separated by spaces: ").split()))
s2 = set(map(str, input("Enter the elements of the second set separated by spaces: ").split()))

unique_items = value1 ^ s2
print(unique_items)