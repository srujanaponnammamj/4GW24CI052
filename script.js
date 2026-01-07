// CPU Scheduling Algorithms Implementation
class CPUScheduler {
    constructor() {
        this.processes = [];
        this.algorithm = 'fcfs';
        this.timeQuantum = 4;
        this.results = null;
        // Removed step-by-step simulation properties
    }

    // Set the scheduling algorithm
    setAlgorithm(algorithm) {
        this.algorithm = algorithm;
        this.updateQuantumVisibility();
    }

    // Update visibility of time quantum input based on algorithm
    updateQuantumVisibility() {
        const quantumLabel = document.getElementById('quantum-label');
        const quantumInput = document.getElementById('quantum');
        
        if (this.algorithm === 'roundrobin') {
            quantumLabel.style.display = 'block';
            quantumInput.style.display = 'block';
        } else {
            quantumLabel.style.display = 'none';
            quantumInput.style.display = 'none';
        }
    }

    // Get time quantum value
    getTimeQuantum() {
        return parseInt(document.getElementById('quantum').value) || 4;
    }

    // Parse input processes from the form
    parseProcesses() {
        const tbody = document.getElementById('process-table-body');
        const rows = tbody.querySelectorAll('tr');
        const processes = [];

        for (let i = 0; i < rows.length; i++) {
            const inputs = rows[i].querySelectorAll('input');
            
            // Validate inputs
            const arrival = parseInt(inputs[0].value);
            const burst = parseInt(inputs[1].value);
            const priority = parseInt(inputs[2].value);
            
            if (isNaN(arrival) || arrival < 0) {
                alert(`Invalid arrival time for Process P${i}. Please enter a non-negative number.`);
                return [];
            }
            
            if (isNaN(burst) || burst <= 0) {
                alert(`Invalid burst time for Process P${i}. Please enter a positive number.`);
                return [];
            }
            
            if (isNaN(priority) || priority < 1) {
                alert(`Invalid priority for Process P${i}. Please enter a positive number.`);
                return [];
            }
            
            const process = {
                id: `P${i}`,
                arrival: arrival,
                burst: burst,
                priority: priority,
                originalBurst: burst // For Round Robin
            };
            processes.push(process);
        }

        return processes;
    }

    // First Come First Serve (FCFS) algorithm
    fcfsScheduling() {
        const processes = [...this.processes].sort((a, b) => a.arrival - b.arrival);
        const results = [];
        let currentTime = 0;

        for (const process of processes) {
            // If CPU is idle until process arrives
            if (currentTime < process.arrival) {
                currentTime = process.arrival;
            }

            const completion = currentTime + process.burst;
            const turnaround = completion - process.arrival;
            const waiting = turnaround - process.burst;

            results.push({
                ...process,
                completion,
                turnaround,
                waiting,
                start: currentTime
            });

            currentTime = completion;
        }

        return results;
    }

    // Shortest Job First (Non-preemptive) algorithm
    sjfScheduling() {
        const processes = [...this.processes];
        const n = processes.length;
        const results = new Array(n);
        let currentTime = 0;
        let completed = 0;
        const isCompleted = new Array(n).fill(false);

        while (completed < n) {
            let shortestIndex = -1;
            let shortestBurst = Infinity;

            // Find the process with shortest burst time that has arrived
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && processes[i].arrival <= currentTime) {
                    if (processes[i].burst < shortestBurst) {
                        shortestBurst = processes[i].burst;
                        shortestIndex = i;
                    }
                }
            }

