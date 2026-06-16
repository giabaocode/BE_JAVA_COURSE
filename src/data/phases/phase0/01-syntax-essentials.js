// Module 0.1 — Java Syntax Essentials
export default {
  id: 'mod-0-1',
  title: 'Java Syntax Essentials — Gõ Tay 3 Lần Mỗi Exercise',
  prerequisites: { vi: 'Cài đặt JDK 21 + IDE (IntelliJ hoặc VS Code). Không cần biết gì về Java trước đó.' },
  lessons: [
    {
      id: 'l-0-1-1',
      type: 'practice',
      title: 'Variables, Types & I/O',
      subtitle: { vi: 'Lesson 1/15 của warm-up. Tự gõ TAY, KHÔNG copy.' },
      mentalModel: {
        vi: `Java có 2 loại type:
<ul>
<li><strong>Primitive</strong> (chữ thường): <code>int, long, double, boolean, char, byte</code>. Lưu trực tiếp giá trị.</li>
<li><strong>Reference</strong> (chữ hoa): <code>String, Integer, Object, ArrayList</code>. Lưu địa chỉ object trên heap.</li>
</ul>
Quy tắc: <code>int</code> chứa số nguyên 32-bit; <code>long</code> 64-bit (số lớn); <code>double</code> số thực. <code>String</code> KHÔNG phải primitive — là class.`
      },
      theory: {
        vi: `<h3>Cheat sheet syntax cần thuộc lòng</h3>
<ul>
  <li><strong>Khai biến + gán</strong>: <code>int x = 10;</code></li>
  <li><strong>Hằng số</strong>: <code>final int MAX = 100;</code></li>
  <li><strong>Type inference (Java 10+)</strong>: <code>var name = "Alice";</code> (compiler suy ra type)</li>
  <li><strong>In ra console</strong>: <code>System.out.println("Hello");</code></li>
  <li><strong>In có format</strong>: <code>System.out.printf("x = %d%n", x);</code></li>
  <li><strong>Đọc input</strong>: <code>Scanner sc = new Scanner(System.in);</code> rồi <code>int n = sc.nextInt();</code></li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>int overflow</strong>: <code>int x = 2_000_000_000 * 2;</code> → wrap về số âm. Dùng <code>long</code> nếu nghi.</li>
  <li><strong>double inexact</strong>: <code>0.1 + 0.2 = 0.30000000000000004</code>. KHÔNG so sánh double bằng <code>==</code>.</li>
  <li><strong>String dùng <code>==</code></strong>: so sánh REFERENCE không phải nội dung. Dùng <code>.equals()</code>.</li>
  <li><strong>Quên đóng Scanner</strong>: <code>sc.close()</code> hoặc dùng try-with-resources.</li>
  <li><strong>Nhầm <code>nextLine()</code> vs <code>nextInt()</code></strong>: <code>nextInt()</code> không consume newline → <code>nextLine()</code> tiếp theo trả empty string. Fix: thêm <code>sc.nextLine()</code> sau <code>nextInt()</code>.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Hello World',
          prompt: 'In ra console: <code>Hello, Java!</code>',
          hints: ['Gõ <code>public class</code>, IDE tự complete template.', 'Nhớ <code>main</code> phải là <code>public static void main(String[] args)</code>.'],
          solution: {
            code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Class Hello chứa main method — entry point. <code>System.out.println</code> in + xuống dòng. Gõ tay 3 lần.'
          }
        },
        {
          title: 'Sum 2 numbers from input',
          prompt: 'Đọc 2 số nguyên từ Scanner, in tổng.',
          hints: ['Khởi tạo <code>Scanner sc = new Scanner(System.in);</code>', 'Dùng <code>sc.nextInt()</code> để đọc int.'],
          solution: {
            code: `import java.util.Scanner;

public class Sum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Import Scanner từ java.util. Đọc 2 int + in tổng. <code>sc.close()</code> giải phóng resource.'
          }
        },
        {
          title: 'Convert Celsius to Fahrenheit',
          prompt: 'Đọc nhiệt độ Celsius (double), in Fahrenheit. Công thức: F = C × 9/5 + 32.',
          hints: ['Dùng <code>double</code> không phải <code>int</code> để giữ phần thập phân.', 'Đọc double: <code>sc.nextDouble()</code>.'],
          solution: {
            code: `import java.util.Scanner;

public class Temp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double c = sc.nextDouble();
        double f = c * 9 / 5 + 32;
        System.out.printf("%.2f%n", f);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: '<code>9.0/5</code> hoặc <code>c * 9 / 5</code> (c đã double → kết quả double). <code>%.2f%n</code> in 2 chữ số thập phân + newline.'
          }
        },
        {
          title: 'Average of 3 numbers',
          prompt: 'Đọc 3 số int, in trung bình cộng (kết quả double).',
          hints: ['Để chia chính xác, ÉP 1 trong các số sang double: <code>(double)(a+b+c) / 3</code>.'],
          solution: {
            code: `import java.util.Scanner;

public class Avg {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        double avg = (double)(a + b + c) / 3;
        System.out.printf("%.2f%n", avg);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Cast (double) PHẢI làm TRƯỚC phép chia. <code>(a+b+c)/3</code> với 3 int → integer division (trunc). <code>(double)(a+b+c)/3</code> → double division đúng.'
          }
        },
        {
          title: 'Swap 2 numbers — không dùng biến trung gian',
          prompt: 'Cho a, b. Swap a và b mà KHÔNG dùng biến thứ 3. In a, b sau swap.',
          hints: ['Cộng/trừ: a = a + b; b = a - b; a = a - b.', 'Hoặc XOR: a = a ^ b; b = a ^ b; a = a ^ b.'],
          solution: {
            code: `public class Swap {
    public static void main(String[] args) {
        int a = 5, b = 10;
        a = a + b;   // a = 15
        b = a - b;   // b = 5
        a = a - b;   // a = 10
        System.out.println("a=" + a + ", b=" + b);
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Trick toán: <code>a+b</code> chứa cả 2. Trừ b → còn a gốc gán cho b. Trừ b (giờ là a gốc) → còn b gốc gán cho a. Cẩn thận overflow nếu a, b lớn.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          '<code>int</code> 32-bit; <code>long</code> 64-bit; double cho số thực.',
          'String dùng <code>.equals()</code>, KHÔNG <code>==</code>.',
          'Scanner đọc input — đừng quên <code>sc.close()</code>.',
          'Cast trước phép chia khi cần double precision.'
        ]
      }
    },

    {
      id: 'l-0-1-2',
      type: 'practice',
      title: 'Conditionals — if/else, switch',
      subtitle: { vi: 'Lesson 2/15. Vẫn gõ tay 3 lần.' },
      mentalModel: {
        vi: `<code>if/else</code> = branch điều kiện. <code>switch</code> = nhiều case một biến.
<br/><br/>
Khi nào dùng cái nào?
<ul>
<li><strong>2-3 case</strong>: if/else đủ.</li>
<li><strong>≥ 4 case rời rạc (số, enum, String)</strong>: switch sạch hơn.</li>
<li><strong>So sánh range</strong> (x &lt; 10, 10 ≤ x &lt; 20, ...): if/else (switch không support range — except Java 21+ pattern matching).</li>
</ul>`
      },
      theory: {
        vi: `<h3>Syntax cheat sheet</h3>
<pre>if (cond) {
    // ...
} else if (cond2) {
    // ...
} else {
    // ...
}

// Ternary: condition ? value1 : value2
int max = (a &gt; b) ? a : b;

// Switch statement (cũ)
switch (day) {
    case 1: System.out.println("Mon"); break;
    case 2: System.out.println("Tue"); break;
    default: System.out.println("?");
}

// Switch expression (Java 14+) — KHÔNG cần break, có giá trị
String name = switch (day) {
    case 1 -&gt; "Mon";
    case 2 -&gt; "Tue";
    default -&gt; "?";
};</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên <code>break</code> trong switch cũ</strong> → fall-through, case sau cũng chạy.</li>
  <li><strong>So sánh String bằng <code>==</code></strong>: <code>if (name == "Alice")</code> SAI. Dùng <code>name.equals("Alice")</code>.</li>
  <li><strong>NullPointer khi <code>name.equals()</code></strong>: nếu name null → NPE. Đảo: <code>"Alice".equals(name)</code> — literal trước, an toàn.</li>
  <li><strong>Lồng if quá sâu</strong>: 5 cấp → khó đọc. Refactor sang early return / guard clause.</li>
  <li><strong>Quên braces <code>{}</code></strong>: <code>if (x) doA(); doB();</code> — doB() LUÔN chạy bất kể x. Luôn dùng <code>{}</code>.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Max of 2 numbers',
          prompt: 'In số lớn hơn giữa 2 int đầu vào. Dùng if/else.',
          hints: ['Đơn giản: nếu a &gt; b in a, ngược lại in b.', 'Bonus: dùng ternary 1 dòng.'],
          solution: {
            code: `import java.util.Scanner;

public class MaxTwo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        if (a > b) System.out.println(a);
        else       System.out.println(b);
        // Hoặc: System.out.println(a > b ? a : b);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Ternary là syntactic sugar cho if/else 1 dòng. <code>Math.max(a, b)</code> cũng work — sau này biết.'
          }
        },
        {
          title: 'Classify number: positive / negative / zero',
          prompt: 'Đọc int, in "positive" / "negative" / "zero".',
          hints: ['3 case → cần if/else if/else.', 'Thứ tự check quan trọng: check 0 trước OR sau đều OK.'],
          solution: {
            code: `import java.util.Scanner;

public class Classify {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n > 0)      System.out.println("positive");
        else if (n < 0) System.out.println("negative");
        else            System.out.println("zero");
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Mutually exclusive: 1 trong 3 nhánh chạy. Else cuối catch case còn lại (n == 0).'
          }
        },
        {
          title: 'Grade calculator',
          prompt: 'Đọc điểm 0-100. In: ≥90 "A", ≥80 "B", ≥70 "C", ≥60 "D", &lt;60 "F".',
          hints: ['Thứ tự check từ CAO xuống THẤP để tránh sai logic.', 'Range không support trong switch cũ → dùng if/else.'],
          solution: {
            code: `import java.util.Scanner;

public class Grade {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        String grade;
        if (score >= 90)      grade = "A";
        else if (score >= 80) grade = "B";
        else if (score >= 70) grade = "C";
        else if (score >= 60) grade = "D";
        else                   grade = "F";
        System.out.println(grade);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Check từ cao xuống → 1 lần match là đúng. Nếu check thấp trước (≥60 đầu), score=95 sẽ match "D" sai.'
          }
        },
        {
          title: 'Day of week → name',
          prompt: 'Đọc int 1-7, in "Monday".."Sunday". Khác → "Invalid".',
          hints: ['7 case rời rạc → switch expression sạch hơn.', 'Java 14+ switch expression: <code>case 1 -&gt; "Monday";</code>'],
          solution: {
            code: `import java.util.Scanner;

public class DayName {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt();
        String name = switch (d) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6 -> "Saturday";
            case 7 -> "Sunday";
            default -> "Invalid";
        };
        System.out.println(name);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Switch expression (Java 14+): có giá trị, KHÔNG cần break, fall-through không có. Cleaner than switch cũ.'
          }
        },
        {
          title: 'Leap year check',
          prompt: 'Đọc năm, in "leap" hoặc "common". Năm nhuận: chia hết 4 NHƯNG không chia hết 100, hoặc chia hết 400.',
          hints: ['Boolean expression: <code>(year % 4 == 0 && year % 100 != 0) || year % 400 == 0</code>.', 'Test: 2000 leap, 1900 not, 2024 leap.'],
          solution: {
            code: `import java.util.Scanner;

public class Leap {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int y = sc.nextInt();
        boolean leap = (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
        System.out.println(leap ? "leap" : "common");
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Modulo <code>%</code> trả số dư. <code>year % 4 == 0</code> = chia hết 4. Logic Gregorian calendar: chia hết 400 ưu tiên (vd 2000), nếu không thì chia hết 4 nhưng KHÔNG chia hết 100.'
          }
        }
      ]
    },

    {
      id: 'l-0-1-3',
      type: 'practice',
      title: 'Loops — for, while, do-while',
      subtitle: { vi: 'Lesson 3/15. Loop syntax là chỗ phổ biến nhất bạn cần muscle memory.' },
      mentalModel: {
        vi: `3 loại loop:
<ul>
<li><strong>for</strong>: biết trước số lần lặp. <code>for (int i = 0; i &lt; n; i++)</code></li>
<li><strong>enhanced for (for-each)</strong>: duyệt collection/array. <code>for (int x : arr)</code></li>
<li><strong>while</strong>: lặp tới khi điều kiện sai. Số lần lặp KHÔNG biết trước.</li>
<li><strong>do-while</strong>: như while, nhưng CHẠY ÍT NHẤT 1 LẦN trước khi check.</li>
</ul>
Bí kíp: thấy "cho mảng, duyệt mọi phần tử" → for-each. "Đếm từ 0 đến n-1" → for traditional. "Lặp tới khi user nhập 'quit'" → while.`
      },
      theory: {
        vi: `<h3>Syntax cheat sheet</h3>
<pre>// Traditional for
for (int i = 0; i &lt; n; i++) {
    System.out.println(i);
}

// For-each (Java 5+)
int[] arr = {1, 2, 3};
for (int x : arr) {
    System.out.println(x);
}

// While
int i = 0;
while (i &lt; n) {
    System.out.println(i);
    i++;
}

// Do-while
int x;
do {
    x = sc.nextInt();
} while (x != 0);

// break = thoát loop NGAY
// continue = nhảy tới iteration tiếp theo</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Off-by-one</strong>: <code>for (int i = 0; i &lt;= arr.length; i++)</code> → ArrayIndexOutOfBoundsException. Luôn <code>&lt;</code>, KHÔNG <code>&lt;=</code>.</li>
  <li><strong>Infinite loop</strong>: quên tăng biến (<code>i++</code>) trong while → CPU 100%. Always step variable.</li>
  <li><strong>Modify mảng khi for-each</strong>: <code>for (int x : arr) arr[x] = ...</code> → KHÔNG modify được biến iteration, chỉ value. Dùng for traditional với index.</li>
  <li><strong>Nested loops O(n²)</strong>: lồng 2 for trên N item = 1M operation với N=1000. Cẩn thận với N lớn.</li>
  <li><strong>continue vs break</strong>: <code>continue</code> skip iteration hiện tại; <code>break</code> thoát loop hoàn toàn.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Print 1 to N',
          prompt: 'Đọc N, in các số 1, 2, ..., N (mỗi số một dòng).',
          hints: ['for traditional. Khởi tạo i=1, điều kiện i&lt;=N.'],
          solution: {
            code: `import java.util.Scanner;

public class OneToN {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: '<code>i &lt;= n</code> vì in cả số N. Nếu in 0..n-1 thì dùng <code>i &lt; n</code>.'
          }
        },
        {
          title: 'Sum 1 to N',
          prompt: 'Đọc N, in tổng 1+2+...+N.',
          hints: ['Accumulator: <code>int sum = 0; sum += i</code>.', 'Bonus: dùng công thức <code>n*(n+1)/2</code> O(1).'],
          solution: {
            code: `import java.util.Scanner;

public class SumN {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 1; i <= n; i++) sum += i;
        System.out.println(sum);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1). Bonus công thức O(1).',
            explanationVi: 'Dùng <code>long</code> tránh overflow với N lớn (N=100000 → sum ~5 tỷ &gt; int range). Công thức <code>(long)n*(n+1)/2</code> nhanh hơn.'
          }
        },
        {
          title: 'Factorial',
          prompt: 'Đọc N (≤ 20), in N!. Dùng for, kết quả long.',
          hints: ['Khởi tạo result = 1.', '<code>long</code> bắt buộc — N=20 thì 20! ≈ 2.4 quintillion (vượt int).'],
          solution: {
            code: `import java.util.Scanner;

public class Factorial {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        System.out.println(result);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Bắt đầu từ 2 (1×1=1, skip 1). <code>long</code> chứa được 20! = 2,432,902,008,176,640,000. 21! overflow.'
          }
        },
        {
          title: 'Count digits',
          prompt: 'Đọc số nguyên dương N. In số chữ số.',
          hints: ['Chia 10 liên tục đến khi N=0, đếm số lần chia. Dùng while.', 'N=12345 → chia 10 ra 1234, 123, 12, 1, 0 → 5 chữ số.'],
          solution: {
            code: `import java.util.Scanner;

public class CountDigits {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int count = 0;
        while (n > 0) {
            n /= 10;
            count++;
        }
        System.out.println(count);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(log10 n) · Space O(1).',
            explanationVi: 'Mỗi vòng <code>n /= 10</code> bớt 1 chữ số (integer division). Loop dừng khi n = 0. Edge case N=0: code trên trả 0; muốn trả 1 thì xử lý riêng.'
          }
        },
        {
          title: 'Print right triangle pattern',
          prompt: 'Đọc N. In tam giác:<pre>*\n* *\n* * *\n...(N dòng)</pre>',
          hints: ['Nested loop: outer 1..N, inner 1..i.', 'Mỗi dòng in i sao + xuống dòng.'],
          solution: {
            code: `import java.util.Scanner;

public class Triangle {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n²) · Space O(1).',
            explanationVi: 'Outer loop = dòng, inner loop = cột. <code>print</code> KHÔNG xuống dòng; <code>println()</code> trống = chỉ xuống dòng.'
          }
        }
      ]
    },

    {
      id: 'l-0-1-4',
      type: 'practice',
      title: 'Methods, Parameters & Recursion Basics',
      subtitle: { vi: 'Lesson 4/15. Method = đơn vị reuse code.' },
      mentalModel: {
        vi: `Method = "function" trong Java. Format:
<pre>public static returnType methodName(paramType param) {
    // ...
    return value;
}</pre>

<ul>
<li><strong>void</strong>: không return.</li>
<li><strong>static</strong>: gọi từ class, không cần instance.</li>
<li><strong>Pass-by-value</strong>: primitive copy giá trị; object copy REFERENCE.</li>
</ul>
Recursion = method gọi chính nó. Bắt buộc có <strong>base case</strong> để dừng.`
      },
      theory: {
        vi: `<h3>Syntax cheat sheet</h3>
<pre>public class Calc {
    // Method static, return int
    public static int add(int a, int b) {
        return a + b;
    }

    // Method void
    public static void printSquare(int x) {
        System.out.println(x * x);
    }

    // Varargs (...)
    public static int sum(int... nums) {
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }

    // Recursion
    public static int factorial(int n) {
        if (n &lt;= 1) return 1;   // base case
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(add(3, 5));
        printSquare(4);
        System.out.println(sum(1, 2, 3, 4));
        System.out.println(factorial(5));   // 120
    }
}</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên return</strong> với non-void method → compile error.</li>
  <li><strong>Recursion không có base case</strong> → StackOverflowError.</li>
  <li><strong>Modify param trong method</strong> nghĩ là sẽ thấy bên ngoài: SAI cho primitive (copy value). Object thì có thể sửa field.</li>
  <li><strong>Method dài 100+ dòng</strong> → khó đọc. Split thành nhiều method nhỏ.</li>
  <li><strong>Recursion deep với N lớn</strong>: <code>factorial(100000)</code> → stack overflow. Convert sang loop.</li>
</ul>`
      },
      exercises: [
        {
          title: 'Method: max of 3 numbers',
          prompt: 'Viết method <code>max3(int a, int b, int c)</code> return số lớn nhất.',
          hints: ['Nested if hoặc <code>Math.max(Math.max(a, b), c)</code>.'],
          solution: {
            code: `public class Max3 {
    public static int max3(int a, int b, int c) {
        return Math.max(Math.max(a, b), c);
    }

    public static void main(String[] args) {
        System.out.println(max3(3, 7, 5));  // 7
        System.out.println(max3(10, 2, 8)); // 10
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(1) · Space O(1).',
            explanationVi: 'Math.max nhận 2 arg → nested để xử lý 3. Hoặc viết explicit if/else.'
          }
        },
        {
          title: 'Method: check prime',
          prompt: 'Viết <code>boolean isPrime(int n)</code> kiểm tra n có phải số nguyên tố.',
          hints: ['n &lt; 2 → false.', 'Loop từ 2 đến sqrt(n) check chia hết. Nếu có thì không prime.', 'Optimize: <code>i * i &lt;= n</code> thay vì sqrt.'],
          solution: {
            code: `public class Prime {
    public static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(7));   // true
        System.out.println(isPrime(15));  // false
        System.out.println(isPrime(1));   // false
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(√n) · Space O(1).',
            explanationVi: '<code>i*i &lt;= n</code> = check tới <code>sqrt(n)</code> mà tránh phép sqrt. Nếu n chia hết i với i ≤ sqrt(n), thì n không prime.'
          }
        },
        {
          title: 'Recursive: factorial',
          prompt: 'Viết <code>long factorial(int n)</code> bằng RECURSION.',
          hints: ['Base case: n ≤ 1 return 1.', 'Recursive: <code>n * factorial(n-1)</code>.'],
          solution: {
            code: `public class FactRec {
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));  // 120
        System.out.println(factorial(10)); // 3628800
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n) recursion stack.',
            explanationVi: 'Recursion expand: <code>factorial(5) = 5 × factorial(4) = 5 × 4 × ... × 1</code>. Stack depth = n.'
          }
        },
        {
          title: 'Recursive: Fibonacci',
          prompt: 'Viết <code>int fib(int n)</code> tính số Fibonacci thứ n (0-indexed: fib(0)=0, fib(1)=1).',
          hints: ['Base case: n &lt; 2 → return n.', 'Recursive: <code>fib(n-1) + fib(n-2)</code>.', '⚠️ Recursive này CHẬM (exponential) với n &gt; 30. Đây chỉ là exercise warm-up.'],
          solution: {
            code: `public class Fib {
    public static int fib(int n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++)
            System.out.print(fib(i) + " ");
        // 0 1 1 2 3 5 8 13 21 34
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(2^n) — CHẬM. Space O(n) stack. (DP optimize ở Phase 2.)',
            explanationVi: 'Recursive naive: mỗi call branch 2 → tổng calls ≈ 2^n. fib(40) đã chậm. Sau này học DP memoization → O(n).'
          }
        },
        {
          title: 'Varargs: sum of any numbers',
          prompt: 'Viết <code>int sumAll(int... nums)</code> trả tổng. Test với 0, 1, 5 args.',
          hints: ['Varargs cú pháp <code>int... nums</code> = nhận 0 hoặc nhiều int. Trong method, nums là <code>int[]</code>.', 'For-each tính tổng.'],
          solution: {
            code: `public class SumVar {
    public static int sumAll(int... nums) {
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sumAll());           // 0
        System.out.println(sumAll(5));          // 5
        System.out.println(sumAll(1, 2, 3, 4)); // 10
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n) cho array varargs.',
            explanationVi: 'Varargs syntactic sugar — compiler tạo int[] tự động. Pass 0 args → empty array. Pass int[] thẳng cũng work: <code>sumAll(new int[]{1,2,3})</code>.'
          }
        }
      ]
    },

    {
      id: 'l-0-1-5',
      type: 'practice',
      title: 'String Manipulation Essentials',
      subtitle: { vi: 'Lesson 5/15. String là kiểu dữ liệu xuất hiện rất thường xuyên trong bài LeetCode.' },
      mentalModel: {
        vi: `String trong Java là <strong>immutable</strong>. Mọi operation tạo String MỚI. Quan trọng vì:
<ul>
<li>So sánh bằng <code>.equals()</code> (nội dung), KHÔNG <code>==</code> (reference).</li>
<li>Concat nhiều String (<code>s += x</code>) trong loop → tạo nhiều object tạm → CHẬM. Dùng <strong>StringBuilder</strong>.</li>
<li>Char access: <code>s.charAt(i)</code>, KHÔNG <code>s[i]</code> như C.</li>
</ul>`
      },
      theory: {
        vi: `<h3>API cần thuộc lòng</h3>
<pre>String s = "Hello";

s.length()                     // 5 — KHÔNG có ()? sai
s.charAt(0)                    // 'H'
s.substring(1, 4)              // "ell" — [start, end)
s.indexOf("l")                 // 2 — first match
s.lastIndexOf("l")             // 3
s.contains("ell")              // true
s.startsWith("He")             // true
s.endsWith("lo")               // true
s.toUpperCase()                // "HELLO"
s.toLowerCase()                // "hello"
s.trim()                       // remove whitespace 2 đầu
s.replace("l", "L")            // "HeLLo"
s.split(",")                   // String[] — chia theo delimiter
s.equals("Hello")              // true
s.equalsIgnoreCase("HELLO")    // true
s.isEmpty()                    // length == 0
s.isBlank()                    // length 0 hoặc toàn whitespace (Java 11+)

// StringBuilder — mutable, fast concat
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("World");
sb.toString();                 // "Hello World"

// String &lt;-&gt; char[]
char[] chars = s.toCharArray();
String back = new String(chars);
String back2 = String.valueOf(chars);</pre>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>String == </strong>: <code>s1 == s2</code> so REFERENCE. Bug nightmare. ALWAYS <code>.equals()</code>.</li>
  <li><strong>NullPointer .equals()</strong>: nếu s null → NPE. Dùng <code>"text".equals(s)</code> (literal trước).</li>
  <li><strong>Concat trong loop</strong>: <code>String s = ""; for (...) s += x;</code> → O(n²). Dùng StringBuilder.</li>
  <li><strong>substring(start, end)</strong>: end EXCLUSIVE. <code>"hello".substring(1, 4)</code> = "ell" KHÔNG "ello".</li>
  <li><strong>split với regex</strong>: <code>s.split(".")</code> SAI — "." là regex any-char. Dùng <code>s.split("\\\\.")</code> hoặc <code>Pattern.quote(".")</code>.</li>
  <li><strong>charAt trả char</strong>, không String. Compare <code>s.charAt(0) == 'a'</code> (char literal với '), KHÔNG <code>"a"</code> (String literal).</li>
</ul>`
      },
      exercises: [
        {
          title: 'Reverse a string',
          prompt: 'Đọc String, in reverse. KHÔNG dùng built-in reverse.',
          hints: ['Loop từ <code>length - 1</code> xuống 0.', 'StringBuilder append.'],
          solution: {
            code: `import java.util.Scanner;

public class ReverseStr {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        StringBuilder sb = new StringBuilder();
        for (int i = s.length() - 1; i >= 0; i--) {
            sb.append(s.charAt(i));
        }
        System.out.println(sb.toString());
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: 'StringBuilder để append O(1) amortized. Cách quick: <code>new StringBuilder(s).reverse().toString()</code> — nhưng bài này yêu cầu KHÔNG dùng built-in reverse, để luyện loop.'
          }
        },
        {
          title: 'Count vowels',
          prompt: 'Đọc String, đếm số vowel (a, e, i, o, u — không phân biệt hoa/thường).',
          hints: ['Convert toLowerCase trước.', 'Check char ∈ {a, e, i, o, u} bằng String.indexOf hoặc switch.'],
          solution: {
            code: `import java.util.Scanner;

public class CountVowels {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if ("aeiou".indexOf(c) >= 0) count++;
        }
        System.out.println(count);
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: '<code>"aeiou".indexOf(c)</code> trả index hoặc -1 nếu không tìm thấy. ≥ 0 = found. Simple + concise.'
          }
        },
        {
          title: 'Check palindrome',
          prompt: 'Đọc String, in "yes" nếu là palindrome, "no" nếu không. Bỏ qua case.',
          hints: ['Two pointers từ 2 đầu vào giữa.', 'Compare char bằng <code>==</code> (vì char là primitive).'],
          solution: {
            code: `import java.util.Scanner;

public class Palindrome {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        int l = 0, r = s.length() - 1;
        boolean ok = true;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) { ok = false; break; }
            l++; r--;
        }
        System.out.println(ok ? "yes" : "no");
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(1).',
            explanationVi: 'Two pointers converge. Khi l ≥ r là đã check hết. Bonus: bỏ qua non-alphanumeric trong palindrome thực sự — LeetCode 125.'
          }
        },
        {
          title: 'Split + count words',
          prompt: 'Đọc 1 câu, đếm số từ (cách nhau bởi 1+ khoảng trắng).',
          hints: ['<code>s.trim().split("\\\\s+")</code> — \\s+ là regex 1+ whitespace.', 'Edge case: input rỗng → 0 từ.'],
          solution: {
            code: `import java.util.Scanner;

public class CountWords {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        if (s.isEmpty()) {
            System.out.println(0);
        } else {
            String[] words = s.split("\\\\s+");
            System.out.println(words.length);
        }
        sc.close();
    }
}`,
            lang: 'java',
            complexityVi: 'Time O(n) · Space O(n).',
            explanationVi: '<code>\\s+</code> = 1+ whitespace (space, tab, newline). <code>trim()</code> bỏ whitespace 2 đầu trước. Edge case empty: split rỗng vẫn trả array length 1 → handle riêng.'
          }
        },
        {
          title: 'Concat với StringBuilder benchmark',
          prompt: 'Tạo 10000 String "x" rồi concat. So sánh cách <code>s += "x"</code> vs <code>sb.append("x")</code>. In thời gian.',
          hints: ['<code>System.currentTimeMillis()</code> trước/sau.', 'String concat O(n²) — sẽ thấy chậm hơn rõ.'],
          solution: {
            code: `public class ConcatBench {
    public static void main(String[] args) {
        int N = 10000;

        // Approach 1: String + (CHẬM)
        long t1 = System.currentTimeMillis();
        String s = "";
        for (int i = 0; i < N; i++) s += "x";
        long elapsed1 = System.currentTimeMillis() - t1;

        // Approach 2: StringBuilder (NHANH)
        long t2 = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < N; i++) sb.append("x");
        sb.toString();
        long elapsed2 = System.currentTimeMillis() - t2;

        System.out.println("String concat: " + elapsed1 + "ms");
        System.out.println("StringBuilder: " + elapsed2 + "ms");
        // Typical: String 50-100ms, SB &lt; 5ms
    }
}`,
            lang: 'java',
            complexityVi: 'String concat O(n²) — tạo new String mỗi lần. StringBuilder O(n) amortized.',
            explanationVi: 'Mỗi <code>s += "x"</code> tạo NEW String length n+1 → copy n chars + 1. Tổng 0+1+2+...+N = O(N²). StringBuilder maintain internal buffer + grow geometric → O(N) total.'
          }
        }
      ],
      keyTakeaways: {
        vi: [
          'String IMMUTABLE — mỗi op tạo object mới.',
          'So sánh nội dung: <code>.equals()</code>. So reference: <code>==</code>. Đừng nhầm.',
          'Concat trong loop → StringBuilder.',
          'charAt() trả char (primitive). substring(start, end) end EXCLUSIVE.',
          'split() dùng regex — escape <code>.</code> bằng <code>\\\\.</code>.'
        ]
      }
    }
  ],
  references: [
    { title: 'Oracle Java Language Basics tutorial', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/' },
    { title: 'JLS 21 -Primitive Types and Values', url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html' },
    { title: 'Google Java Style Guide', url: 'https://google.github.io/styleguide/javaguide.html' }
  ]

}
