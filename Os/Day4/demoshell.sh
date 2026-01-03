echo "First Come First Serve (FCFS) Scheduling"
echo "---------------------------------------"

# Input number of processes
read -p "Enter the number of processes: " n

# Arrays to store Arrival and Burst Times
declare -a pid arrival burst waiting turnaround completion

# Input Process Details
for ((i=0; i<n; i++))
do
    pid[$i]=$((i+1))
    read -p "Enter Arrival Time for Process ${pid[$i]}: " arrival[$i]
    read -p "Enter Burst Time for Process ${pid[$i]}: " burst[$i]
done

# ----- Sorting Processes by Arrival Time -----
for ((i=0; i<n-1; i++))
do
    for ((j=i+1; j<n; j++))
    do
        if (( ${arrival[$i]} > ${arrival[$j]} ))
        then
            # Swap arrival time
            temp=${arrival[$i]}
            arrival[$i]=${arrival[$j]}
            arrival[$j]=$temp

            # Swap burst time
            temp=${burst[$i]}
            burst[$i]=${burst[$j]}
            burst[$j]=$temp

            # Swap process ID
            temp=${pid[$i]}
            pid[$i]=${pid[$j]}
            pid[$j]=$temp
        fi
    done
done

# ----- Calculate Completion, Turnaround, Waiting Times -----
completion[0]=$((arrival[0] + burst[0]))

for ((i=1; i<n; i++))
do
    if (( ${completion[$((i-1))]} < ${arrival[$i]} ))
    then
        completion[$i]=$((arrival[$i] + burst[$i]))
    else
        completion[$i]=$((completion[$((i-1))] + burst[$i]))
    fi
done

for ((i=0; i<n; i++))
do
    turnaround[$i]=$((completion[$i] - arrival[$i]))
    waiting[$i]=$((turnaround[$i] - burst[$i]))
done

# ----- Display the Results -----
echo
echo "--------------------------------------------------------------"
echo "PID | Arrival | Burst | Completion | Turnaround | Waiting"
echo "--------------------------------------------------------------"
total_tat=0
total_wt=0

for ((i=0; i<n; i++))
do
    echo " ${pid[$i]}     ${arrival[$i]}        ${burst[$i]}         ${completion[$i]}           ${turnaround[$i]}           ${waiting[$i]}"
    total_tat=$((total_tat + turnaround[$i]))
    total_wt=$((total_wt + waiting[$i]))
done

avg_tat=$(echo "scale=2; $total_tat / $n" | bc)
avg_wt=$(echo "scale=2; $total_wt / $n" | bc)

echo "--------------------------------------------------------------"
echo "Average Turnaround Time: $avg_tat"
echo "Average Waiting Time: $avg_wt"
echo "--------------------------------------------------------------"