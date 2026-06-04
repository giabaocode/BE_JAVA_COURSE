// ============================================================================
//  PHASE 1 — Module 1.8: OOP Mini Projects (Student / HR / Library Management)
// ============================================================================

export default
    {
      id: 'mod-1-8',
      title: 'OOP Mini Projects — Student / HR / Library Management Console',
      lessons: [
        {
          id: 'l-1-8-1',
          type: 'project',
          title: 'Student Management Console (CRUD + Sort + Search)',
          subtitle: { vi: 'Project 1/3. Đây là phiên bản OOP đầy đủ của Mini Bank (Phase 0). Mỗi thực thể giờ là class, mỗi service là class quản lý collection.' },
          mentalModel: {
            vi: `App quản lý sinh viên — quen thuộc, nhưng cú đẩy là <strong>tách concern</strong>:
<ul>
  <li><code>Student</code> — POJO: id, name, dob, gpa, major. Có constructor, getter, toString.</li>
  <li><code>StudentService</code> — quản lý <code>List&lt;Student&gt;</code>: add, update, delete, findById, findByName, sortByGpa.</li>
  <li><code>StudentApp</code> (main) — chỉ in menu + đọc input + gọi service. KHÔNG chứa logic data.</li>
</ul>
Đây là kiến trúc <strong>3-layer mini</strong>: Model (entity) – Service (logic) – UI (console). Sau Phase 3 bạn sẽ thay UI bằng REST Controller.`
          },
          underTheHood: {
            vi: `<h3>Vì sao tách Service ra khỏi App?</h3>
<ul>
  <li><strong>Single Responsibility</strong> — App lo input/output, Service lo data manipulation. Đổi UI (console → web) không cần sửa Service.</li>
  <li><strong>Testable</strong> — test Service không cần System.in. Pass Student vào, assert kết quả.</li>
  <li><strong>Reusable</strong> — Service có thể dùng từ nhiều UI khác nhau (CLI, Swing, REST sau này).</li>
</ul>

<h3>Design choices cần defend</h3>
<ul>
  <li><strong>Storage</strong>: <code>List&lt;Student&gt;</code> hay <code>Map&lt;String, Student&gt;</code>? Map nhanh hơn cho findById (O(1)), nhưng List dễ sort + iterate. Lựa chọn: Map khi lookup nhiều, List khi sort/iterate nhiều. <em>Compromise</em>: Map cho storage, sort khi cần trả list.</li>
  <li><strong>ID auto-generate vs user-provide</strong>: auto (counter) tránh duplicate. User-provide cho phép import data có sẵn. Bài này dùng auto: <code>"SV" + (++idCounter)</code>.</li>
  <li><strong>Sort GPA giảm dần</strong>: <code>list.sort(Comparator.comparingDouble(Student::getGpa).reversed())</code>. Method reference + Comparator.</li>
  <li><strong>Search by name (substring, case-insensitive)</strong>: <code>name.toLowerCase().contains(keyword.toLowerCase())</code>. Hoặc Stream filter.</li>
</ul>

<h3>Pitfalls</h3>
<ul>
  <li>❌ Để main 200+ dòng. → Tách Service NGAY.</li>
  <li>❌ Field public. → private + getter/setter (hoặc record cho Java 14+).</li>
  <li>❌ equals/hashCode dựa trên all fields → bug khi update field. Chỉ dùng <code>id</code>.</li>
  <li>❌ <code>findById</code> trả null nếu không có. → Trả <code>Optional&lt;Student&gt;</code>.</li>
  <li>❌ <code>delete</code> bằng <code>list.remove(student)</code> mà student không override equals → SAI.</li>
</ul>`
          },
          steps: [
            {
              id: 'step-1-8-1-1',
              title: 'Step 1 — Design class Student (POJO)',
              description: 'Field private: id (String), name (String), dob (LocalDate), gpa (double), major (String). Constructor full args. Getter/setter (chỉ setter cho field có thể update). Override toString + equals/hashCode dựa trên id.',
              deliverable: 'File <code>Student.java</code> compile sạch. Override toString in được nhiều dòng dạng table.',
              socraticPrompts: [
                'Có nên có setter cho <code>id</code>? Vì sao? (Hint: business rule — ID không đổi sau create.)',
                'equals/hashCode dùng <code>id</code> thôi đủ chưa? Nếu 2 student trùng id nhưng khác name → equal hay không?'
              ],
              hints: [
                'Dùng <code>LocalDate.parse("2000-05-10")</code> để parse string.',
                'Java 14+ có thể dùng <code>record Student(...)</code> — nhưng record immutable, không setter được. Bài này dùng class thường.'
              ]
            },
            {
              id: 'step-1-8-1-2',
              title: 'Step 2 — StudentService với CRUD',
              description: 'Field private <code>Map&lt;String, Student&gt; store = new LinkedHashMap&lt;&gt;();</code>. Method: <code>add(Student)</code>, <code>update(String id, Student)</code>, <code>delete(String id)</code>, <code>findById(String id) → Optional</code>, <code>findAll() → List</code>.',
              deliverable: 'Service test được không qua console — viết main test riêng add 3 students, delete 1, in còn 2.',
              hints: [
                'LinkedHashMap giữ insertion order — đẹp hơn HashMap khi list ra.',
                'findById: <code>return Optional.ofNullable(store.get(id));</code>',
                'findAll: <code>return new ArrayList&lt;&gt;(store.values());</code> — copy để caller không modify được internal.'
              ]
            },
            {
              id: 'step-1-8-1-3',
              title: 'Step 3 — Sort + Search',
              description: 'Thêm <code>sortByGpaDesc()</code> return new List sorted. <code>searchByName(String keyword)</code> return List match substring case-insensitive.',
              deliverable: 'Test: 3 student GPA 8.0/9.5/7.2 → sort trả thứ tự 9.5/8.0/7.2. Search "an" match "An Nguyen" và "Tuan" — đều có chữ "an".',
              hints: [
                'Sort: <code>findAll().stream().sorted(Comparator.comparingDouble(Student::getGpa).reversed()).toList()</code>',
                'Search: filter + collect to list.'
              ]
            },
            {
              id: 'step-1-8-1-4',
              title: 'Step 4 — StudentApp console UI',
              description: 'Menu: 1) Add 2) Update 3) Delete 4) List all 5) Sort by GPA 6) Search by name 0) Exit. Đọc input bằng Scanner, gọi service tương ứng.',
              deliverable: 'App chạy mượt qua mọi menu. Validation: tên rỗng → reject, GPA &lt; 0 hoặc &gt; 10 → reject, id không tồn tại khi update/delete → in error rõ.',
              socraticPrompts: [
                'Nếu mai đổi UI sang web (Spring MVC), bao nhiêu % code Service phải đổi? (Mục tiêu: ~0%.)',
                'Trong main, có chỗ nào còn business logic không nên ở đó? Refactor.'
              ]
            }
          ],
          stretchGoals: [
            'Lưu danh sách ra file CSV khi exit, đọc lại khi start. Dùng <code>Files.write(Path, List&lt;String&gt;)</code>.',
            'Validation bằng custom exception: <code>InvalidStudentException</code> extends RuntimeException.',
            'Add <code>Subject</code> class + <code>StudentSubjectScore</code> để tính GPA động (preview many-to-many).'
          ],
          keyTakeaways: {
            vi: [
              '3-layer: Model – Service – UI. Đổi UI không đụng Service.',
              'Map cho lookup nhanh, copy ra List khi cần sort/iterate.',
              'Optional thay null để caller phải xử lý case missing.',
              'equals/hashCode chỉ dựa trên id — KHÔNG dùng all fields.'
            ]
          }
        },

        {
          id: 'l-1-8-2',
          type: 'project',
          title: 'HR / Employee Management — Inheritance + Polymorphism thực chiến',
          subtitle: { vi: 'Project 2/3. Đây là chỗ inheritance hierarchy có ý nghĩa thực sự: nhiều loại nhân viên, mỗi loại tính lương khác.' },
          mentalModel: {
            vi: `Hệ thống HR có 3 loại nhân viên:
<ul>
  <li><code>FullTimeEmployee</code>: lương cố định / tháng.</li>
  <li><code>PartTimeEmployee</code>: lương = giờ làm × rate.</li>
  <li><code>Contractor</code>: lương = lump sum cho mỗi project.</li>
</ul>
Cả 3 đều là <code>Employee</code>. Tất cả đều phải có <code>calculateSalary()</code> nhưng <strong>cách tính khác nhau</strong>. Đây chính là <strong>polymorphism</strong>.`
          },
          underTheHood: {
            vi: `<h3>Class hierarchy</h3>
<pre>abstract class Employee {
    protected String id, name;
    protected LocalDate hireDate;
    public abstract double calculateSalary();   // BẮT BUỘC override
    // common methods: getName, getId, toString
}

class FullTimeEmployee extends Employee {
    private double baseSalary;
    public double calculateSalary() { return baseSalary; }
}

class PartTimeEmployee extends Employee {
    private double hourlyRate;
    private int hoursWorked;
    public double calculateSalary() { return hourlyRate * hoursWorked; }
}

class Contractor extends Employee {
    private double projectFee;
    private int projectsCompleted;
    public double calculateSalary() { return projectFee * projectsCompleted; }
}</pre>

<h3>Vì sao <code>abstract</code> Employee?</h3>
<ul>
  <li>"Employee chung chung" KHÔNG tồn tại — phải là 1 trong 3 loại cụ thể. <code>abstract</code> ngăn <code>new Employee(...)</code>.</li>
  <li><code>calculateSalary()</code> không có implementation chung — mỗi sub tự định nghĩa.</li>
  <li>Common fields/methods (id, name, toString) viết 1 lần ở parent → DRY.</li>
</ul>

<h3>Polymorphism in action</h3>
<pre>List&lt;Employee&gt; all = new ArrayList&lt;&gt;();
all.add(new FullTimeEmployee(...));
all.add(new PartTimeEmployee(...));
all.add(new Contractor(...));

double totalPayroll = 0;
for (Employee e : all) {
    totalPayroll += e.calculateSalary();   // JVM chọn đúng method dựa trên runtime type
}</pre>
Đây là <strong>dynamic dispatch</strong> — không cần if/else theo type. Thêm loại nhân viên mới (Intern) → chỉ tạo class mới, KHÔNG sửa loop tổng lương.

<h3>Pitfalls</h3>
<ul>
  <li>❌ <code>instanceof + cast</code> thay vì polymorphism: <code>if (e instanceof FullTimeEmployee) ((FullTimeEmployee)e).getBaseSalary()</code>. Sai design — nên có method polymorphic.</li>
  <li>❌ Quên <code>super(...)</code> trong constructor con → compile error nếu parent không có default constructor.</li>
  <li>❌ Override mà không có <code>@Override</code> annotation → typo sẽ thành method mới chứ không override → bug câm.</li>
  <li>❌ Field <code>protected</code> trong parent + truy cập trực tiếp từ child → coupling cao. Tốt hơn: private + getter.</li>
</ul>`
          },
          steps: [
            {
              id: 'step-1-8-2-1',
              title: 'Step 1 — Class hierarchy',
              description: 'Tạo 4 file: <code>Employee.java</code> (abstract), <code>FullTimeEmployee</code>, <code>PartTimeEmployee</code>, <code>Contractor</code>. Mỗi sub override <code>calculateSalary()</code> + toString().',
              deliverable: '4 file compile. Tạo instance từng loại, gọi calculateSalary() in đúng giá trị.',
              hints: [
                '<code>abstract class Employee</code> + <code>public abstract double calculateSalary();</code>',
                'Constructor con: <code>super(id, name, hireDate);</code> dòng đầu tiên.',
                'Đặt <code>@Override</code> ngay trên method override.'
              ]
            },
            {
              id: 'step-1-8-2-2',
              title: 'Step 2 — EmployeeService với polymorphic operations',
              description: 'Service quản lý <code>List&lt;Employee&gt;</code> (Note: kiểu Employee, không phải concrete). Method: <code>add</code>, <code>findById</code>, <code>totalPayroll()</code>, <code>topNHighestPaid(int n)</code>.',
              deliverable: '<code>totalPayroll()</code> trả tổng đúng cho mix 3 loại. <code>topNHighestPaid(3)</code> trả 3 người lương cao nhất.',
              hints: [
                'totalPayroll: stream + mapToDouble + sum.',
                'topN: sort theo calculateSalary giảm dần, lấy n đầu.'
              ]
            },
            {
              id: 'step-1-8-2-3',
              title: 'Step 3 — Console UI + thêm Intern (test "open/closed")',
              description: 'Menu CRUD cho 3 loại. SAU KHI làm xong, thêm class <code>Intern</code> (lương = hourlyRate × hours × 0.5, intern rate). Hỏi: bao nhiêu file phải sửa?',
              deliverable: 'Thêm Intern chỉ cần: tạo class mới + thêm option trong menu Add. KHÔNG sửa Service, KHÔNG sửa loop tính tổng.',
              socraticPrompts: [
                'Đây là Open/Closed Principle: open for extension, closed for modification. Bạn vừa trải nghiệm nó. Diễn giải bằng lời cho bản thân.',
                'Nếu thêm loại Director có bonus = % của net profit công ty — cần field/method mới ở Director hay Employee? Vì sao?'
              ]
            }
          ],
          stretchGoals: [
            'Thêm <code>Department</code> entity (1 employee thuộc 1 department) — preview many-to-one.',
            'Tính payroll theo department: <code>Map&lt;Department, Double&gt;</code>.',
            'Sort employees theo seniority (hireDate) thay vì lương.'
          ],
          keyTakeaways: {
            vi: [
              'Abstract class khi parent KHÔNG có nghĩa độc lập (Employee chung chung không tồn tại).',
              'Polymorphism = dynamic dispatch — runtime chọn method, không cần if/else theo type.',
              'Mỗi loại mới = class mới. KHÔNG sửa code cũ. Đây là Open/Closed Principle.',
              '<code>@Override</code> bắt buộc — typo sẽ thành bug câm.'
            ]
          }
        },

        {
          id: 'l-1-8-3',
          type: 'project',
          title: 'Library Management — Composition + Collections phức tạp',
          subtitle: { vi: 'Project 3/3. Đây là chỗ bạn dùng <strong>nhiều collection</strong>, có quan hệ <strong>nhiều-nhiều</strong>, và phải handle business rule (overdue, borrowing limit).' },
          mentalModel: {
            vi: `Hệ thống thư viện:
<ul>
  <li><code>Book</code>: id, title, author, totalCopies, availableCopies.</li>
  <li><code>Member</code>: id, name, max 3 sách đang mượn.</li>
  <li><code>Loan</code>: linkBook + Member + borrowDate + dueDate + returnedDate (null nếu chưa trả).</li>
</ul>
Business rules:
<ul>
  <li>Mỗi member tối đa <strong>3 sách</strong> mượn cùng lúc.</li>
  <li>Mượn 14 ngày, quá hạn → tính overdue days.</li>
  <li>Sách hết bản (availableCopies = 0) → không cho mượn.</li>
  <li>Member có overdue book → không cho mượn thêm.</li>
</ul>
Đây là <strong>composition</strong> (Loan chứa reference Book + Member) chứ KHÔNG inheritance.`
          },
          underTheHood: {
            vi: `<h3>Composition vs Inheritance</h3>
<ul>
  <li><strong>Inheritance ("is-a")</strong>: FullTimeEmployee <em>is a</em> Employee. Dùng khi sub là chuyên biệt của parent.</li>
  <li><strong>Composition ("has-a")</strong>: Loan <em>has a</em> Book + <em>has a</em> Member. Dùng khi quan hệ giữa các thực thể độc lập.</li>
</ul>
Loan KHÔNG phải là Book. Loan KHÔNG phải là Member. Nó là <em>quan hệ</em> giữa 2 — đây là composition.

<h3>Data structure cho Library</h3>
<ul>
  <li><code>Map&lt;String, Book&gt; books</code> — lookup by ID nhanh.</li>
  <li><code>Map&lt;String, Member&gt; members</code> — tương tự.</li>
  <li><code>List&lt;Loan&gt; loans</code> — append-only log. Query "ai đang mượn sách X?" = filter loans returnedDate=null + bookId=X.</li>
</ul>

<h3>Domain logic — không thuộc UI</h3>
<pre>public class LibraryService {
    private final Map&lt;String, Book&gt; books = new HashMap&lt;&gt;();
    private final Map&lt;String, Member&gt; members = new HashMap&lt;&gt;();
    private final List&lt;Loan&gt; loans = new ArrayList&lt;&gt;();

    public void borrow(String memberId, String bookId) {
        Member m = members.get(memberId);
        Book b = books.get(bookId);
        if (m == null || b == null) throw new IllegalArgumentException("Not found");
        if (b.getAvailableCopies() == 0) throw new IllegalStateException("Out of stock");
        long activeLoans = loans.stream()
            .filter(l -&gt; l.getMember().equals(m) &amp;&amp; l.getReturnedDate() == null)
            .count();
        if (activeLoans &gt;= 3) throw new IllegalStateException("Max 3 books");
        // có overdue → reject
        boolean hasOverdue = loans.stream()
            .filter(l -&gt; l.getMember().equals(m) &amp;&amp; l.getReturnedDate() == null)
            .anyMatch(l -&gt; LocalDate.now().isAfter(l.getDueDate()));
        if (hasOverdue) throw new IllegalStateException("Has overdue book");

        b.setAvailableCopies(b.getAvailableCopies() - 1);
        loans.add(new Loan(b, m, LocalDate.now(), LocalDate.now().plusDays(14)));
    }
}</pre>

<h3>Pitfalls</h3>
<ul>
  <li>❌ Lưu count "books_borrowed_by_member" dưới dạng field trong Member → drift khi quên update. → Query từ loans (single source of truth).</li>
  <li>❌ Sửa availableCopies trực tiếp từ UI. → Service là chỗ duy nhất sửa.</li>
  <li>❌ Throw RuntimeException chung chung. → Dùng IllegalStateException (rule fail) vs IllegalArgumentException (bad input).</li>
  <li>❌ Loan dùng <code>String bookId</code> + <code>String memberId</code> thay vì reference. → Mất type safety, dễ typo. Dùng reference, JPA sau này lo phần persist.</li>
</ul>`
          },
          steps: [
            {
              id: 'step-1-8-3-1',
              title: 'Step 1 — Entities (Book, Member, Loan)',
              description: 'Book: id, title, author, totalCopies, availableCopies. Member: id, name. Loan: book (Book), member (Member), borrowDate, dueDate, returnedDate (Optional hoặc null).',
              deliverable: '3 class compile. Test tạo Book/Member, link qua Loan, in toString.',
              hints: [
                'Loan constructor có 4 tham số bắt buộc (book, member, borrowDate, dueDate). returnedDate set qua setter khi return.',
                '<code>LocalDate.now().plusDays(14)</code> để tính due date.'
              ]
            },
            {
              id: 'step-1-8-3-2',
              title: 'Step 2 — LibraryService.borrow() với đủ rule',
              description: 'Implement borrow() như mẫu trên. Throw exception phù hợp khi rule fail. KHÔNG để UI handle business logic.',
              deliverable: 'Test 5 case: borrow OK, book hết, member đã 3 sách, member có overdue, book/member không tồn tại — đều có response đúng.',
              socraticPrompts: [
                'Vì sao count active loans dùng filter từ list thay vì lưu counter ở Member?',
                'Nếu hệ thống có 1 triệu loans → filter mỗi lần borrow có chậm? Cách giải sau này? (Index hoặc query DB.)'
              ]
            },
            {
              id: 'step-1-8-3-3',
              title: 'Step 3 — return() + overdue calculation',
              description: 'Method <code>returnBook(String memberId, String bookId)</code>: set returnedDate = today, tăng availableCopies. Method <code>overdueFee(Loan)</code>: <code>max(0, daysOverdue) * 5000</code> VND.',
              deliverable: 'Return sách đúng → availableCopies tăng. Overdue 5 ngày → fee = 25,000 VND.',
              hints: [
                '<code>ChronoUnit.DAYS.between(dueDate, today)</code> tính số ngày diff.',
                'Negative diff (chưa quá hạn) → fee = 0.'
              ]
            },
            {
              id: 'step-1-8-3-4',
              title: 'Step 4 — Reports + UI',
              description: 'Báo cáo: 1) Sách đang được mượn 2) Member có overdue 3) Top 5 sách mượn nhiều nhất. UI menu đầy đủ.',
              deliverable: 'Mỗi report query bằng Stream từ loans + map/filter/collect. KHÔNG thêm field cache.',
              hints: [
                'Top 5: <code>loans.stream().collect(groupingBy(l -&gt; l.getBook(), counting())).entrySet().stream().sorted(...).limit(5)</code>',
                'Phức tạp? Đây chính là SQL GROUP BY. Phase 3 SQL lesson sẽ làm rõ.'
              ]
            }
          ],
          stretchGoals: [
            'Reservation system: member đặt trước sách hết, tự notify khi available.',
            'Categories: Book có category, member có thể tìm theo category.',
            'Hết bài: thử export toàn bộ data ra JSON bằng Jackson — preview Phase 3.'
          ],
          keyTakeaways: {
            vi: [
              'Composition ("has-a") khác inheritance ("is-a") — Loan KHÔNG inherit Book/Member.',
              'Service là chỗ DUY NHẤT sửa state. UI chỉ gọi service.',
              'Aggregate (count, sum) query từ source of truth (loans), KHÔNG lưu cache field.',
              'Phức tạp này → SQL JOIN/GROUP BY ở Phase 3 sẽ làm thanh thoát.'
            ]
          }
        }
      ],
  references: [
    { title: 'SOLID principles (Robert C. Martin)', url: 'https://en.wikipedia.org/wiki/SOLID' },
    { title: 'Java Streams API', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html' },
    { title: 'Composition over Inheritance (Effective Java Item 18)', url: 'https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/' }
  ]

    }
