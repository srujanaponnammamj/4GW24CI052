#include <stdio.h>

int main() {
    int n, i, j, choice;
    int at[10], bt[10], pr[10];
    int wt[10], tat[10], ct[10], rem[10], p[10];
    int time = 0, tq, done, min;
    float avg_wt = 0, avg_tat = 0;

    /* MENU */
    printf("\nCPU Scheduling Algorithms");
    printf("\n1. FCFS");
    printf("\n2. SJF (Non-Preemptive)");
    printf("\n3. SRTF (Preemptive)");
    printf("\n4. Round Robin");
    printf("\n5. Priority (Non-Preemptive)");
    printf("\n6. Priority (Preemptive)");
    printf("\nEnter your choice: ");
    scanf("%d", &choice);

    printf("\nEnter number of processes: ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        p[i] = i + 1;
        printf("\nProcess P%d", i + 1);
        printf("\nArrival Time: ");
        scanf("%d", &at[i]);
        printf("Burst Time: ");
        scanf("%d", &bt[i]);
        if (choice == 5 || choice == 6) {
            printf("Priority (lower number = higher priority): ");
            scanf("%d", &pr[i]);
        }
        rem[i] = bt[i];
        wt[i] = tat[i] = ct[i] = 0;
    }

    /* ================= FCFS ================= */
    if (choice == 1) {
        time = 0;
        printf("\nGantt Chart:\n|");

        for (i = 0; i < n; i++) {
            if (time < at[i])
                time = at[i];
            wt[i] = time - at[i];
            printf(" P%d |", p[i]);
            time += bt[i];
            ct[i] = time;
            tat[i] = ct[i] - at[i];
        }

        printf("\n0");
        for (i = 0; i < n; i++)
            printf("   %d", ct[i]);
        printf("\n");
    }

    /* ================= SJF (NON-PREEMPTIVE) ================= */
    else if (choice == 2) {
        for (i = 0; i < n - 1; i++) {
            for (j = i + 1; j < n; j++) {
                if (bt[i] > bt[j]) {
                    int t;
                    t = bt[i]; bt[i] = bt[j]; bt[j] = t;
                    t = at[i]; at[i] = at[j]; at[j] = t;
                    t = p[i];  p[i]  = p[j];  p[j]  = t;
                }
            }
        }

        time = 0;
        printf("\nGantt Chart:\n|");

        for (i = 0; i < n; i++) {
            if (time < at[i])
                time = at[i];
            wt[i] = time - at[i];
            printf(" P%d |", p[i]);
            time += bt[i];
            ct[i] = time;
            tat[i] = ct[i] - at[i];
        }

        printf("\n0");
        for (i = 0; i < n; i++)
            printf("   %d", ct[i]);
        printf("\n");
    }

    /* ================= SRTF (PREEMPTIVE) ================= */
    else if (choice == 3) {
        time = 0;
        int completed = 0;
        int min_burst = 9999;
        int shortest = -1;

        printf("\nGantt Chart:\n|");

        while (completed < n) {
            shortest = -1;
            min_burst = 9999;
            
            // Find the process with shortest remaining time that has arrived
            for (i = 0; i < n; i++) {
                if (at[i] <= time && rem[i] > 0 && rem[i] < min_burst) {
                    min_burst = rem[i];
                    shortest = i;
                }
            }

            if (shortest == -1) {
                // CPU is idle
                time++;
            } else {
                printf(" P%d |", p[shortest]);
                rem[shortest]--;
                time++;

                if (rem[shortest] == 0) {
                    completed++;
                    ct[shortest] = time;
                    tat[shortest] = ct[shortest] - at[shortest];
                    wt[shortest] = tat[shortest] - bt[shortest];
                }
            }
        }

        printf("\n0");
        for (i = 0; i < n; i++)
            printf("   %d", ct[i]);
        printf("\n");
    }

    /* ================= ROUND ROBIN ================= */
    else if (choice == 4) {
        printf("\nEnter Time Quantum: ");
        scanf("%d", &tq);

        time = 0;
        printf("\nGantt Chart:\n|");

        do {
            done = 1;
            for (i = 0; i < n; i++) {
                if (rem[i] > 0) {
                    done = 0;
                    printf(" P%d |", p[i]);

                    if (rem[i] > tq) {
                        time += tq;
                        rem[i] -= tq;
                    } else {
                        time += rem[i];
                        wt[i] = time - bt[i];
                        rem[i] = 0;
                        ct[i] = time;
                    }
                }
            }
        } while (!done);

        printf("\n0");
        for (i = 0; i < n; i++)
            printf("   %d", ct[i]);
        printf("\n");

        for (i = 0; i < n; i++)
            tat[i] = ct[i] - at[i];
    }

    /* ================= PRIORITY (NON-PREEMPTIVE) ================= */
    else if (choice == 5) {
        for (i = 0; i < n - 1; i++) {
            for (j = i + 1; j < n; j++) {
                if (pr[i] > pr[j]) {
                    int t;
                    t = pr[i]; pr[i] = pr[j]; pr[j] = t;
                    t = bt[i]; bt[i] = bt[j]; bt[j] = t;
                    t = at[i]; at[i] = at[j]; at[j] = t;
                    t = p[i];  p[i]  = p[j];  p[j]  = t;
                }
            }
        }

        time = 0;
        printf("\nGantt Chart:\n|");

        for (i = 0; i < n; i++) {
            if (time < at[i])
                time = at[i];
            wt[i] = time - at[i];
            printf(" P%d |", p[i]);
            time += bt[i];
            ct[i] = time;
            tat[i] = ct[i] - at[i];
        }

        printf("\n0");
        for (i = 0; i < n; i++)
            printf("   %d", ct[i]);
        printf("\n");
    }

    /* ================= PRIORITY (PREEMPTIVE) ================= */
    else if (choice == 6) {
        time = 0;
        pr[9] = 9999;
        rem[9] = 9999;
        int completed = 0;

        printf("\nGantt Chart:\n|");

        while (completed < n) {
            min = -1;
            
            // Find the process with highest priority that has arrived and not completed
            for (i = 0; i < n; i++) {
                if (at[i] <= time && rem[i] > 0) {
                    if (min == -1 || pr[i] < pr[min])
                        min = i;
                }
            }

            if (min == -1) {
                // CPU is idle
                time++;
            } else {
                printf(" P%d |", p[min]);
                rem[min]--;
                time++;

                if (rem[min] == 0) {
                    completed++;
                    ct[min] = time;
                    tat[min] = ct[min] - at[min];
                    wt[min] = tat[min] - bt[min];
                }
            }
        }

        printf("\n0");
        for (i = 0; i < n; i++)
            printf("   %d", ct[i]);
        printf("\n");
    }

    else {
        printf("\nInvalid choice");
        return 0;
    }

    /* ================= OUTPUT TABLE ================= */
    printf("\nProcess Table:\n");
    printf("PID\tAT\tBT\tWT\tTAT\n");

    for (i = 0; i < n; i++) {
        avg_wt += (float)wt[i];
        avg_tat += (float)tat[i];
        printf("P%d\t%d\t%d\t%d\t%d\n",
               p[i], at[i], bt[i], wt[i], tat[i]);
    }

    printf("\nAverage Waiting Time = %.2f", avg_wt / (float)n);
    printf("\nAverage Turnaround Time = %.2f\n", avg_tat / (float)n);

    return 0;
}