            if (shortestIndex === -1) {
                // CPU is idle, advance time to next arrival
                let nextArrival = Infinity;
                for (let i = 0; i < n; i++) {
                    if (!isCompleted[i] && processes[i].arrival > currentTime) {
                        nextArrival = Math.min(nextArrival, processes[i].arrival);
                    }
                }
                if (nextArrival !== Infinity) {
                    currentTime = nextArrival;
                } else {
                    break;
                }
            } else {
                const process = processes[shortestIndex];
                const completion = currentTime + process.burst;
                const turnaround = completion - process.arrival;
                const waiting = turnaround - process.burst;

                results[shortestIndex] = {
                    ...process,
                    completion,
                    turnaround,
                    waiting,
                    start: currentTime
                };

                currentTime = completion;
                isCompleted[shortestIndex] = true;
                completed++;
            }
        }

        return results;
    }

    // Priority Scheduling (Non-preemptive)
    priorityNonPreemptiveScheduling() {
        const processes = [...this.processes];
        const n = processes.length;
        const results = new Array(n);
        let currentTime = 0;
        let completed = 0;
        const isCompleted = new Array(n).fill(false);

        while (completed < n) {
            let highestPriorityIndex = -1;
            let highestPriority = Infinity;

            // Find the process with highest priority (lowest number) that has arrived
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && processes[i].arrival <= currentTime) {
                    if (processes[i].priority < highestPriority) {
                        highestPriority = processes[i].priority;
                        highestPriorityIndex = i;
                    }
                }
            }

            if (highestPriorityIndex === -1) {
                // CPU is idle, advance time to next arrival
                let nextArrival = Infinity;
                for (let i = 0; i < n; i++) {
                    if (!isCompleted[i] && processes[i].arrival > currentTime) {
                        nextArrival = Math.min(nextArrival, processes[i].arrival);
                    }
                }
                if (nextArrival !== Infinity) {
                    currentTime = nextArrival;
                } else {
                    break;
                }
            } else {
                const process = processes[highestPriorityIndex];
                const completion = currentTime + process.burst;
                const turnaround = completion - process.arrival;
                const waiting = turnaround - process.burst;

                results[highestPriorityIndex] = {
                    ...process,
                    completion,
                    turnaround,
                    waiting,
                    start: currentTime
                };

                currentTime = completion;
                isCompleted[highestPriorityIndex] = true;
                completed++;
            }
        }

        return results;
    }

    // Priority Scheduling (Preemptive) - Shortest Remaining Time First (SRTF)
    priorityPreemptiveScheduling() {
        const processes = [...this.processes];
        const n = processes.length;
        const results = new Array(n);
        const remainingTime = processes.map(p => p.burst);
        const completion = new Array(n).fill(0);
        const turnaround = new Array(n).fill(0);
        const waiting = new Array(n).fill(0);
        const isCompleted = new Array(n).fill(false);
        let currentTime = 0;
        let completed = 0;

        while (completed < n) {
            let highestPriorityIndex = -1;
            let highestPriority = Infinity;

            // Find the process with highest priority (lowest number) that has arrived and is not completed
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && processes[i].arrival <= currentTime && remainingTime[i] > 0) {
                    if (processes[i].priority < highestPriority) {
                        highestPriority = processes[i].priority;
                        highestPriorityIndex = i;
                    }
                }
            }

            if (highestPriorityIndex === -1) {
                // CPU is idle, advance time
                currentTime++;
            } else {
                // Execute the process for 1 time unit
                remainingTime[highestPriorityIndex]--;
                currentTime++;

                // Check if process is completed
                if (remainingTime[highestPriorityIndex] === 0) {
                    completion[highestPriorityIndex] = currentTime;
                    turnaround[highestPriorityIndex] = completion[highestPriorityIndex] - processes[highestPriorityIndex].arrival;
                    waiting[highestPriorityIndex] = turnaround[highestPriorityIndex] - processes[highestPriorityIndex].burst;
                    isCompleted[highestPriorityIndex] = true;
                    completed++;

                    results[highestPriorityIndex] = {
                        ...processes[highestPriorityIndex],
                        completion: completion[highestPriorityIndex],
                        turnaround: turnaround[highestPriorityIndex],
                        waiting: waiting[highestPriorityIndex],
                        start: currentTime - processes[highestPriorityIndex].burst // This is an approximation
                    };
                }
            }
        }

        return results;
    }

    // Round Robin Scheduling
    roundRobinScheduling() {
        const processes = [...this.processes];
        const n = processes.length;
        const results = new Array(n);
        const remainingTime = processes.map(p => p.burst);
        const completion = new Array(n).fill(0);
        const turnaround = new Array(n).fill(0);
        const waiting = new Array(n).fill(0);
        const queue = [];
        let currentTime = 0;
        let completed = 0;
        let i = 0;

        // Initialize queue with processes that arrive at time 0
        while (i < n && processes[i].arrival <= currentTime) {
            queue.push(i);
            i++;
        }

        while (completed < n) {
            if (queue.length === 0) {
                // If no process in queue, find next arrival
                if (i < n) {
                    currentTime = processes[i].arrival;
                    while (i < n && processes[i].arrival <= currentTime) {
                        queue.push(i);
                        i++;
                    }
                } else {
                    currentTime++;
                    continue;
                }
            }

            const index = queue.shift();
            const process = processes[index];

            if (remainingTime[index] > 0) {
                const executeTime = Math.min(this.getTimeQuantum(), remainingTime[index]);
                currentTime += executeTime;
                remainingTime[index] -= executeTime;

                // Add newly arrived processes to queue
                while (i < n && processes[i].arrival <= currentTime) {
                    queue.push(i);
                    i++;
                }

                // If process is completed
                if (remainingTime[index] === 0) {
                    completion[index] = currentTime;
                    turnaround[index] = completion[index] - process.arrival;
                    waiting[index] = turnaround[index] - process.burst;
                    completed++;
                    results[index] = {
                        ...process,
                        completion: completion[index],
                        turnaround: turnaround[index],
                        waiting: waiting[index],
                        start: currentTime - process.burst // This is an approximation for visualization
                    };
                } else {
                    // Process is not completed, add back to queue
                    queue.push(index);
                }
            }
        }

        return results;
    }

    // Calculate scheduling based on selected algorithm
    calculateScheduling() {
        this.processes = this.parseProcesses();
        
        if (this.processes.length === 0) {
            alert('Please enter process data first');
            return null;
        }

        let results;
        
        switch (this.algorithm) {
            case 'fcfs':
                results = this.fcfsScheduling();
                break;
            case 'sjf':
                results = this.sjfScheduling();
                break;
            case 'priority_nonpreemptive':
                results = this.priorityNonPreemptiveScheduling();
                break;
            case 'priority_preemptive':
                results = this.priorityPreemptiveScheduling();
                break;
            case 'roundrobin':
                this.timeQuantum = this.getTimeQuantum();
                results = this.roundRobinScheduling();
                break;
            default:
                results = this.fcfsScheduling();
        }

        // Calculate averages
        const totalWaiting = results.reduce((sum, p) => sum + p.waiting, 0);
        const totalTurnaround = results.reduce((sum, p) => sum + p.turnaround, 0);
        
        this.results = {
            processes: results,
            avgWaiting: totalWaiting / results.length,
            avgTurnaround: totalTurnaround / results.length
        };

        return this.results;
    }
}

