import java.util.ArrayList;
import java.util.Iterator;
import java.util.Scanner;

class Student {
    int usn;
    String name;
    int age;
    String branch;

    Student(int usn, String name, int age, String branch) {
        this.usn = usn;
        this.name = name;
        this.age = age;
        this.branch = branch;
    }
}

public class StudentRecordManagement {

    static ArrayList<Student> students = new ArrayList<>();
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        int choice;

        do {
            System.out.println("\n===== STUDENT RECORD MANAGEMENT SYSTEM =====");
            System.out.println("1. Add Student Record");
            System.out.println("2. Display All Records");
            System.out.println("3. Search Student Record");
            System.out.println("4. Delete Student Record");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");
            choice = sc.nextInt();

            switch (choice) {
                case 1:
                    addStudent();
                    break;
                case 2:
                    displayStudents();
                    break;
                case 3:
                    searchStudent();
                    break;
                case 4:
                    deleteStudent();
                    break;
                case 5:
                    System.out.println("Exiting Program...");
                    break;
                default:
                    System.out.println("Invalid Choice! Try again.");
            }
        } while (choice != 5);
    }

    static void addStudent() {
        System.out.print("Enter USN: ");
        int usn = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Age: ");
        int age = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Branch: ");
        String branch = sc.nextLine();

        students.add(new Student(usn, name, age, branch));
        System.out.println("Student record added successfully.");
    }

    static void displayStudents() {
        if (students.isEmpty()) {
            System.out.println("No student records found.");
            return;
        }

        System.out.println("\n--- Student Records ---");
        for (Student s : students) {
            System.out.println("USN: " + s.usn +
                               ", Name: " + s.name +
                               ", Age: " + s.age +
                               ", Branch: " + s.branch);
        }
    }

    static void searchStudent() {
        System.out.print("Enter USN to search: ");
        int usn = sc.nextInt();

        for (Student s : students) {
            if (s.usn == usn) {
                System.out.println("Record Found:");
                System.out.println("Name: " + s.name);
                System.out.println("Age: " + s.age);
                System.out.println("Branch: " + s.branch);
                return;
            }
        }
        System.out.println("Student record not found.");
    }

    static void deleteStudent() {
        System.out.print("Enter USN to delete: ");
        int usn = sc.nextInt();

        Iterator<Student> it = students.iterator();
        while (it.hasNext()) {
            if (it.next().usn == usn) {
                it.remove();
                System.out.println("Student record deleted successfully.");
                return;
            }
        }
        System.out.println("Student record not found.");
    }
}