// UI Controller Class
class UIController {
    constructor() {
        this.scheduler = new CPUScheduler();
        this.initializeEventListeners();
        this.generateProcessTable(4); // Default to 4 processes
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Algorithm selection
        document.getElementById('algorithm').addEventListener('change', (e) => {
            this.scheduler.setAlgorithm(e.target.value);
        });

        // Number of processes change
        document.getElementById('num-processes').addEventListener('change', (e) => {
            const numProcesses = parseInt(e.target.value) || 4;
            this.generateProcessTable(numProcesses);
        });

        // Generate process table button
        document.getElementById('generate-btn').addEventListener('click', () => {
            const numProcesses = parseInt(document.getElementById('num-processes').value) || 4;
            this.generateProcessTable(numProcesses);
        });

        // Sample data button
        document.getElementById('sample-btn').addEventListener('click', () => {
            this.loadSampleData();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetForm();
        });

        // Calculate button
        document.getElementById('calculate-btn').addEventListener('click', () => {
            this.calculateAndDisplayResults();
        });

        // Compare algorithms button
        document.getElementById('compare-btn').addEventListener('click', () => {
            this.compareAlgorithms();
        });
    }

    // Generate process input table
    generateProcessTable(numProcesses) {
        const tbody = document.getElementById('process-table-body');
        tbody.innerHTML = '';

        for (let i = 0; i < numProcesses; i++) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>P${i}</td>
                <td><input type="number" value="${i}" min="0" step="1"></td>
                <td><input type="number" value="${Math.floor(Math.random() * 8) + 1}" min="1" step="1"></td>
                <td><input type="number" value="${Math.floor(Math.random() * 10) + 1}" min="1" step="1"></td>
            `;
            
            tbody.appendChild(row);
        }

        document.getElementById('process-table-container').style.display = 'block';
    }

    // Load sample data
    loadSampleData() {
        const sampleProcesses = [
            { arrival: 0, burst: 8, priority: 3 },
            { arrival: 1, burst: 4, priority: 1 },
            { arrival: 2, burst: 9, priority: 4 },
            { arrival: 3, burst: 5, priority: 2 }
        ];

        const tbody = document.getElementById('process-table-body');
        const rows = tbody.querySelectorAll('tr');

        for (let i = 0; i < Math.min(rows.length, sampleProcesses.length); i++) {
            const inputs = rows[i].querySelectorAll('input');
            inputs[0].value = sampleProcesses[i].arrival;
            inputs[1].value = sampleProcesses[i].burst;
            inputs[2].value = sampleProcesses[i].priority;
        }

        // Set number of processes to match sample data
        document.getElementById('num-processes').value = sampleProcesses.length;
        
        document.getElementById('process-table-container').style.display = 'block';
    }

    // Reset form
    resetForm() {
        document.getElementById('num-processes').value = 4;
        document.getElementById('quantum').value = 4;
        document.getElementById('algorithm').value = 'fcfs';
        this.scheduler.updateQuantumVisibility();
        document.getElementById('process-table-container').style.display = 'none';
        
        // Clear results
        document.getElementById('results-table-body').innerHTML = 
            '<tr><td colspan="6" class="placeholder">Results will appear here after calculation</td></tr>';
        document.getElementById('avg-waiting-time').textContent = '-';
        document.getElementById('avg-turnaround-time').textContent = '-';
        document.getElementById('gantt-chart').innerHTML = '<p class="placeholder">Gantt chart will appear here after calculation</p>';
        document.getElementById('gantt-legend').innerHTML = '';
        
        // Hide comparison results
        document.getElementById('comparison-results').style.display = 'none';
    }

    // Calculate and display results
    calculateAndDisplayResults() {
        const results = this.scheduler.calculateScheduling();
        
        if (!results) return;

        // Display results table
        this.displayResultsTable(results);
        
        // Display Gantt chart
        this.displayGanttChart(results);
        
        // Display metrics
        this.displayMetrics(results);
    }

    // Display results in table
    displayResultsTable(results) {
        const tbody = document.getElementById('results-table-body');
        tbody.innerHTML = '';

        // Sort processes by ID for consistent display
        const sortedProcesses = [...results.processes].sort((a, b) => a.id.localeCompare(b.id));
        
        for (const process of sortedProcesses) {
            const row = document.createElement('tr');
            
            // Highlight if process has waiting time > 0
            if (process.waiting > 0) {
                row.style.backgroundColor = '#fff9e6'; // Light yellow for processes that waited
            }
            
            row.innerHTML = `
                <td>${process.id}</td>
                <td>${process.arrival}</td>
                <td>${process.burst}</td>
                <td>${process.completion}</td>
                <td>${process.turnaround}</td>
                <td>${process.waiting}</td>
            `;
            tbody.appendChild(row);
        }
    }

    // Display Gantt chart
    displayGanttChart(results) {
        const ganttContainer = document.getElementById('gantt-chart');
        ganttContainer.innerHTML = '';

        // Create a timeline based on actual execution
        const timeline = this.generateTimeline(results);
        
        // Create Gantt chart elements
        const ganttDiv = document.createElement('div');
        ganttDiv.style.display = 'flex';
        ganttDiv.style.alignItems = 'center';
        ganttDiv.style.minHeight = '60px';
        ganttDiv.style.flexWrap = 'wrap';

        // Add timeline elements
        for (const item of timeline) {
            const bar = document.createElement('div');
            bar.className = item.isIdle ? 'gantt-bar idle-bar' : 'gantt-bar';
            bar.textContent = item.label;
            bar.style.width = `${item.duration * 20}px`;
            bar.title = item.title;
            ganttDiv.appendChild(bar);
        }

        ganttContainer.appendChild(ganttDiv);

        // Create timeline markers
        const timeMarkers = document.createElement('div');
        timeMarkers.style.display = 'flex';
        timeMarkers.style.marginTop = '10px';
        timeMarkers.style.fontSize = '12px';
        timeMarkers.style.color = '#666';
        
        let currentTime = 0;
        for (const item of timeline) {
            const marker = document.createElement('span');
            marker.textContent = currentTime;
            marker.style.width = `${item.duration * 20}px`;
            marker.style.textAlign = 'left';
            timeMarkers.appendChild(marker);
            currentTime += item.duration;
        }
        
        // Add final time marker
        const finalMarker = document.createElement('span');
        finalMarker.textContent = currentTime;
        finalMarker.style.textAlign = 'left';
        timeMarkers.appendChild(finalMarker);
        
        ganttContainer.appendChild(timeMarkers);

        // Removed legend creation
    }
    
    // Generate timeline for Gantt chart
    generateTimeline(results) {
        // Create an array of all events (process starts/ends) to properly order them
        const events = [];
        
        for (const process of results.processes) {
            events.push({
                time: process.start,
                type: 'start',
                process: process,
                processIndex: results.processes.indexOf(process)
            });
            events.push({
                time: process.completion,
                type: 'end',
                process: process,
                processIndex: results.processes.indexOf(process)
            });
        }
        
        // Sort events by time
        events.sort((a, b) => a.time - b.time);
        
        // Create timeline segments
        const timeline = [];
        let currentTime = 0;
        let currentProcess = null;
        
        for (const event of events) {
            if (event.time > currentTime) {
                // Add idle time if there's a gap
                if (currentProcess === null) {
                    timeline.push({
                        isIdle: true,
                        label: 'IDLE',
                        duration: event.time - currentTime,
                        title: `Time: ${currentTime}-${event.time} (IDLE)`
                    });
                }
                currentTime = event.time;
            }
            
            if (event.type === 'start') {
                currentProcess = event.process;
            } else if (event.type === 'end') {
                if (currentProcess && currentProcess.id === event.process.id) {
                    timeline.push({
                        isIdle: false,
                        label: event.process.id,
                        duration: event.time - currentTime,
                        processIndex: event.processIndex,
                        title: `Process: ${event.process.id}, Time: ${currentTime}-${event.time}`
                    });
                    currentProcess = null;
                    currentTime = event.time;
                }
            }
        }
        
        // Sort timeline by start time of each segment
        const sortedProcesses = [...results.processes].sort((a, b) => a.start - b.start);
        
        // Create final timeline in chronological order
        const finalTimeline = [];
        let minTime = Infinity;
        let maxTime = 0;
        
        // Find the overall time range
        for (const process of results.processes) {
            minTime = Math.min(minTime, process.start);
            maxTime = Math.max(maxTime, process.completion);
        }
        
        // Create segments for each time unit where there's activity
        let time = minTime;
        while (time < maxTime) {
            // Find the process that's running at this time
            let runningProcess = null;
            for (const process of results.processes) {
                if (time >= process.start && time < process.completion) {
                    runningProcess = process;
                    break;
                }
            }
            
            if (runningProcess) {
                // Find how long this process will run until the next change
                let nextChange = maxTime;
                for (const process of results.processes) {
                    if (process.start > time && process.start < nextChange) {
                        nextChange = process.start;
                    }
                    if (process.completion > time && process.completion < nextChange) {
                        nextChange = process.completion;
                    }
                }
                
                const duration = nextChange - time;
                const processIndex = results.processes.findIndex(p => p.id === runningProcess.id);
                
                finalTimeline.push({
                    isIdle: false,
                    label: runningProcess.id,
                    duration: duration,
                    processIndex: processIndex,
                    title: `Process: ${runningProcess.id}, Time: ${time}-${time + duration}`
                });
                
                time = nextChange;
            } else {
                // CPU is idle, find when the next process arrives
                let nextArrival = maxTime;
                for (const process of results.processes) {
                    if (process.arrival > time && process.arrival < nextArrival) {
                        nextArrival = process.arrival;
                    }
                }
                
                const duration = nextArrival - time;
                
                finalTimeline.push({
                    isIdle: true,
                    label: 'IDLE',
                    duration: duration,
                    title: `Time: ${time}-${time + duration} (IDLE)`
                });
                
                time = nextArrival;
            }
        }
        
        return finalTimeline;
    }



    // Display performance metrics
    displayMetrics(results) {
        document.getElementById('avg-waiting-time').textContent = results.avgWaiting.toFixed(2);
        document.getElementById('avg-turnaround-time').textContent = results.avgTurnaround.toFixed(2);
    }

    // Compare all algorithms
    compareAlgorithms() {
        const originalAlgorithm = this.scheduler.algorithm;
        const originalProcesses = [...this.scheduler.processes];
        
        const algorithms = ['fcfs', 'sjf', 'priority_nonpreemptive', 'priority_preemptive', 'roundrobin'];
        const results = [];

        for (const algo of algorithms) {
            this.scheduler.setAlgorithm(algo);
            
            // Temporarily set processes for calculation
            this.scheduler.processes = [...originalProcesses];
            
            let algoResults;
            switch (algo) {
                case 'fcfs':
                    algoResults = this.scheduler.fcfsScheduling();
                    break;
                case 'sjf':
                    algoResults = this.scheduler.sjfScheduling();
                    break;
                case 'priority_nonpreemptive':
                    algoResults = this.scheduler.priorityNonPreemptiveScheduling();
                    break;
                case 'priority_preemptive':
                    algoResults = this.scheduler.priorityPreemptiveScheduling();
                    break;
                case 'roundrobin':
                    algoResults = this.scheduler.roundRobinScheduling();
                    break;
            }

            if (algoResults) {
                const totalWaiting = algoResults.reduce((sum, p) => sum + p.waiting, 0);
                const totalTurnaround = algoResults.reduce((sum, p) => sum + p.turnaround, 0);
                
                results.push({
                    algorithm: this.getAlgorithmName(algo),
                    avgWaiting: totalWaiting / algoResults.length,
                    avgTurnaround: totalTurnaround / algoResults.length
                });
            }
        }

        // Restore original algorithm and processes
        this.scheduler.setAlgorithm(originalAlgorithm);
        this.scheduler.processes = originalProcesses;

        // Display comparison results
        this.displayComparisonResults(results);
    }
    
    // Get algorithm name for display
    getAlgorithmName(algo) {
        switch(algo) {
            case 'fcfs': return 'FCFS';
            case 'sjf': return 'SJF (Non-preemptive)';
            case 'priority_nonpreemptive': return 'Priority (Non-preemptive)';
            case 'priority_preemptive': return 'Priority (Preemptive)';
            case 'roundrobin': return 'Round Robin';
            default: return algo;
        }
    }

    // Display comparison results
    displayComparisonResults(results) {
        const tbody = document.getElementById('comparison-table-body');
        tbody.innerHTML = '';

        for (const result of results) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.algorithm}</td>
                <td>${result.avgWaiting.toFixed(2)}</td>
                <td>${result.avgTurnaround.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        }

        document.getElementById('comparison-results').style.display = 'block';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});