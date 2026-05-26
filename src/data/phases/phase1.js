// ============================================================================
//  PHASE 1 — Java OOP, Data Structures & Sorting (Under the Hood)
//  Mỗi lesson: Mental Model + First Principles (under the hood) + The Why
//             + Junior Pitfalls + Socratic Prompts + Exercises (hints + solution)
// ============================================================================

export const phase1 = {
  id: 'phase-1',
  title: 'Phase 1 — Java OOP, Data Structures & Sorting (Under the Hood)',
  tagline: 'Từng byte, từng cache line. Tự tay code lại mọi container. Sort bằng tư duy chia-để-trị.',
  intro: {
    vi: 'Phase này build foundations: bạn KHÔNG dùng <code>java.util.ArrayList</code> trước khi tự viết được một cái. Mỗi cấu trúc dữ liệu có 3 lớp giải thích — <strong>Mental Model</strong> (cách tư duy), <strong>First Principles</strong> (cơ chế memory/CPU/JVM bên dưới), <strong>Junior Pitfalls</strong> (bug điển hình). Phase kết thúc với Merge Sort + Quick Sort — đây là lúc bạn nắm chia-để-trị và recursion tree, hai trụ cột cho Phase 2.'
  },
  modules: [

    // ========================================================================
    // Module 1.1 — OOP Pillars
    // ========================================================================
    {
      id: 'mod-1-1',
      title: 'OOP Pillars — Encapsulation, Inheritance, Polymorphism, Abstraction',
      lessons: [

        // ----- l-1-1-1 -----
        {
          id: 'l-1-1-1',
          type: 'theory',
          title: 'Class, Object & the JVM Memory Model',
          subtitle: { en: 'Where do your objects actually live?', vi: 'Object của bạn thực sự nằm ở đâu trong RAM?' },
          mentalModel: {
            vi: `Hình dung JVM chia RAM thành <strong>3 vùng</strong>:
<ul>
  <li><strong>Stack</strong> — mỗi method call tạo một "stack frame" chứa biến local + return address + tham chiếu (reference). Frame biến mất ngay khi method return → stack tự dọn, không cần GC.</li>
  <li><strong>Heap</strong> — mọi <code>new Object()</code> đều nằm ở đây. Object sống tới khi KHÔNG còn reference nào trỏ tới → Garbage Collector dọn.</li>
  <li><strong>Metaspace</strong> — chứa định nghĩa class (bytecode, tên field/method, constant pool).</li>
</ul>
Câu cửa miệng: <em>"Variables live in stack; objects live in heap; classes live in metaspace."</em>
<br/><br/>
Khi viết <code>Product p = new Product("X")</code>: biến <code>p</code> nằm Stack, object Product nằm Heap, <code>p</code> chỉ là <strong>handle</strong> (kiểu con trỏ đã được JVM quản lý). Đây là lý do <code>p2 = p</code> KHÔNG copy object — chỉ copy handle. Hai biến cùng trỏ tới một object trong heap.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Tại sao Java không có pointer arithmetic?</strong>
GC cần tự do <em>di chuyển</em> object (compaction để defrag heap). Nếu bạn cộng/trừ địa chỉ thì sau khi GC move object, địa chỉ cũ trỏ vô không gian random → crash. Java chỉ cho bạn "reference" (handle) — JVM remap handle khi cần.
<br/><br/>
<strong>2) Generational GC</strong>
Heap được chia: <code>Young Gen</code> (Eden + 2 Survivor) → <code>Old Gen</code>. Đa số object chết trẻ (≤1 ms) → "Minor GC" quét Eden cực nhanh. Object sống lâu được "promote" sang Old. "Major GC" hiếm hơn, đắt hơn. <strong>Weak generational hypothesis</strong> là nền tảng cho HotSpot/G1/ZGC.
<br/><br/>
<strong>3) Stack vs Heap về tốc độ</strong>
Stack cực nhanh (chỉ +/- stack pointer). Heap chậm hơn vì phải tìm chỗ trống và đôi khi trigger GC. Đó là lý do primitive type (<code>int</code>, <code>long</code>) mặc định trên Stack — không cần wrapper.
<br/><br/>
<strong>4) Pass-by-value (luôn luôn)</strong>
Java <em>pass everything by value</em>. Nhưng "value" của một object là <strong>reference</strong> (handle), không phải bản copy object. Đây là lý do thay đổi <code>field</code> qua reference vẫn lan ra ngoài — nhưng <code>reassign</code> param thì không.`
          },
          theory: {
            vi: `<h3>Bốn trụ cột OOP — diễn giải bằng đời thực</h3>
<ul>
  <li><strong>Encapsulation</strong> — "Cái gì bên trong là việc của tôi". Dùng iPhone qua nút, không cần biết chip A17.</li>
  <li><strong>Inheritance</strong> — "Là một" (is-a): <code>SavingsAccount</code> <em>là</em> <code>BankAccount</code>.</li>
  <li><strong>Polymorphism</strong> — "Cùng tên, khác cách": <code>animal.speak()</code> — chó sủa, mèo kêu.</li>
  <li><strong>Abstraction</strong> — "Cái gì, không phải cách nào": interface chỉ định contract.</li>
</ul>

<h3>The "Why" — Tại sao đóng gói tốt hơn public field?</h3>
Public field nhìn ngắn gọn, nhưng:
<ul>
  <li>KHÔNG kiểm soát được giá trị invalid (balance âm).</li>
  <li>Đổi cách lưu (cents → BigDecimal) → mọi caller PHẢI sửa.</li>
  <li>Không log/audit được mỗi thay đổi.</li>
</ul>
Setter/method là <strong>chỗ chèn invariant</strong> mà field thô không cho phép.

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Override <code>equals()</code> nhưng quên <code>hashCode()</code></strong> → HashMap.put rồi get trả null. <em>Quy tắc</em>: hai field nào dùng trong equals thì PHẢI dùng trong hashCode.</li>
  <li><strong>Dùng <code>double</code> cho tiền tệ</strong> → <code>0.1 + 0.2 = 0.30000000000000004</code>. Luôn dùng <code>long</code> (cents) hoặc <code>BigDecimal</code>.</li>
  <li><strong>Lombok <code>@Data</code> trên JPA entity</strong> → sinh equals/hashCode/toString dùng MỌI field, kể cả lazy collection → LazyInitializationException khi toString().</li>
  <li><strong>Setter cho field nên immutable</strong> (id, createdAt). Mất kiểm soát nghiêm trọng.</li>
  <li><strong>Public final field</strong> tưởng immutable nhưng object bên trong vẫn mutable: <code>final List&lt;String&gt; xs = new ArrayList&lt;&gt;(); xs.add(...)</code> vẫn được. Cần <code>List.copyOf(...)</code> để thực sự read-only.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'BankAccount — encapsulation chuẩn',
              code: `public class BankAccount {
    private final String accountId;       // immutable sau khi tạo
    private long balanceCents;            // long, KHÔNG double

    public BankAccount(String accountId, long openingBalanceCents) {
        if (openingBalanceCents < 0)
            throw new IllegalArgumentException("Số dư không thể âm");
        this.accountId = accountId;
        this.balanceCents = openingBalanceCents;
    }

    public void deposit(long cents) {
        if (cents <= 0) throw new IllegalArgumentException("Số tiền phải > 0");
        this.balanceCents += cents;
    }

    public void withdraw(long cents) {
        if (cents > balanceCents) throw new IllegalStateException("Không đủ số dư");
        this.balanceCents -= cents;
    }

    public long getBalanceCents() { return balanceCents; }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Stack vs Heap — tự suy luận',
              prompt: `Tôi muốn hiểu sâu memory model của Java. TUYỆT ĐỐI KHÔNG viết code. Hãy đặt cho tôi 6 câu hỏi:
1. Tại sao biến local biến mất khi method return?
2. Khi nào hai biến cùng trỏ đến một object?
3. Garbage Collector dùng tiêu chí gì để xóa object?
4. Tại sao primitive (int) nhanh hơn wrapper (Integer)?
5. Khi pass object vào method, "pass by value" hay "pass by reference"?
6. Generational GC chia heap thế nào? Vì sao chia?
Đợi tôi trả lời từng câu rồi mới hỏi tiếp.`
            },
            {
              title: 'Thiết kế class an toàn',
              prompt: `Tôi sắp thiết kế class Product (id, name, priceCents, stock). KHÔNG viết code hộ. Hỏi tôi:
1. Field nào nên là final? Vì sao?
2. Khi nào setter là cần thiết, khi nào loại bỏ?
3. Constructor nên validate những gì?
4. Hai Product được coi "bằng nhau" khi nào? Điều đó ảnh hưởng equals() và hashCode() ra sao?
5. Nếu quên hashCode() thì HashMap hỏng ra sao? Vì sao?`
            }
          ],
          exercises: [
            {
              title: 'Reference vs value',
              prompt: 'Viết method swap(int a, int b) — chứng minh tại sao Java không swap được 2 int qua method. Sau đó viết swap(int[] arr, int i, int j) — giải thích vì sao cách này ĐƯỢC.',
              hints: [
                'Câu hỏi 1: Khi pass int vào method, JVM copy hay share? Biến trong method có cùng địa chỉ với biến gốc không?',
                'Câu hỏi 2: Khi pass int[] vào method, "value" của array là gì? Nếu bạn reassign param = new int[10] bên trong method, bên ngoài thấy không?'
              ],
              solution: {
                code: `// KHÔNG hoạt động: a, b là COPY local — return là frame biến mất.
public static void swap(int a, int b) {
    int tmp = a; a = b; b = tmp;          // chỉ sửa biến local
}

// HOẠT ĐỘNG: arr là reference (handle). Sửa phần tử qua handle thì
// bên ngoài cũng thấy vì cả hai cùng trỏ tới object array trên heap.
public static void swap(int[] arr, int i, int j) {
    int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
}`,
                lang: 'java',
                complexityVi: 'Time O(1) · Space O(1).',
                explanationVi: 'Java pass-by-value cho mọi thứ. Với primitive, "value" là số nguyên thật → copy. Với object/array, "value" là reference (con số địa chỉ) → vẫn copy, nhưng cả hai copy đều trỏ tới CÙNG object heap → mutate field/element thấy lẫn nhau. Ngược lại reassign param = new ... thì chỉ đổi reference local.'
              }
            },
            {
              title: 'Immutable Money value object',
              prompt: 'Thiết kế class Money (amountCents, currency). Bất biến hoàn toàn. Method plus(Money other) trả về Money MỚI (không sửa this).',
              hints: [
                'Câu hỏi 1: Field nên là <code>final</code>? Có cần setter không? Hai Money cùng (cents, currency) có nên equals() = true không?',
                'Câu hỏi 2: Plus với khác currency thì làm sao? Throw hay convert? Đâu là quyết định đơn giản nhất?'
              ],
              solution: {
                code: `public final class Money {
    private final long amountCents;
    private final String currency;

    public Money(long amountCents, String currency) {
        if (currency == null || currency.isBlank())
            throw new IllegalArgumentException("currency rỗng");
        this.amountCents = amountCents;
        this.currency = currency;
    }

    public Money plus(Money other) {
        if (!this.currency.equals(other.currency))
            throw new IllegalArgumentException("Khác currency: " + currency + " vs " + other.currency);
        return new Money(this.amountCents + other.amountCents, this.currency);
    }

    public long amountCents() { return amountCents; }
    public String currency()  { return currency; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money m)) return false;
        return amountCents == m.amountCents && currency.equals(m.currency);
    }
    @Override public int hashCode() { return Objects.hash(amountCents, currency); }
}`,
                lang: 'java',
                complexityVi: 'Time O(1) per op · Space O(1) per Money. Tạo nhiều Money đối tượng có thể tăng pressure cho Young Gen — nhưng GC xử lý tốt.',
                explanationVi: 'Pattern "value object": final class, final fields, không setter, equals/hashCode bằng tất cả field, plus() trả Money MỚI. Đây là pattern Stripe/PayPal dùng. Java 17+ bạn có thể thay bằng <code>record Money(long amountCents, String currency)</code> — compiler auto-sinh equals/hashCode/toString.'
              }
            },
            {
              title: 'Equals & HashCode contract',
              prompt: 'Tạo class User (id, email). Override equals/hashCode sao cho 2 user cùng email là bằng nhau (CASE-INSENSITIVE). Test: <code>Set&lt;User&gt; set = new HashSet&lt;&gt;()</code> không cho phép 2 user "Alice@x.com" và "alice@x.com".',
              hints: [
                'Câu hỏi 1: Nếu equals so sánh email.toLowerCase() bằng nhau thì hashCode phải tính từ cái gì? Email gốc hay email.toLowerCase()?',
                'Câu hỏi 2: Nếu set chứa Alice@x.com rồi bạn đổi field email thành ALICE@x.com — set còn contains nó không? Tại sao? (Hint: mutable key)'
              ],
              solution: {
                code: `public class User {
    private final long id;
    private final String email;   // immutable — tránh "mutable key" bug

    public User(long id, String email) {
        this.id = id;
        this.email = Objects.requireNonNull(email);
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User u)) return false;
        return email.equalsIgnoreCase(u.email);    // case-insensitive
    }

    @Override public int hashCode() {
        return email.toLowerCase(Locale.ROOT).hashCode(); // PHẢI match equals
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(L) với L là độ dài email (toLowerCase + hash). Space O(1).',
                explanationVi: 'Quy tắc vàng: nếu equals() coi hai thứ bằng nhau, hashCode() PHẢI trả cùng số. Nếu equals dùng <code>equalsIgnoreCase</code>, hashCode phải normalize (toLowerCase). Bonus: dùng <code>Locale.ROOT</code> để tránh Turkish locale "i/İ" bug.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Stack chứa biến local + reference; Heap chứa object thật.',
              'Java pass-by-value MỌI THỨ — nhưng "value" của object là reference, nên sửa field xuyên qua.',
              'Override equals() → BẮT BUỘC override hashCode() cùng các field.',
              'Money lưu bằng <code>long</code> cents hoặc <code>BigDecimal</code>, KHÔNG bao giờ double.',
              'Key của HashMap phải IMMUTABLE — nếu mutate sau khi put, key biến mất khỏi map.'
            ]
          }
        },

        // ----- l-1-1-2 -----
        {
          id: 'l-1-1-2',
          type: 'theory',
          title: 'Inheritance vs Composition — Khi nào dùng cái nào?',
          subtitle: { en: 'Favor composition over inheritance', vi: 'Ưu tiên "có một" hơn là "là một"' },
          mentalModel: {
            vi: `Quy tắc 3 giây:
<ul>
  <li><strong>"Là một"</strong> (is-a) → cân nhắc <strong>inheritance</strong>. <code>SavingsAccount</code> <em>là một</em> <code>BankAccount</code>.</li>
  <li><strong>"Có một"</strong> (has-a) → dùng <strong>composition</strong>. <code>BankAccount</code> <em>có một</em> <code>TransactionLog</code>.</li>
</ul>
Trong thực tế <strong>80% trường hợp bạn tưởng là "is-a" thực ra là "has-a" trá hình</strong>. Inheritance tạo coupling cứng: thay đổi parent → mọi child rung chấn. Composition: bạn swap implementation bất kỳ lúc nào.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Virtual method table (vtable)</strong>
Mỗi class có một bảng địa chỉ method. Khi gọi <code>animal.speak()</code> trên reference parent, JVM lookup vtable của object THẬT (Cat/Dog) → gọi đúng override. Đây là <em>dynamic dispatch</em>.
<br/><br/>
<strong>2) Polymorphism cost</strong>
1 bước indirection so với static call. Hiện đại CPU branch predictor + JIT inline cache che giấu chi phí gần như hoàn toàn. <em>Đừng tránh polymorphism vì sợ chậm</em>.
<br/><br/>
<strong>3) Fragile base class problem</strong>
Sửa method ở parent có thể phá hành vi của subclass mà bạn không lường được. Subclass override 1 method nhưng đè lên invariant parent dựa vào → bug ẩn. Composition tránh hoàn toàn vấn đề này vì child KHÔNG được phép can thiệp internals của parent.
<br/><br/>
<strong>4) Java single inheritance + multiple interface</strong>
Một class extends 1 cha duy nhất nhưng implements N interface. Đây là quyết định thiết kế tránh "diamond problem" của C++ với multiple inheritance.`
          },
          theory: {
            vi: `<h3>Inheritance — khi nào THẬT SỰ phù hợp?</h3>
<ul>
  <li>Có Liskov Substitution: bất cứ chỗ nào dùng Parent đều dùng được Child mà không phá hành vi.</li>
  <li>Child KHÔNG xóa, KHÔNG đảo ngược hành vi của Parent.</li>
  <li>Hierarchy ≤ 2-3 cấp. Quá sâu = dấu hiệu sai thiết kế.</li>
</ul>

<h3>The "Why" — Composition wins vì?</h3>
<ul>
  <li><strong>Testable</strong>: inject mock implementation; inheritance khó test cả parent + child.</li>
  <li><strong>Flexible</strong>: swap behavior runtime (Strategy pattern); inheritance fix lúc compile.</li>
  <li><strong>Decoupled</strong>: child trong inheritance LÀ parent (tight); child trong composition CÓ parent (loose).</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Extends mọi thứ</strong> ngay khi thấy code lặp 3 dòng → tạo hierarchy phình to. Nguyên tắc đúng: <em>copy-paste 3 lần rồi mới abstract</em>.</li>
  <li><strong>Abstract base class trước khi có ≥ 2 concrete</strong> → over-engineering. Đợi cho đến khi pattern thực sự xuất hiện.</li>
  <li><strong>Gọi method overridable trong constructor</strong> → subclass field chưa init xong → NullPointerException khi runtime dispatch. Luôn dùng <code>private</code> hoặc <code>final</code> cho method gọi trong constructor.</li>
  <li><strong>Quên <code>super()</code> call</strong> trong constructor → compiler tự chèn <code>super()</code> không tham số, có thể trỏ nhầm constructor.</li>
  <li><strong>Đè <code>equals</code>/<code>hashCode</code> trong subclass</strong> phá vỡ contract — pair (Parent, Child) so sánh không nhất quán.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Composition thay thế Inheritance — payload',
              code: `// Cách KÉM — kẹt khi cần thêm Audit, Notification, Encryption
public class BankAccountWithLog extends BankAccount {
    private List<String> log = new ArrayList<>();
    @Override public void deposit(long cents) {
        super.deposit(cents);
        log.add("Deposit: " + cents);
    }
}

// Cách TỐT — composition + Strategy
public class BankAccount {
    private final TransactionLog log;
    private final NotificationService notifier;

    public BankAccount(TransactionLog log, NotificationService notifier) {
        this.log = log; this.notifier = notifier;
    }

    public void deposit(long cents) {
        // ... business
        log.record("deposit", cents);
        notifier.send("Bạn vừa nhận " + cents);
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Phân biệt is-a vs has-a',
              prompt: `Tôi đang phân vân Manager extends Employee, hay Manager có field Role? KHÔNG viết code, KHÔNG cho kết luận. Hỏi tôi:
1. Manager có thể demote thành Employee thường không? Inheritance xử lý ra sao?
2. Một người có thể VỪA là Manager VỪA là Engineer được không?
3. Sau này có "Intern Manager", "External Manager" — inheritance scale ra sao?
4. Composition giải quyết các vấn đề trên thế nào?`
            }
          ],
          exercises: [
            {
              title: 'Refactor inheritance → composition',
              prompt: 'Cho hierarchy: Vehicle → MotorVehicle → Car (3 cấp inheritance). Refactor thành composition: Car có Engine, Wheels, Chassis. Liệt kê 2 lợi ích cụ thể của design mới.',
              hints: [
                'Câu hỏi 1: Trong design cũ, nếu cần ElectricCar và HybridCar, hierarchy thay đổi ra sao?',
                'Câu hỏi 2: Đặt Engine làm interface — bạn có thể test Car mà không cần real Engine thế nào?'
              ],
              solution: {
                code: `// Interface Engine — dễ swap/mock
public interface Engine {
    void start();
    int fuelEfficiency();
}

public class GasolineEngine implements Engine {
    @Override public void start() { /* ... */ }
    @Override public int fuelEfficiency() { return 30; }
}
public class ElectricEngine implements Engine {
    @Override public void start() { /* ... */ }
    @Override public int fuelEfficiency() { return 100; }
}

// Car KHÔNG extends gì cả — composition
public class Car {
    private final Engine engine;
    private final List<Wheel> wheels;
    private final Chassis chassis;

    public Car(Engine engine, List<Wheel> wheels, Chassis chassis) {
        this.engine = engine;
        this.wheels = wheels;
        this.chassis = chassis;
    }
    public void start() { engine.start(); }
    public int fuelEfficiency() { return engine.fuelEfficiency(); }
}

// Tạo ElectricCar = chỉ swap Engine. Không class mới.
Car tesla = new Car(new ElectricEngine(), wheels, chassis);`,
                lang: 'java',
                complexityVi: 'Time/Space giống nhau — đây là design choice, không phải performance.',
                explanationVi: '<strong>Lợi ích 1</strong>: Thêm HybridCar = tạo HybridEngine impl Engine, KHÔNG đụng Car. <strong>Lợi ích 2</strong>: Unit test Car với MockEngine (Mockito) cực dễ; inheritance phải spin up cả hierarchy. <strong>Lợi ích 3</strong>: Một Car có thể có nhiều Engine (hybrid) — inheritance không cho.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Favor composition over inheritance — quy tắc "3 lần copy-paste" trước khi abstract.',
              'Vtable cho dynamic dispatch — chi phí rất nhỏ với JIT.',
              'Đừng gọi method overridable trong constructor — bug ẩn nguy hiểm.',
              'Hierarchy &gt; 3 cấp là dấu hiệu refactor.'
            ]
          }
        },

        // ----- l-1-1-3 -----
        {
          id: 'l-1-1-3',
          type: 'theory',
          title: 'Interfaces, Default Methods & Polymorphism in Action',
          mentalModel: {
            vi: `<strong>Interface = hợp đồng (contract)</strong>. "Ai implement tôi thì cam kết cung cấp các method này." Khác abstract class: interface KHÔNG có state (chưa kể static).
<br/><br/>
<strong>Bí quyết thiết kế</strong>: code dựa vào interface, KHÔNG dựa vào class cụ thể. Ví dụ <code>List&lt;String&gt; list = new ArrayList&lt;&gt;()</code> — biến khai báo là List. Mai đổi sang LinkedList chỉ sửa 1 dòng. Đây là nền của <strong>Dependency Inversion</strong> trong SOLID.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Default method (Java 8+)</strong>
Interface giờ có thể có implementation. Mục đích thật: tiến hóa interface mà KHÔNG phá vỡ code cũ. Ví dụ <code>Collection.stream()</code> là default method — JDK thêm vào Java 8, không class cũ nào phải sửa.
<br/><br/>
<strong>2) Diamond problem (Java tránh ra sao)</strong>
Khi 2 interface có cùng default method, compiler ép bạn phải override hoặc chỉ định <code>InterfaceA.super.method()</code>. Java buộc <em>explicit resolution</em>, khác C++ ambiguous.
<br/><br/>
<strong>3) Static method trong interface</strong>
Java 8+ cho phép. Đây là chỗ đặt <em>factory method</em> liên quan tới interface (vd: <code>List.of(...)</code>, <code>Comparator.naturalOrder()</code>). Trước Java 8 phải có "Utility class" rải rác.
<br/><br/>
<strong>4) Sealed interface (Java 17+)</strong>
Khai báo CHÍNH XÁC những class nào được implement. Cho phép pattern matching đảm bảo exhaustive — compile-time safety thay vì <code>default: throw new IllegalStateException()</code> nhếch nhác.`
          },
          theory: {
            vi: `<h3>Comparable vs Comparator</h3>
<ul>
  <li><code>Comparable&lt;T&gt;</code> — class TỰ định nghĩa thứ tự "tự nhiên" (vd: String alphabet).</li>
  <li><code>Comparator&lt;T&gt;</code> — object NGOÀI cung cấp thứ tự khác. Lambda: <code>(a, b) -&gt; a.price - b.price</code>.</li>
</ul>

<h3>The "Why" — Vì sao interface mạnh hơn abstract class trong API design?</h3>
<ul>
  <li>Class chỉ extends 1; nhưng implements N interface → linh hoạt hơn.</li>
  <li>Interface decouple module: caller dependent on interface, không phải class. Khi test, mock implementation.</li>
  <li>Default method cho phép evolution không phá vỡ existing code.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Khai biến dạng concrete</strong>: <code>ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;()</code>. Sai. Phải là <code>List&lt;String&gt;</code> để KHÔNG khóa caller vào implementation cụ thể.</li>
  <li><strong>So sánh String bằng <code>==</code></strong> thay vì <code>equals()</code> → false dù chuỗi giống nhau (vì so sánh reference, không content).</li>
  <li><strong>Comparator viết tùy tiện</strong>: <code>return a.score - b.score</code> có thể overflow (int subtraction). Dùng <code>Integer.compare(a.score, b.score)</code> an toàn.</li>
  <li><strong>Quên consistency với equals</strong>: nếu <code>compareTo == 0</code> nhưng <code>equals != true</code> → SortedSet (TreeSet) sẽ ngạc nhiên với bạn. Cố gắng giữ consistent.</li>
  <li><strong>Implement Comparable</strong> nhưng quên phương trình transitivity: <code>a&lt;b, b&lt;c ⇒ a&lt;c</code>. Vi phạm → sort kết quả không deterministic.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Strategy Pattern qua interface',
              code: `public interface PaymentMethod {
    void pay(long cents);
    default String label() { return getClass().getSimpleName(); }
}

public class CreditCard implements PaymentMethod {
    public void pay(long cents) { /* gọi gateway */ }
}
public class MoMo implements PaymentMethod {
    public void pay(long cents) { /* gọi MoMo API */ }
}

public class Order {
    public void checkout(PaymentMethod method, long total) {
        method.pay(total);   // không biết, không quan tâm là loại nào
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Interface vs abstract class',
              prompt: `Thiết kế Shape (Circle, Rectangle, Triangle). KHÔNG cho code. Hỏi tôi:
1. Các shape có state chung (color, position)?
2. Có state chung → gợi ý gì về interface vs abstract class?
3. Method area() có common implementation không?
4. Nếu thêm Shape3D — design hiện tại scale ra sao?
5. Composite pattern (Shape chứa nhiều Shape) áp dụng được không?`
            }
          ],
          exercises: [
            {
              title: 'Sortable Book — Comparable + Comparator',
              prompt: 'Book(title, year, rating). Implement Comparable&lt;Book&gt; theo title alphabet. Sau đó sort List&lt;Book&gt; theo year DESC bằng Comparator. Tránh int-overflow.',
              hints: [
                'Câu hỏi 1: Vì sao <code>return b.year - a.year</code> KHÔNG an toàn? Năm là int — overflow khi nào?',
                'Câu hỏi 2: <code>Comparator.comparingInt</code> vs <code>Comparator.comparing</code> khác nhau ở đâu? Khi nào dùng comparingInt?'
              ],
              solution: {
                code: `public class Book implements Comparable<Book> {
    private final String title;
    private final int year;
    private final double rating;

    public Book(String title, int year, double rating) {
        this.title = title; this.year = year; this.rating = rating;
    }

    @Override public int compareTo(Book other) {
        return this.title.compareTo(other.title);    // natural order = alphabet
    }

    public int getYear() { return year; }
    public double getRating() { return rating; }
}

// Sort year DESC, tie-break rating DESC, rồi title ASC
List<Book> books = ...;
books.sort(
    Comparator.comparingInt(Book::getYear).reversed()           // an toàn, không overflow
        .thenComparing(Comparator.comparingDouble(Book::getRating).reversed())
        .thenComparing(Book::getTitle)                            // natural order
);`,
                lang: 'java',
                complexityVi: 'Time O(n log n) — Java dùng Timsort (merge sort optimized). Space O(n) cho temp array.',
                explanationVi: '<code>Integer.compare(a, b)</code> tránh overflow vì so sánh, không trừ. <code>Comparator.comparingInt</code> nhận <code>ToIntFunction</code> → tránh autoboxing (nhanh hơn <code>comparing(Book::getYear)</code>). <code>.reversed()</code> flip thứ tự; <code>.thenComparing(...)</code> tie-breaker.'
              }
            },
            {
              title: 'Payment Strategy với default method',
              prompt: 'PaymentMethod interface có pay(cents). Default method label() trả tên class. Implement 3 method: CreditCard, MoMo, BankTransfer. Order.checkout(method, total) gọi pay.',
              hints: [
                'Câu hỏi 1: Vì sao default method label() trong interface tốt hơn buộc mọi implement tự viết?',
                'Câu hỏi 2: Nếu sau này MoMo cần API key — đặt ở đâu? Field của MoMo hay parameter của pay()?'
              ],
              solution: {
                code: `public interface PaymentMethod {
    void pay(long cents);
    default String label() { return getClass().getSimpleName(); }
}

public class CreditCard implements PaymentMethod {
    private final String cardToken;
    public CreditCard(String token) { this.cardToken = token; }
    @Override public void pay(long cents) {
        // call Stripe with cardToken
    }
}

public class MoMo implements PaymentMethod {
    private final String apiKey;
    public MoMo(String apiKey) { this.apiKey = apiKey; }
    @Override public void pay(long cents) { /* call MoMo */ }
}

public class Order {
    public void checkout(PaymentMethod method, long total) {
        System.out.println("Paying via " + method.label());
        method.pay(total);
    }
}`,
                lang: 'java',
                complexityVi: 'O(1) — Strategy pattern là design choice, không performance.',
                explanationVi: 'API key là <em>state</em> của method — đặt vào field constructor để gọi pay() chỉ cần biết cents. Strategy pattern: caller không biết, không quan tâm.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Khai biến dạng interface (List, Map, Set) — không khóa caller vào implementation.',
              'So sánh String/Object bằng <code>equals()</code>, không bao giờ <code>==</code>.',
              'Comparator: dùng <code>Integer.compare</code>/<code>Comparator.comparingInt</code> để tránh overflow.',
              'Default method = công cụ tiến hóa interface không phá code cũ.'
            ]
          }
        },

        // ----- l-1-1-4 -----
        {
          id: 'l-1-1-4',
          type: 'theory',
          title: 'Generics, Collections Overview & Iterators',
          mentalModel: {
            vi: `Generics cho phép viết container/algorithm <strong>work cho mọi type</strong> mà giữ compile-time type safety. <code>List&lt;String&gt;</code> đảm bảo bạn KHÔNG bao giờ add nhầm Integer.
<br/><br/>
Collections Framework chia 3 nhánh chính: <strong>List</strong> (có thứ tự, có index), <strong>Set</strong> (không duplicate), <strong>Map</strong> (key→value). Queue/Deque/PriorityQueue thuộc về Collection mở rộng.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Type erasure</strong>
Runtime KHÔNG biết <code>List&lt;String&gt;</code> hay <code>List&lt;Integer&gt;</code> — compiler XÓA hết info type, giữ lại <code>List</code> raw. Đây là lý do KHÔNG có <code>new T[]</code>, KHÔNG có <code>instanceof List&lt;String&gt;</code>.
<br/><br/>
<strong>2) Tại sao erasure?</strong>
Backward compatibility. Java 1.4 không có generics. Phải xóa để JDK mới chạy chung với class file cũ.
<br/><br/>
<strong>3) Reified vs erased</strong>
Kotlin có <code>inline</code> + <code>reified</code> để giữ type runtime. Java KHÔNG có. Workaround: pass <code>Class&lt;T&gt;</code> token (xem cách Jackson, GSON làm).
<br/><br/>
<strong>4) Wildcard <code>? extends T</code> vs <code>? super T</code></strong>
PECS — Producer Extends, Consumer Super.
<ul>
<li><code>List&lt;? extends Number&gt;</code> — bạn READ Number ra. KHÔNG add được.</li>
<li><code>List&lt;? super Integer&gt;</code> — bạn ADD Integer vào. Read trả Object.</li>
</ul>`
          },
          theory: {
            vi: `<h3>Quick map of Collections</h3>
<ul>
  <li><code>List&lt;E&gt;</code> — <code>ArrayList</code> (resizable array), <code>LinkedList</code> (doubly linked).</li>
  <li><code>Set&lt;E&gt;</code> — <code>HashSet</code> (unordered), <code>LinkedHashSet</code> (insertion order), <code>TreeSet</code> (sorted).</li>
  <li><code>Map&lt;K,V&gt;</code> — <code>HashMap</code>, <code>LinkedHashMap</code>, <code>TreeMap</code>.</li>
  <li><code>Deque&lt;E&gt;</code> — <code>ArrayDeque</code> (CHUẨN cho stack/queue), <code>LinkedList</code>.</li>
  <li><code>PriorityQueue&lt;E&gt;</code> — heap-backed, O(log n) insert/poll min.</li>
</ul>

<h3>The "Why" — Khi nào dùng cái nào?</h3>
<ul>
  <li>Cần index/random access → <strong>ArrayList</strong>.</li>
  <li>Cần insert/remove ở đầu nhiều → <strong>ArrayDeque</strong> (KHÔNG LinkedList — slow do cache miss).</li>
  <li>Cần unique → <strong>HashSet</strong>.</li>
  <li>Cần unique + sorted → <strong>TreeSet</strong>.</li>
  <li>Cần insertion order + unique → <strong>LinkedHashSet</strong>.</li>
  <li>Cần lookup key→value → <strong>HashMap</strong>; sorted theo key → <strong>TreeMap</strong>; LRU-friendly → <strong>LinkedHashMap</strong> với <code>accessOrder=true</code>.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Raw types</strong>: <code>List list = new ArrayList()</code>. Mất type safety, compiler chỉ warning. Luôn type parameter.</li>
  <li><strong>Modify trong khi iterate</strong>: <code>for (E e : list) list.remove(e)</code> → <code>ConcurrentModificationException</code>. Dùng <code>iterator.remove()</code> hoặc <code>removeIf(predicate)</code>.</li>
  <li><strong>Auto-boxing trong loop</strong>: <code>Long sum = 0L; for (long x : nums) sum += x;</code> → mỗi iteration tạo Long mới. Dùng <code>long</code> primitive.</li>
  <li><strong>Convert array to List bằng <code>Arrays.asList</code></strong> → trả về wrapper FIXED-SIZE, <code>list.add()</code> ném UnsupportedOperationException. Cần ArrayList thì <code>new ArrayList&lt;&gt;(Arrays.asList(...))</code>.</li>
  <li><strong>Dùng <code>java.util.Stack</code></strong> → legacy, extends Vector (synchronized). Dùng <code>Deque&lt;T&gt; stack = new ArrayDeque&lt;&gt;()</code>.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Generic Pair với bounded type',
              code: `public class Pair<A, B> {
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first = first; this.second = second;
    }

    public A first() { return first; }
    public B second() { return second; }

    public <C> Pair<A, C> withSecond(C newSecond) {
        return new Pair<>(first, newSecond);
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Type erasure pitfalls',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Vì sao <code>new T[]</code> không compile? Có cách nào tạo array generic?
2. <code>list instanceof List&lt;String&gt;</code> — vì sao compile error?
3. Generic method <code>&lt;T&gt; T first(List&lt;T&gt; xs)</code> — type T được suy ra từ đâu?
4. PECS — Producer Extends, Consumer Super là gì? Cho ví dụ.`
            }
          ],
          exercises: [
            {
              title: 'Generic Stack từ scratch',
              prompt: 'Implement <code>Stack&lt;T&gt;</code> với push, pop, peek, size, isEmpty. Backing là Object[]. Resize khi đầy (double capacity).',
              hints: [
                'Câu hỏi 1: Vì sao Object[] thay vì T[]? Type erasure cho phép new T[] không?',
                'Câu hỏi 2: Khi pop, có nên set <code>data[size] = null</code>? Hậu quả nếu không?'
              ],
              solution: {
                code: `public class MyStack<T> {
    private Object[] data = new Object[16];
    private int size = 0;

    public void push(T v) {
        if (size == data.length) data = Arrays.copyOf(data, data.length * 2);
        data[size++] = v;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (size == 0) throw new NoSuchElementException();
        T v = (T) data[--size];
        data[size] = null;             // QUAN TRỌNG — giải phóng reference cho GC
        return v;
    }

    @SuppressWarnings("unchecked")
    public T peek() { return size == 0 ? null : (T) data[size - 1]; }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
}`,
                lang: 'java',
                complexityVi: 'Time: push/pop/peek amortized O(1). Space: O(n) tổng + O(n) overhead nhỏ.',
                explanationVi: '<strong>Vì sao Object[]</strong>: type erasure không cho <code>new T[size]</code>. <strong>Vì sao set null</strong>: nếu giữ reference cũ trong slot, object popped vẫn không được GC dù caller đã release → memory leak ẩn. <strong>Vì sao amortized O(1)</strong>: geometric growth — N push tốn tổng O(N) operation → trung bình O(1)/push.'
              }
            },
            {
              title: 'Custom Iterable Range',
              prompt: 'Tạo Range(int from, int to). Implement Iterable&lt;Integer&gt; để dùng for-each: <code>for (int i : new Range(0, 10)) ...</code>.',
              hints: [
                'Câu hỏi 1: Iterator&lt;T&gt; có 2 method bắt buộc nào? Mỗi method làm gì?',
                'Câu hỏi 2: Inner class non-static (Iterator) vs static nested — chọn cái nào? Vì sao?'
              ],
              solution: {
                code: `public class Range implements Iterable<Integer> {
    private final int from, to;   // [from, to)

    public Range(int from, int to) {
        if (from > to) throw new IllegalArgumentException("from > to");
        this.from = from; this.to = to;
    }

    @Override public Iterator<Integer> iterator() {
        return new Iterator<>() {
            int cursor = from;

            @Override public boolean hasNext() { return cursor < to; }
            @Override public Integer next() {
                if (!hasNext()) throw new NoSuchElementException();
                return cursor++;
            }
        };
    }
}

// Dùng:
for (int i : new Range(0, 5)) System.out.println(i);  // 0 1 2 3 4`,
                lang: 'java',
                complexityVi: 'hasNext O(1), next O(1). Toàn iteration O(n) với n = to-from. Space O(1) — chỉ giữ cursor.',
                explanationVi: 'Anonymous inner class implement Iterator. Capture <code>from, to</code> từ outer class. <code>cursor</code> là state riêng của iterator — cho phép nhiều iterator song song trên cùng Range.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Type erasure: runtime KHÔNG biết generic type → không thể new T[] hoặc instanceof.',
              'PECS — Producer Extends, Consumer Super.',
              'Modify-during-iterate → ConcurrentModificationException. Dùng iterator.remove() hoặc removeIf().',
              'KHÔNG dùng java.util.Stack legacy — Deque/ArrayDeque thay thế.'
            ]
          }
        }
      ]
    },

    // ========================================================================
    // Module 1.2 — Arrays & Dynamic Array
    // ========================================================================
    {
      id: 'mod-1-2',
      title: 'Arrays & Dynamic Array (ArrayList) — Memory & Resize',
      lessons: [
        {
          id: 'l-1-2-1',
          type: 'theory',
          title: 'Array Memory Layout & Big-O Intuition',
          mentalModel: {
            vi: `Array là <strong>khối liên tục trong RAM</strong>. Nếu <code>int[]</code> bắt đầu ở địa chỉ 1000 và mỗi int = 4 byte, thì <code>arr[7]</code> = địa chỉ <code>1000 + 7*4 = 1028</code>. CPU tính 1 lệnh → access O(1).
<br/><br/>
Nhược: chèn giữa thì shift phần sau → O(n).`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Cache locality</strong>
CPU load dữ liệu theo "cache line" 64 byte. Array nằm liền nhau → đọc <code>arr[0]</code> thì <code>arr[1..15]</code> (với int) đã có sẵn trong L1 cache. LinkedList rải rác → mỗi node một cache miss → chậm gấp 10-100× thực tế dù Big-O bằng.
<br/><br/>
<strong>2) Bounds checking</strong>
Mỗi <code>arr[i]</code> trong Java check <code>0 ≤ i &lt; length</code>. JIT thường loại bỏ check trong loop khi chứng minh được an toàn — gọi là "bounds check elimination".
<br/><br/>
<strong>3) Array covariance</strong>
<code>Object[] os = new String[3]; os[0] = 42;</code> compile OK nhưng runtime ném <code>ArrayStoreException</code>. Bug ẩn nguy hiểm — đây là lý do generics dùng erasure, không covariance.
<br/><br/>
<strong>4) Multi-dim KHÔNG phải 2D contiguous</strong>
<code>int[][] grid = new int[3][4]</code> = mảng các tham chiếu tới các mảng con. Mỗi row là 1 object riêng → KHÔNG đảm bảo cache-friendly cho column scan.`
          },
          theory: {
            vi: `<h3>Bảng độ phức tạp PHẢI THUỘC</h3>
<ul>
  <li>Access theo index — <strong>O(1)</strong></li>
  <li>Search trong unsorted — <strong>O(n)</strong></li>
  <li>Search trong sorted — <strong>O(log n)</strong> (binary search)</li>
  <li>Insert/delete cuối (còn chỗ) — <strong>O(1)</strong></li>
  <li>Insert/delete giữa — <strong>O(n)</strong></li>
</ul>

<h3>The "Why" — Khi nào dùng array thay collection?</h3>
<ul>
  <li>Performance-critical loop với primitive int/double — array tránh autoboxing.</li>
  <li>Size cố định, biết trước (vd: 26 cho a-z) → tránh overhead ArrayList.</li>
  <li>Interop với JNI hoặc native API.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Off-by-one</strong>: <code>for (int i = 0; i &lt;= arr.length; i++)</code> → ArrayIndexOutOfBoundsException. Luôn <code>&lt;</code>, không <code>&lt;=</code>.</li>
  <li><strong>2D confusion</strong>: <code>grid[r][c]</code> — row trước, column sau. Vẽ ra giấy nếu nghi ngờ.</li>
  <li><strong>Arrays.asList rồi add</strong>: <code>List l = Arrays.asList(1,2,3); l.add(4)</code> → UnsupportedOperationException. Wrapper fixed-size.</li>
  <li><strong>Compare bằng <code>==</code></strong>: <code>arr1 == arr2</code> chỉ so reference. Dùng <code>Arrays.equals(arr1, arr2)</code>.</li>
  <li><strong>Copy bằng <code>=</code></strong>: <code>int[] b = a</code> chỉ alias. Dùng <code>Arrays.copyOf(a, a.length)</code> hoặc <code>a.clone()</code>.</li>
</ul>`
          },
          socraticPrompts: [
            {
              title: 'Vì sao ArrayList thắng LinkedList trong thực tế?',
              prompt: `Lý thuyết: cả 2 có một số op O(1). Benchmark: ArrayList luôn thắng. KHÔNG cho đáp án. Hỏi tôi:
1. Cache line là gì? CPU load dữ liệu thế nào?
2. Node của LinkedList cấp phát ở đâu trong heap? Có liền nhau?
3. Một cache miss tốn bao nhiêu chu kỳ CPU so với cache hit?
4. Vì sao "constant factor" trong Big-O đôi khi quan trọng hơn cả O()?`
            }
          ],
          exercises: [
            {
              title: 'Reverse array in-place',
              prompt: 'Đảo ngược int[] tại chỗ, O(1) extra space.',
              hints: [
                'Câu hỏi 1: Two pointers từ 2 đầu có giúp gì? Khi nào dừng?',
                'Câu hỏi 2: Vòng lặp chạy đến i &lt; length/2 — vì sao đủ?'
              ],
              solution: {
                code: `public static void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++; right--;
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(n/2) = O(n). Space O(1).',
                explanationVi: 'Two pointers vào giữa. Mỗi bước swap rồi tiến/lùi. Khi left ≥ right thì hết — không cần qua hết mảng.'
              }
            },
            {
              title: 'Rotate array k bước (O(n) space → O(1) space)',
              prompt: 'Cho int[] arr và k, rotate phải k bước. <em>Bonus: O(1) space.</em> Vd: [1,2,3,4,5] k=2 → [4,5,1,2,3].',
              hints: [
                'Câu hỏi 1: Naive: copy ra mảng mới — O(n) space. Có cách nào tránh array mới?',
                'Câu hỏi 2: Reverse 3 lần — toàn bộ, rồi 0..k-1, rồi k..n-1. Vì sao đúng? Vẽ ra giấy.'
              ],
              solution: {
                code: `public static void rotate(int[] arr, int k) {
    int n = arr.length;
    k = ((k % n) + n) % n;            // handle k âm + k > n
    reverse(arr, 0, n - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, n - 1);
}

private static void reverse(int[] arr, int l, int r) {
    while (l < r) {
        int t = arr[l]; arr[l] = arr[r]; arr[r] = t;
        l++; r--;
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — 3 lần reverse, mỗi lần ≤ n/2 swap. Space O(1).',
                explanationVi: 'Trick "reverse 3 lần": (1) reverse toàn bộ → [5,4,3,2,1]; (2) reverse 0..k-1 → [4,5,3,2,1]; (3) reverse k..n-1 → [4,5,1,2,3]. <code>((k%n)+n)%n</code> chuẩn hóa k âm và k &gt; n.'
              }
            }
          ]
        },

        {
          id: 'l-1-2-2',
          type: 'practice',
          title: 'Implementing a Dynamic Array (ArrayList) From Scratch',
          mentalModel: {
            vi: `Mục tiêu: hiểu vì sao <code>ArrayList.add()</code> là <strong>amortized O(1)</strong> dù đôi khi phải copy. Bí mật: <strong>geometric growth</strong> — hết chỗ thì DOUBLE capacity. Tổng cost trên N lần add ≈ 2N operation → trung bình 2/lần.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Amortized analysis</h3>
Cost mỗi resize = capacity cũ. Tổng cost qua N add = 1+2+4+...+N ≈ 2N (geometric series). Trung bình 2/add = O(1) amortized.
<br/><br/>
<strong>Vì sao DOUBLE, không 1.5x?</strong>
JDK ArrayList dùng <code>oldCap + (oldCap >> 1)</code> = 1.5x — giảm waste RAM. Python list pattern ~1.125x. Tradeoff: nhỏ hơn = ít waste RAM, nhưng resize thường hơn → constant factor lớn hơn.
<br/><br/>
<strong>Tại sao KHÔNG <code>capacity + 1</code>?</strong>
Tổng cost qua N add = 1+2+3+...+N = O(N²) → trung bình O(N)/add. Tệ thảm.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào ArrayList thay array thuần?</h3>
<ul>
  <li>Không biết trước size — ArrayList tự grow.</li>
  <li>Cần add/remove động — ArrayList có method sẵn.</li>
  <li>API chuẩn — interop dễ với Collections, Stream, framework.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên set null sau remove</strong> → object cũ giữ reference, GC không dọn được → memory leak ẩn.</li>
  <li><strong>Resize quá nhỏ (capacity + 1)</strong> → O(N) per add — chậm thê thảm với N lớn.</li>
  <li><strong>Iterate while remove</strong> → ConcurrentModificationException qua modCount checks.</li>
  <li><strong>Tin <code>size()</code> bằng <code>capacity</code></strong> → size là count hiện dùng, capacity là sức chứa.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'MyArrayList — bản đầy đủ',
              code: `public class MyArrayList<T> {
    private Object[] data;
    private int size;

    public MyArrayList() {
        this.data = new Object[8];
        this.size = 0;
    }

    public int size() { return size; }

    @SuppressWarnings("unchecked")
    public T get(int i) {
        if (i < 0 || i >= size) throw new IndexOutOfBoundsException();
        return (T) data[i];
    }

    public void add(T v) {
        ensureCapacity(size + 1);
        data[size++] = v;
    }

    private void ensureCapacity(int needed) {
        if (needed <= data.length) return;
        int newCap = Math.max(data.length * 2, needed);
        Object[] bigger = new Object[newCap];
        System.arraycopy(data, 0, bigger, 0, size);
        this.data = bigger;
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự thiết kế resize policy',
              prompt: `KHÔNG đưa code. Hỏi tôi:
1. Nếu mỗi lần thiếu chỗ chỉ tăng capacity + 1, tổng cost qua N add là bao nhiêu?
2. Nếu double, tổng cost? Trung bình mỗi add?
3. Khi remove, có nên shrink? Lúc nào shrink, lúc nào để dành?
4. Nếu shrink khi size &lt; capacity/2, "thrashing" (add-remove liên tục gây resize liên tục) xảy ra ra sao? Cách phòng?`
            }
          ],
          exercises: [
            {
              title: 'add(int index, T value)',
              prompt: 'Method chèn vào giữa. Shift phần sau sang phải. Throw IndexOutOfBoundsException nếu index không hợp lệ.',
              hints: [
                'Câu hỏi 1: <code>System.arraycopy</code> có thể copy chính source array overlap được không?',
                'Câu hỏi 2: Sau khi shift, slot <code>data[index]</code> đã bị overwrite chưa? Cần set giá trị mới ở đâu?'
              ],
              solution: {
                code: `public void add(int index, T value) {
    if (index < 0 || index > size) throw new IndexOutOfBoundsException();
    ensureCapacity(size + 1);
    // Shift sang phải: phần [index..size-1] → [index+1..size]
    System.arraycopy(data, index, data, index + 1, size - index);
    data[index] = value;
    size++;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — worst case shift toàn bộ (index = 0). Best O(1) khi index = size. Space O(1) extra (có thể trigger resize O(n) copy).',
                explanationVi: '<code>System.arraycopy</code> handle overlap chuẩn — internally check direction. Sau shift, slot index trống → assign value mới.'
              }
            },
            {
              title: 'remove(int index)',
              prompt: 'Xóa phần tử ở index, shift phần sau sang trái. PHẢI set slot cuối = null. Throw nếu index invalid.',
              hints: [
                'Câu hỏi 1: Nếu KHÔNG set <code>data[--size] = null</code>, hậu quả là gì?',
                'Câu hỏi 2: Cần generic cast khi return — vì sao? Type erasure cho phép cast luôn?'
              ],
              solution: {
                code: `@SuppressWarnings("unchecked")
public T remove(int index) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    T removed = (T) data[index];
    // Shift sang trái
    System.arraycopy(data, index + 1, data, index, size - index - 1);
    data[--size] = null;        // QUAN TRỌNG: để GC dọn được
    return removed;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — shift trung bình n/2. Space O(1).',
                explanationVi: 'Nếu không set null, slot cuối vẫn giữ reference cũ → object popped không được GC dọn dù caller release → leak ẩn. JDK ArrayList code thật cũng có dòng <code>elementData[--size] = null</code>.'
              }
            },
            {
              title: 'Iterator<T> + fail-fast ConcurrentModificationException',
              prompt: 'Implement Iterable<T>. Bonus: throw ConcurrentModificationException nếu list bị modify trong khi iterate.',
              hints: [
                'Câu hỏi 1: <code>modCount</code> là gì? Track ra sao? Iterator chụp lại giá trị nào và khi nào?',
                'Câu hỏi 2: Iterator nội bộ có cần biết thay đổi của list không? Phát hiện ra sao tại next()?'
              ],
              solution: {
                code: `public class MyArrayList<T> implements Iterable<T> {
    private Object[] data = new Object[8];
    private int size = 0;
    private int modCount = 0;   // tăng mỗi lần add/remove

    public void add(T v) { /* ... */ modCount++; }
    public T remove(int i) { /* ... */ modCount++; return removed; }

    @Override public Iterator<T> iterator() {
        return new Iterator<>() {
            int cursor = 0;
            int expectedModCount = modCount;   // chụp lúc tạo

            @Override public boolean hasNext() { return cursor < size; }

            @SuppressWarnings("unchecked")
            @Override public T next() {
                if (modCount != expectedModCount)
                    throw new ConcurrentModificationException();
                if (cursor >= size) throw new NoSuchElementException();
                return (T) data[cursor++];
            }
        };
    }
}`,
                lang: 'java',
                complexityVi: 'next/hasNext O(1). modCount overhead O(1) per modify.',
                explanationVi: 'Fail-fast pattern: iterator chụp <code>modCount</code> lúc create. Mọi modify (add/remove/clear) tăng <code>modCount</code>. Tại <code>next()</code>, so sánh — khác = ai đó modify giữa iteration → throw. Tránh trả về data inconsistent.'
              }
            }
          ]
        }
      ]
    },

    // ========================================================================
    // Module 1.3 — Linked Lists
    // ========================================================================
    {
      id: 'mod-1-3',
      title: 'Linked Lists — Pointer Manipulation Mental Model',
      lessons: [
        {
          id: 'l-1-3-1',
          type: 'theory',
          title: 'Singly Linked List — Tư duy con trỏ',
          mentalModel: {
            vi: `Mỗi <strong>node</strong> là một hộp 2 ngăn: ngăn 1 chứa giá trị, ngăn 2 chứa "địa chỉ hộp tiếp theo" (hoặc <code>null</code> nếu hết). List chỉ giữ con trỏ <code>head</code> (và tùy chọn <code>tail</code>, <code>size</code>).
<br/><br/>
<strong>Bí kíp giấy bút</strong>: trước khi code, VẼ các node, đánh dấu pointer cần sửa (prev, curr, next). Khi bug, vẽ lại từng bước. 90% bug LL là quên cập nhật 1 pointer hoặc cập nhật sai thứ tự.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Heap allocation per node</strong>
Mỗi <code>new Node()</code> = 1 allocation. Với 1 triệu node:
<ul>
<li>ArrayList&lt;Integer&gt;: 1 mảng + 1M Integer ≈ 24 MB.</li>
<li>LinkedList&lt;Integer&gt;: 1M Integer + 1M Node (~32 byte overhead/node) ≈ 56 MB.</li>
</ul>
LinkedList tốn ~2.3× RAM so với ArrayList cho cùng số phần tử.
<br/><br/>
<strong>2) Cache miss per traversal</strong>
Nodes rải rác trong heap → mỗi traversal node = 1 cache miss (~50-100 cycle so với 1-3 cycle cache hit). Traversal 1M node = ~50ms LL vs ~5ms ArrayList — order of magnitude khác biệt.
<br/><br/>
<strong>3) Vì sao Java's LinkedList ít ai dùng?</strong>
Nó implement cả List và Deque, nhưng cho mọi op (kể cả add đầu), ArrayDeque nhanh hơn nhờ cache locality. Quy tắc: <em>nếu bạn nghĩ "có lẽ tôi cần LinkedList", bạn đang nhầm</em>. Trừ khi cần O(1) remove bằng node reference (LRU cache).`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào LL thực sự win?</h3>
<ul>
  <li><strong>LRU Cache</strong>: kết hợp HashMap + doubly LL để O(1) move-to-front.</li>
  <li><strong>Undo/Redo</strong>: chỉ cần push/pop, không cần random access.</li>
  <li><strong>OS scheduler</strong>: process queue insert/remove ở giữa biết node ref.</li>
</ul>

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Quên update tail</strong> khi addFirst vào empty list → tail = null nhưng head != null → inconsistent.</li>
  <li><strong>Cập nhật pointer sai thứ tự khi reverse</strong>: <code>curr.next = prev; curr = curr.next;</code> → infinite loop. Phải lưu <code>next</code> trước khi cắt.</li>
  <li><strong>NPE khi traversal</strong>: <code>while (curr.next != null)</code> dừng ở node CUỐI. Để xử lý cả node cuối, dùng <code>while (curr != null)</code>.</li>
  <li><strong>Equality bằng <code>==</code></strong> giữa 2 LL → chỉ so head reference. Cần loop so từng value.</li>
  <li><strong>Không xử lý cycle</strong> khi traverse → infinite loop. Floyd's algorithm phát hiện.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'SinglyLinkedList — bản đầy đủ',
              code: `public class SinglyLinkedList<T> {
    private static class Node<T> {
        T value;
        Node<T> next;
        Node(T v) { this.value = v; }
    }

    private Node<T> head;
    private Node<T> tail;
    private int size;

    public void addFirst(T v) {
        Node<T> n = new Node<>(v);
        n.next = head;
        head = n;
        if (tail == null) tail = n;
        size++;
    }

    public void addLast(T v) {
        Node<T> n = new Node<>(v);
        if (tail == null) { head = tail = n; }
        else { tail.next = n; tail = n; }
        size++;
    }

    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T v = head.value;
        head = head.next;
        if (head == null) tail = null;
        size--;
        return v;
    }
}`
            },
            {
              title: 'Reverse in-place — pattern "ba con trỏ"',
              code: `public Node<T> reverse(Node<T> head) {
    Node<T> prev = null;
    Node<T> curr = head;
    while (curr != null) {
        Node<T> next = curr.next;   // 1. lưu next TRƯỚC khi cắt
        curr.next = prev;            // 2. đảo hướng
        prev = curr;                 // 3. tiến prev
        curr = next;                 // 4. tiến curr
    }
    return prev;   // prev = head mới
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự nghĩ ra reverse algorithm',
              prompt: `KHÔNG cho code. Đảo ngược singly LL TẠI CHỖ (O(1) space). Dẫn dắt:
1. Đứng ở node X muốn quay mũi tên ngược lại (X.next = node trước X) — singly có biết node trước không?
2. Cần lưu pointer nào TRƯỚC khi sửa X.next? Vì sao?
3. Có 3 con trỏ prev, curr, next — thứ tự cập nhật là gì?
4. Vòng lặp dừng khi nào? Return cái gì làm head mới?`
            },
            {
              title: 'Cycle detection',
              prompt: `LL có thể có cycle. KHÔNG cho code. Hỏi tôi:
1. Nếu dùng HashSet lưu node visited — chi phí time/space?
2. Có cách O(1) space không? Hint: 2 con trỏ tốc độ khác nhau.
3. Tortoise (1 bước) + Hare (2 bước) — vì sao chắc chắn gặp nếu có cycle?
4. Sau khi gặp, làm sao tìm node bắt đầu cycle?`
            }
          ],
          exercises: [
            {
              title: 'Reverse iteratively',
              prompt: 'Reverse singly LL in-place, O(1) extra space. Return head mới.',
              hints: [
                'Câu hỏi 1: Trước khi đảo <code>curr.next = prev</code>, bạn còn truy cập được node tiếp theo không?',
                'Câu hỏi 2: Khi vòng lặp dừng (curr == null), <code>prev</code> đang ở đâu?'
              ],
              solution: {
                code: `public ListNode reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — mỗi node thăm 1 lần. Space O(1) — chỉ 3 biến.',
                explanationVi: '3 con trỏ: prev (đã xử lý), curr (đang xử lý), next (chưa xử lý — backup). Thứ tự CỰC QUAN TRỌNG: lưu next → cắt curr.next → tiến prev → tiến curr. Sai thứ tự → mất reference phần còn lại của list.'
              }
            },
            {
              title: 'Detect cycle (Floyd tortoise-hare)',
              prompt: 'Trả true nếu LL có cycle. O(1) space.',
              hints: [
                'Câu hỏi 1: Khi cả 2 con trỏ ĐÃ vào cycle, khoảng cách hai con trỏ thay đổi ra sao mỗi step?',
                'Câu hỏi 2: Tại sao vòng lặp điều kiện là <code>fast != null && fast.next != null</code>?'
              ],
              solution: {
                code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — khi cả 2 vào cycle, khoảng cách giảm 1 mỗi step → gặp trong ≤ cycle length. Space O(1).',
                explanationVi: 'Hare nhanh hơn 2×. Nếu có cycle, gap (fast − slow) giảm 1 mỗi step (cộng theo mod chu kỳ) → về 0 tất yếu. Nếu KHÔNG cycle, fast hit null trước.'
              }
            },
            {
              title: 'Find middle (1 pass)',
              prompt: 'Trả node giữa LL. Nếu chẵn, trả node thứ 2 trong 2 node giữa.',
              hints: [
                'Câu hỏi 1: Có thể count length rồi loop n/2 — 2 pass. Có cách 1 pass không?',
                'Câu hỏi 2: Khi fast hit null (chẵn) hoặc fast.next null (lẻ), slow đang ở đâu?'
              ],
              solution: {
                code: `public ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — 1 pass. Space O(1).',
                explanationVi: 'Hare đi 2×, slow đi 1×. Khi hare hit end, slow ở giữa. Với n chẵn, slow ở node "thứ 2 trong 2 node giữa" (LeetCode convention).'
              }
            },
            {
              title: 'Remove N-th from end',
              prompt: 'Cho LL và n, xóa node thứ n từ cuối. 1 pass. Vd: [1,2,3,4,5] n=2 → [1,2,3,5].',
              hints: [
                'Câu hỏi 1: Two pointers cách nhau n bước. Khi fast hit end, slow ở đâu?',
                'Câu hỏi 2: Vì sao dùng dummy node? Xét case xóa head.'
              ],
              solution: {
                code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);   // dummy → head → ...
    ListNode fast = dummy, slow = dummy;

    // Fast tiến n+1 bước (để slow dừng TRƯỚC node cần xóa)
    for (int i = 0; i <= n; i++) fast = fast.next;

    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;     // bypass node cần xóa
    return dummy.next;
}`,
                lang: 'java',
                complexityVi: 'Time O(L) với L = length. Space O(1).',
                explanationVi: '<strong>Dummy node trick</strong>: tạo node ảo trước head → KHÔNG cần xử lý special case "xóa head". Fast đi trước n+1 → khi fast = null, slow đứng NGAY TRƯỚC node cần xóa → bypass bằng <code>slow.next = slow.next.next</code>.'
              }
            }
          ]
        },

        {
          id: 'l-1-3-2',
          type: 'theory',
          title: 'Doubly Linked List & The LRU Cache Use Case',
          mentalModel: {
            vi: `Doubly LL = mỗi node có cả <code>prev</code> + <code>next</code>. Chi phí: thêm 1 pointer/node (~8 byte). Lợi ích: <strong>remove(node) trong O(1)</strong> nếu đã có reference.
<br/><br/>
<strong>Killer use case</strong>: LRU Cache. Cần: (a) tra cứu O(1) theo key, (b) đẩy item lên "mới nhất" O(1) khi access, (c) loại bỏ "cũ nhất" O(1) khi đầy. → HashMap + DoublyLL.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Sentinel nodes</h3>
Thay vì <code>head</code>/<code>tail</code> có thể null, dùng 2 node "dummy" ảo. Lợi ích: KHÔNG bao giờ check null khi insert/remove. Code sạch hơn nhiều, ít bug edge case (empty list, single node).
<br/><br/>
<strong>Memory overhead</strong>:
DoublyLL ~48 byte/node (value + prev + next + header) vs singly ~32 byte/node. Đáng cho use case như LRU.
<br/><br/>
<strong>Concurrent DLL</strong>:
ConcurrentLinkedDeque trong Java dùng lock-free với CAS — phức tạp. Đa số trường hợp dùng <code>BlockingDeque</code> đơn giản hơn.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào dùng DLL?</h3>
<ul>
  <li>Cần traverse cả 2 hướng (vd: browser history).</li>
  <li>Cần O(1) remove tại node đã biết — LRU, MRU.</li>
  <li>Cần insertBefore(node) O(1).</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Forget update both directions</strong> khi insert/remove → list inconsistent.</li>
  <li><strong>Không dùng sentinel</strong> → code phình to vì xử lý null. Sentinel = vài byte RAM đổi lấy 50% lines of code.</li>
  <li><strong>LRU không link 2 helper</strong> (addToFront + unlink) → bug rất khó debug. Tách 2 helper riêng và TEST.</li>
  <li><strong>HashMap value lưu Node, KHÔNG lưu V</strong> — đây là sai lầm phổ biến. Map lưu Node để có thể move-to-front O(1).</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'LRU Cache — bộ khung đầy đủ',
              code: `public class LRUCache<K, V> {
    static class Node<K, V> {
        K key; V value;
        Node<K, V> prev, next;
        Node(K k, V v) { this.key = k; this.value = v; }
    }

    private final int capacity;
    private final Map<K, Node<K, V>> map = new HashMap<>();
    private final Node<K, V> head = new Node<>(null, null);   // sentinel
    private final Node<K, V> tail = new Node<>(null, null);   // sentinel

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }

    public V get(K key) {
        Node<K, V> n = map.get(key);
        if (n == null) return null;
        moveToFront(n);
        return n.value;
    }

    public void put(K key, V value) {
        Node<K, V> existing = map.get(key);
        if (existing != null) {
            existing.value = value;
            moveToFront(existing);
            return;
        }
        Node<K, V> n = new Node<>(key, value);
        map.put(key, n);
        addToFront(n);
        if (map.size() > capacity) {
            Node<K, V> oldest = tail.prev;
            unlink(oldest);
            map.remove(oldest.key);
        }
    }

    private void addToFront(Node<K, V> n) {
        n.prev = head; n.next = head.next;
        head.next.prev = n; head.next = n;
    }
    private void unlink(Node<K, V> n) {
        n.prev.next = n.next; n.next.prev = n.prev;
    }
    private void moveToFront(Node<K, V> n) { unlink(n); addToFront(n); }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'LRU Cache — dẫn dắt thiết kế',
              prompt: `KHÔNG cho code. Dẫn dắt:
1. Để get O(1) theo key — cấu trúc nào?
2. Để track "access order" + remove O(1) — cấu trúc nào? Vì sao không ArrayList?
3. Khi access item, đẩy lên đầu O(1) — cần biết node trước nó không? Singly hay doubly?
4. Vì sao kết hợp HashMap + DoublyLL? Map lưu gì — V hay Node?
5. Sentinel head/tail giúp gì cho code?`
            }
          ],
          exercises: [
            {
              title: 'LRU Cache full implementation',
              prompt: 'Implement LRUCache(capacity) với get(key)→V hoặc null, put(key, value). Both O(1) average.',
              hints: [
                'Câu hỏi 1: HashMap lưu key → V hay key → Node? Vì sao Node?',
                'Câu hỏi 2: Khi put trigger eviction, làm sao biết key cũ nhất để remove khỏi map?'
              ],
              solution: {
                code: `class LRUCache {
    static class Node { int key, val; Node prev, next; Node(int k, int v) { key = k; val = v; } }

    private final int cap;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.cap = capacity;
        head.next = tail; tail.prev = head;
    }

    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        moveToFront(n);
        return n.val;
    }

    public void put(int key, int value) {
        Node existing = map.get(key);
        if (existing != null) { existing.val = value; moveToFront(existing); return; }
        Node n = new Node(key, value);
        map.put(key, n);
        addFront(n);
        if (map.size() > cap) {
            Node oldest = tail.prev;
            unlink(oldest);
            map.remove(oldest.key);
        }
    }

    private void addFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }
    private void unlink(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void moveToFront(Node n) { unlink(n); addFront(n); }
}`,
                lang: 'java',
                complexityVi: 'Time: get O(1) average, put O(1) average. Space O(capacity).',
                explanationVi: 'HashMap lưu <code>key → Node</code> để khi get/put có thể MOVE node trong DLL O(1). Nếu chỉ lưu <code>key → V</code>, mỗi access phải scan DLL để tìm node → O(n). Sentinel head/tail xóa edge case empty/single.'
              }
            }
          ]
        }
      ]
    },

    // ========================================================================
    // Module 1.4 — Stack & Queue
    // ========================================================================
    {
      id: 'mod-1-4',
      title: 'Stack, Queue & Circular Buffer',
      lessons: [
        {
          id: 'l-1-4-1',
          type: 'practice',
          title: 'Stack & Its Hidden Use Cases',
          mentalModel: {
            vi: `Stack = <strong>LIFO</strong> (Last In First Out). Chồng đĩa: chỉ thêm/lấy ở trên cùng.
<br/><br/>
Ứng dụng ẩn:
<ul>
<li>Call stack — mỗi function call là 1 frame, return = pop.</li>
<li>Undo (Ctrl+Z).</li>
<li>Parse biểu thức ngoặc.</li>
<li>DFS đệ quy (stack ngầm) hoặc iterative (bạn quản lý).</li>
<li>Monotonic stack — "next greater element".</li>
</ul>`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Tại sao KHÔNG dùng <code>java.util.Stack</code>?</strong>
Class legacy từ JDK 1.0, extends Vector (synchronized → slow). Java khuyến nghị <code>Deque&lt;T&gt; stack = new ArrayDeque&lt;&gt;()</code>.
<br/><br/>
<strong>2) ArrayDeque bên trong</strong>
Circular array với 2 con trỏ head/tail. Push/pop ở cả 2 đầu đều O(1) amortized. Capacity ALWAYS power of 2 → wrap bằng bitwise AND thay vì modulo (nhanh hơn 5-10×).
<br/><br/>
<strong>3) Monotonic stack</strong>
Stack maintain tính chất tăng/giảm dần. Khi push value mới vi phạm, POP cho đến khi OK. Mỗi value push 1 lần + pop ≤ 1 lần → amortized O(n) cho toàn bộ scan, dù mỗi step có thể pop nhiều.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào Stack thay Queue?</h3>
<ul>
  <li>Cần undo/backtrack — Stack.</li>
  <li>DFS — Stack.</li>
  <li>Matching ngoặc/dấu — Stack.</li>
  <li>BFS, scheduling — Queue.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Dùng <code>Stack</code> class</strong> thay vì <code>Deque</code> → slow + API nghèo nàn.</li>
  <li><strong>Quên check empty trước pop</strong> → NoSuchElementException.</li>
  <li><strong>Push/pop nhầm thứ tự</strong> — luôn push opener, pop khi gặp closer.</li>
  <li><strong>Monotonic stack quên check empty</strong> trước peek/pop → NPE.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Validate parentheses — kinh điển',
              code: `public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
        }
    }
    return stack.isEmpty();    // còn opener thừa = invalid
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Monotonic stack pattern',
              prompt: `"Next greater element": với mỗi phần tử tìm phần tử lớn hơn ĐẦU TIÊN bên phải. KHÔNG cho code. Hỏi tôi:
1. Brute O(n²) — vì sao chậm?
2. Duyệt từ phải qua trái, có thể "nhớ" các giá trị đã thấy. Nhớ TẤT CẢ hay một số?
3. Giá trị nhỏ hơn giá trị mới thấy — còn dùng được không? Hint: bị chặn.
4. Stack giữ tính chất gì? Tăng hay giảm dần?
5. Khi push value mới, làm gì với những value vi phạm trên đỉnh stack?`
            }
          ],
          exercises: [
            {
              title: 'Min Stack — push/pop/top/getMin đều O(1)',
              prompt: 'Implement MinStack hỗ trợ push, pop, top, getMin. Tất cả O(1).',
              hints: [
                'Câu hỏi 1: Track min trong 1 biến — khi pop min ra, làm sao biết min mới?',
                'Câu hỏi 2: Maintain 2 stack? Stack thứ 2 lưu min "tới thời điểm này". Khi push x, push <code>min(x, currentMin)</code>.'
              ],
              solution: {
                code: `class MinStack {
    private final Deque<Integer> data = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    public void push(int x) {
        data.push(x);
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }

    public void pop() {
        data.pop();
        mins.pop();
    }

    public int top() { return data.peek(); }
    public int getMin() { return mins.peek(); }
}`,
                lang: 'java',
                complexityVi: 'Time: tất cả O(1). Space: O(n) cho 2 stack.',
                explanationVi: '2 stack song song. <code>mins</code> giữ "min so far at this depth". Khi pop, pop CẢ 2 — đảm bảo min hiện tại đúng. Trade space O(n) lấy O(1) cho getMin.'
              }
            },
            {
              title: 'Evaluate Reverse Polish Notation (RPN)',
              prompt: 'Đánh giá biểu thức postfix. Vd: ["2","1","+","3","*"] = (2+1)*3 = 9.',
              hints: [
                'Câu hỏi 1: Token là số — làm gì? Token là operator — làm gì?',
                'Câu hỏi 2: Khi pop 2 operand cho phép trừ/chia — thứ tự a-b hay b-a?'
              ],
              solution: {
                code: `public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        switch (t) {
            case "+", "-", "*", "/" -> {
                int b = stack.pop();
                int a = stack.pop();        // a TRƯỚC, b SAU — quan trọng cho - và /
                stack.push(switch (t) {
                    case "+" -> a + b;
                    case "-" -> a - b;
                    case "*" -> a * b;
                    case "/" -> a / b;
                    default -> 0;
                });
            }
            default -> stack.push(Integer.parseInt(t));
        }
    }
    return stack.pop();
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — mỗi token push hoặc 1 op + 2 pop. Space O(n) worst case (toàn số trước khi gặp operator).',
                explanationVi: 'Postfix tự nhiên cho stack. Operand pop = b TRƯỚC, a SAU (vì b là LIFO mới hơn) → a op b. Sai thứ tự sẽ sai cho - và /.'
              }
            },
            {
              title: 'Daily Temperatures (Monotonic Stack)',
              prompt: 'Cho int[] temperatures, trả int[] answer where answer[i] = số ngày phải đợi đến nhiệt độ cao hơn. Vd: [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0].',
              hints: [
                'Câu hỏi 1: Brute O(n²). Có cách O(n)?',
                'Câu hỏi 2: Khi gặp temp[i] mới, làm gì với những temp đã thấy NHỎ HƠN nó trong stack?'
              ],
              solution: {
                code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();   // stack of INDICES, monotonic decreasing

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
            int prevIdx = stack.pop();
            answer[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }
    return answer;
}`,
                lang: 'java',
                complexityVi: 'Time O(n) amortized — mỗi index push 1 lần + pop ≤ 1 lần. Space O(n) worst.',
                explanationVi: 'Stack lưu INDEX, không value (cần để tính khoảng cách). Maintain decreasing — gặp index mới có temp lớn hơn TOP, pop và set answer[top] = i - top. Element trong stack cuối cùng (không tìm được lớn hơn) giữ default 0.'
              }
            }
          ]
        },

        {
          id: 'l-1-4-2',
          type: 'practice',
          title: 'Queue & Circular Buffer',
          mentalModel: {
            vi: `Queue = <strong>FIFO</strong>. Hàng người: vào đuôi, ra đầu.
<br/><br/>
<strong>Circular buffer</strong>: mảng cố định, 2 con trỏ head/tail. Khi đến cuối mảng wrap về đầu. KHÔNG bao giờ shift. Đây là cách ArrayDeque hoạt động.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Power of 2 trick</h3>
Vì sao dùng <code>head = (head + 1) % capacity</code>? Để wrap. Nhưng <code>%</code> chậm! JDK trick: nếu capacity là <strong>power of 2</strong> thì <code>(head + 1) & (capacity - 1)</code> nhanh hơn 5-10× (bitwise AND). Đó là lý do ArrayDeque luôn round capacity lên power of 2 (8, 16, 32, ...).
<br/><br/>
<strong>BlockingQueue cho concurrent</strong>
LinkedBlockingQueue, ArrayBlockingQueue — thread-safe với lock. Producer/consumer pattern xài rộng rãi.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào Queue?</h3>
<ul>
  <li>BFS trên graph/tree.</li>
  <li>Producer/consumer.</li>
  <li>Job scheduling.</li>
  <li>Buffer giữa 2 stage có tốc độ khác nhau.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>LinkedList làm Queue</strong> — chậm hơn ArrayDeque ~3× do cache miss.</li>
  <li><strong>poll() vs remove()</strong>: poll trả null khi empty, remove throw. Nhầm = bug khó debug.</li>
  <li><strong>offer() vs add()</strong>: offer trả false khi full (bounded), add throw. Nhầm = exception bất ngờ.</li>
  <li><strong>Quên modulo trong circular buffer</strong> → ArrayIndexOutOfBoundsException khi wrap.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'CircularQueue<T>',
              code: `public class CircularQueue<T> {
    private final Object[] data;
    private int head = 0, tail = 0, size = 0;

    public CircularQueue(int capacity) {
        this.data = new Object[capacity];
    }

    public boolean offer(T v) {
        if (size == data.length) return false;
        data[tail] = v;
        tail = (tail + 1) % data.length;
        size++;
        return true;
    }

    @SuppressWarnings("unchecked")
    public T poll() {
        if (size == 0) return null;
        T v = (T) data[head];
        data[head] = null;
        head = (head + 1) % data.length;
        size--;
        return v;
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'BFS dùng Queue ra sao?',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Vì sao BFS dùng Queue chứ không Stack?
2. Nếu thay Stack — kết quả thành cái gì? (DFS)
3. Đánh dấu visited TRƯỚC push hay SAU pop? Vì sao quan trọng?
4. Vì sao BFS đảm bảo shortest path unweighted?`
            }
          ],
          exercises: [
            {
              title: 'Resizable circular queue',
              prompt: 'Mở rộng CircularQueue: thay vì return false khi full, double capacity.',
              hints: [
                'Câu hỏi 1: Khi resize, head có thể KHÔNG ở vị trí 0. Làm sao copy data theo đúng thứ tự logical?',
                'Câu hỏi 2: Sau resize, head và tail nên đặt lại thế nào?'
              ],
              solution: {
                code: `public void offer(T v) {
    if (size == data.length) grow();
    data[tail] = v;
    tail = (tail + 1) % data.length;
    size++;
}

@SuppressWarnings("unchecked")
private void grow() {
    Object[] bigger = new Object[data.length * 2];
    // Copy theo thứ tự logical bắt đầu từ head
    for (int i = 0; i < size; i++) {
        bigger[i] = data[(head + i) % data.length];
    }
    data = bigger;
    head = 0;
    tail = size;
}`,
                lang: 'java',
                complexityVi: 'Time: offer amortized O(1) (double grow). Worst case O(n) khi grow. Space O(n).',
                explanationVi: 'Khi grow, head có thể ở GIỮA buffer cũ (do wrap). Copy phần tử thứ <code>i</code> logical = <code>data[(head + i) % oldCap]</code>. Sau copy, reset head=0, tail=size để buffer mới "phẳng" lại.'
              }
            },
            {
              title: 'Deque (ArrayDeque from scratch)',
              prompt: 'Implement addFirst/addLast/removeFirst/removeLast, tất cả O(1) amortized.',
              hints: [
                'Câu hỏi 1: head lùi 1 vị trí: <code>head = (head - 1 + cap) % cap</code> — vì sao +cap?',
                'Câu hỏi 2: addFirst hay addLast — cái nào dễ hơn? Tại sao?'
              ],
              solution: {
                code: `public class ArrayDeque<T> {
    private Object[] data = new Object[16];
    private int head = 0, tail = 0, size = 0;

    public void addLast(T v) {
        ensureCap(size + 1);
        data[tail] = v;
        tail = (tail + 1) % data.length;
        size++;
    }

    public void addFirst(T v) {
        ensureCap(size + 1);
        head = (head - 1 + data.length) % data.length;   // +cap vì có thể âm
        data[head] = v;
        size++;
    }

    @SuppressWarnings("unchecked")
    public T removeFirst() {
        if (size == 0) return null;
        T v = (T) data[head];
        data[head] = null;
        head = (head + 1) % data.length;
        size--;
        return v;
    }

    @SuppressWarnings("unchecked")
    public T removeLast() {
        if (size == 0) return null;
        tail = (tail - 1 + data.length) % data.length;
        T v = (T) data[tail];
        data[tail] = null;
        size--;
        return v;
    }

    private void ensureCap(int need) {
        if (need <= data.length) return;
        Object[] bigger = new Object[data.length * 2];
        for (int i = 0; i < size; i++) bigger[i] = data[(head + i) % data.length];
        data = bigger; head = 0; tail = size;
    }
}`,
                lang: 'java',
                complexityVi: 'Time: tất cả 4 op amortized O(1). Space O(capacity).',
                explanationVi: '<code>head - 1 + cap</code>: tránh kết quả âm khi head=0. Modulo trong Java: <code>-1 % 16 = -1</code> (KHÔNG phải 15) → cộng cap trước.'
              }
            }
          ]
        }
      ]
    },

    // ========================================================================
    // Module 1.5 — HashMap deep dive
    // ========================================================================
    {
      id: 'mod-1-5',
      title: 'HashMap & HashSet — How Collisions Really Work',
      lessons: [
        {
          id: 'l-1-5-1',
          type: 'theory',
          title: 'HashMap Internals — Buckets, Hashing, Collisions, Treeify',
          subtitle: { vi: 'Cấu trúc dữ liệu QUAN TRỌNG NHẤT phải hiểu tường tận.' },
          mentalModel: {
            vi: `Hình dung HashMap như <strong>tủ nhiều ngăn kéo</strong> (buckets). Cất (key, value):
<ol>
<li>Tính <code>hash = key.hashCode()</code>.</li>
<li>Chọn ngăn: <code>index = hash &amp; (capacity - 1)</code>.</li>
<li>Vào ngăn, check key đã có chưa (equals). Có → overwrite; chưa → thêm.</li>
</ol>
Khi nhiều key rơi vào CÙNG ngăn (collision), ngăn thành <strong>linked list</strong>. Java 8+: list quá dài (&gt;8) → tự chuyển <strong>red-black tree</strong> để O(log n) thay O(n).`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Vì sao capacity LUÔN là power of 2?</strong>
Để dùng <code>hash &amp; (cap-1)</code> thay <code>hash % cap</code> (modulo chậm 5-10×). VD cap=16: <code>cap-1=15=0b1111</code> → <code>hash &amp; 15</code> = 4 bit cuối. Phân bố đều 0..15.
<br/><br/>
<strong>2) Vì sao Java rehash hash()?</strong>
JDK gọi <code>(h = key.hashCode()) ^ (h >>> 16)</code> trước khi mask. Mục đích: trộn bit cao xuống thấp. Nhiều hashCode tệ phân bố toàn ở bit cao (<code>Integer.hashCode() = value</code> — số nhỏ thì bit cao toàn 0). Không trộn → mọi key rơi vào bucket 0..15 dù cap = 1M.
<br/><br/>
<strong>3) Load factor 0.75 — vì sao?</strong>
Tradeoff:
<ul>
<li>Nhỏ (0.5) → ít collision, tốn RAM, resize liên tục.</li>
<li>Lớn (0.9) → tiết kiệm RAM, nhiều collision.</li>
</ul>
0.75 là điểm cân bằng thực nghiệm — Poisson distribution cho thấy với LF 0.75, ~88% bucket có 0-1 entry, &lt;1% bucket có ≥4.
<br/><br/>
<strong>4) Treeify threshold</strong>
Khi 1 bucket có ≥8 entry: linked list → red-black tree (O(log n) operations). Khi shrink &lt;6: tree → list. Hysteresis tránh flip-flop.
<br/><br/>
<strong>5) Resize split bucket thành 2</strong>
Cap 16→32. Một key cũ ở bucket i giờ phải ở i HOẶC i+16 (thêm 1 bit). JDK tận dụng: KHÔNG rehash, chỉ check 1 bit để biết key ở lại i hay sang i+16. Tiết kiệm khổng lồ.
<br/><br/>
<strong>6) HashMap KHÔNG thread-safe</strong>
2 thread cùng put có thể infinite loop (bug nổi tiếng Java 7) hoặc data loss. Dùng <code>ConcurrentHashMap</code> cho multi-thread.`
          },
          theory: {
            vi: `<h3>The "Why" — HashMap vs TreeMap vs LinkedHashMap?</h3>
<ul>
  <li><strong>HashMap</strong> — O(1) average, no order. Default choice.</li>
  <li><strong>TreeMap</strong> — O(log n), sorted by key. Cần range query (floorKey, ceilingKey).</li>
  <li><strong>LinkedHashMap</strong> — O(1) + insertion order. <code>accessOrder=true</code> → LRU-friendly out of box.</li>
</ul>

<h3>Junior Pitfalls — RẤT HAY mắc</h3>
<ul>
  <li><strong>Override <code>equals()</code> mà quên <code>hashCode()</code></strong> → put rồi get null. Quy tắc bất di bất dịch.</li>
  <li><strong>Key mutable, mutate sau put</strong> → key "biến mất" khỏi map. Bucket index tính lại không trùng.</li>
  <li><strong>HashMap trong multi-thread</strong> → infinite loop / data loss. Dùng ConcurrentHashMap.</li>
  <li><strong>Iterate Map.Entry và remove qua map.remove(key)</strong> → ConcurrentModificationException. Dùng iterator.remove().</li>
  <li><strong>Custom hashCode trả constant</strong> (vd <code>return 0</code>) → mọi key vào 1 bucket → suy biến O(n). Performance disaster.</li>
  <li><strong>Khởi tạo capacity quá nhỏ</strong> cho map lớn → resize liên tục. <code>new HashMap&lt;&gt;(expectedSize)</code> nếu biết trước.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'MyHashMap với separate chaining (comment tiếng Việt)',
              code: `public class MyHashMap<K, V> {
    private static class Entry<K, V> {
        final K key;
        V value;
        Entry<K, V> next;
        Entry(K k, V v) { this.key = k; this.value = v; }
    }

    private Entry<K, V>[] table;
    private int size = 0;
    private static final float LOAD_FACTOR = 0.75f;

    @SuppressWarnings("unchecked")
    public MyHashMap() { this.table = (Entry<K, V>[]) new Entry[16]; }

    private int bucket(Object key) {
        if (key == null) return 0;
        int h = key.hashCode();
        h = h ^ (h >>> 16);                  // trộn bit cao xuống thấp
        return h & (table.length - 1);       // power of 2 trick
    }

    public V get(K key) {
        for (Entry<K, V> e = table[bucket(key)]; e != null; e = e.next) {
            if (Objects.equals(e.key, key)) return e.value;
        }
        return null;
    }

    public void put(K key, V value) {
        int b = bucket(key);
        for (Entry<K, V> e = table[b]; e != null; e = e.next) {
            if (Objects.equals(e.key, key)) { e.value = value; return; }
        }
        Entry<K, V> head = new Entry<>(key, value);
        head.next = table[b];
        table[b] = head;
        size++;
        if (size > table.length * LOAD_FACTOR) resize();
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        Entry<K, V>[] old = table;
        table = (Entry<K, V>[]) new Entry[old.length * 2];
        size = 0;
        for (Entry<K, V> head : old)
            for (Entry<K, V> e = head; e != null; e = e.next) put(e.key, e.value);
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Suy luận từ đầu về HashMap',
              prompt: `Tự nghĩ ra HashMap KHÔNG đọc tài liệu. KHÔNG cho code. Hỏi tôi:
1. Nếu chỉ dùng 1 mảng và lưu (key, value) tại index = hash(key), điều gì xảy ra khi 2 key cùng hash?
2. 2 cách giải collision chính là gì? (chaining vs open addressing)
3. Khi nào mảng "đầy" và cần resize? Đo bằng tiêu chí gì?
4. Resize N → 2N — phải làm gì với entry cũ? Rehash hết hay shortcut?
5. Nếu hashCode() của key tệ (return 0), HashMap suy biến thành cái gì?
6. Key mutable, sửa field sau put — get() còn lấy được không? Tại sao?`
            },
            {
              title: 'Vì sao equals & hashCode phải đi đôi?',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Hai object equals == true → hashCode bằng nhau? Vì sao? Hỏng cái gì nếu không?
2. Hai object hashCode bằng nhau → equals có cần true không?
3. Chỉ override equals (quên hashCode) — put rồi get có lấy được không?
4. Chỉ override hashCode (quên equals) — put 2 lần cùng "key" có thành 2 entry không?
5. IDE auto-generate hashCode/equals — vì sao dùng CÙNG field?`
            }
          ],
          exercises: [
            {
              title: 'remove(K key)',
              prompt: 'Unlink entry khỏi bucket list. Trả old value hoặc null.',
              hints: [
                'Câu hỏi 1: Cần track previous khi traverse bucket list — vì sao?',
                'Câu hỏi 2: Edge case: entry cần remove là HEAD của bucket — xử lý ra sao?'
              ],
              solution: {
                code: `public V remove(K key) {
    int b = bucket(key);
    Entry<K, V> prev = null;
    for (Entry<K, V> e = table[b]; e != null; e = e.next) {
        if (Objects.equals(e.key, key)) {
            if (prev == null) table[b] = e.next;     // entry là HEAD
            else              prev.next = e.next;    // bypass entry
            size--;
            return e.value;
        }
        prev = e;
    }
    return null;
}`,
                lang: 'java',
                complexityVi: 'Time O(1) average, O(n) worst (bucket toàn collision). Space O(1).',
                explanationVi: 'Singly linked list cần track previous để unlink. Edge case head: <code>table[b] = e.next</code> thay vì <code>prev.next = e.next</code>.'
              }
            },
            {
              title: 'MyHashSet built on MyHashMap',
              prompt: 'Implement HashSet bằng cách wrap MyHashMap<E, Object>.',
              hints: [
                'Câu hỏi 1: HashMap cần (key, value). HashSet chỉ cần key. Value đặt gì cho tiện?',
                'Câu hỏi 2: contains, add, remove của Set — map sang method nào của underlying Map?'
              ],
              solution: {
                code: `public class MyHashSet<E> {
    private static final Object PRESENT = new Object();   // sentinel singleton
    private final MyHashMap<E, Object> map = new MyHashMap<>();

    public void add(E value)        { map.put(value, PRESENT); }
    public boolean contains(E v)    { return map.get(v) != null; }
    public boolean remove(E v)      { return map.remove(v) != null; }
    public int size()                { return map.size(); }
}`,
                lang: 'java',
                complexityVi: 'Tất cả O(1) average — kế thừa từ MyHashMap.',
                explanationVi: 'Composition: HashSet thực sự là HashMap với value cố định (sentinel). Một Object PRESENT dùng chung — tiết kiệm memory. Đây là cách JDK HashSet hiện thực thật.'
              }
            }
          ]
        }
      ]
    },

    // ========================================================================
    // Module 1.6 — Trees & Heap
    // ========================================================================
    {
      id: 'mod-1-6',
      title: 'Trees, BST & PriorityQueue (Heap)',
      lessons: [
        {
          id: 'l-1-6-1',
          type: 'theory',
          title: 'Binary Trees & Recursion Mental Model',
          mentalModel: {
            vi: `<strong>Mọi bài tree đều dạng</strong>: "Giả sử đã giải xong cho 2 subtree con, làm gì để có kết quả cho node hiện tại?" Đây là tư duy <strong>top-down recursion</strong> — TIN vào kết quả của recursive call.
<br/><br/>
Ví dụ tính chiều cao: <code>height(node) = 1 + max(height(left), height(right))</code>. KHÔNG cần biết left/right tính ra sao — chỉ cần tin chúng đúng. "Leap of faith" của recursion.`
          },
          underTheHood: {
            vi: `<h3>First Principles — Recursion thực sự là gì?</h3>
<strong>1) Stack frame</strong>
Mỗi recursive call tạo 1 stack frame chứa: param, biến local, return address. Frame được push khi call, pop khi return. Java default stack ~500 KB → ~10k frame deep với function đơn giản.
<br/><br/>
<strong>2) Tree skewed = LL trá hình</strong>
Cây "skewed" (chỉ 1 nhánh) giống LinkedList. Recursion depth = n. Stack overflow trên n &gt; ~10k. Balanced tree: depth = log₂(n), 1M node = 20 frame → an toàn.
<br/><br/>
<strong>3) Tail call optimization (KHÔNG có trong Java)</strong>
Scala/Kotlin compile tail recursion thành loop. Java không. Nếu cần iterative, bạn TỰ viết với explicit Stack.
<br/><br/>
<strong>4) DFS vs BFS — tradeoff space</strong>
<ul>
<li>DFS: O(h) space (chiều cao). Cây balanced = O(log n). Tệ nhất O(n).</li>
<li>BFS: O(w) space (chiều rộng). Cây balanced = O(n/2) ≈ O(n). Tốt nhất O(1).</li>
</ul>`
          },
          theory: {
            vi: `<h3>Bốn cách duyệt</h3>
<ul>
  <li><strong>Pre-order</strong>: root → L → R. Xử lý root trước (vd: clone tree).</li>
  <li><strong>In-order</strong>: L → root → R. BST in-order = SORTED!</li>
  <li><strong>Post-order</strong>: L → R → root. Cần info từ children trước (vd: height, delete tree).</li>
  <li><strong>Level-order</strong> (BFS): dùng Queue.</li>
</ul>

<h3>The "Why" — BST vs HashMap?</h3>
<ul>
  <li>HashMap: O(1) average lookup, NHƯNG no order.</li>
  <li>BST/TreeMap: O(log n), sorted, hỗ trợ range query (floorKey, ceilingKey, subMap).</li>
  <li>Cần "key gần nhất X" — TreeMap chiến thắng.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Quên null check</strong> base case → NullPointerException trên leaf.</li>
  <li><strong>Trace recursion để debug</strong> → rối não. Nên TIN recursive call đúng, focus base + combine.</li>
  <li><strong>BST validate sai</strong>: chỉ check node-vs-children → tree không phải BST nhưng pass. Đúng: pass [lo, hi] bounds.</li>
  <li><strong>Modify tree khi traverse</strong> → infinite loop hoặc skip node. Build list rồi modify riêng.</li>
  <li><strong>Stack overflow trên skewed tree</strong> → convert sang iterative với Deque.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'TreeNode + traversals',
              code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { this.val = v; }
}

public void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);
    inorder(node.right, out);
}

public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Recursion thinking framework',
              prompt: `Cho bài tree mới. KHÔNG giải hộ. Hỏi tôi:
1. Bài có thể chia thành subproblem thế nào cho left, right?
2. Giả sử left và right đã trả kết quả đúng — kết hợp ra sao cho node hiện tại?
3. Base case (node == null) trả về gì?
4. Cần return gì lên trên — 1 giá trị hay nhiều?
5. Có cần biến global/instance cho max/result tracking không?
Áp dụng cho bài "diameter of binary tree".`
            },
            {
              title: 'BST validation common bug',
              prompt: `Bài "Validate BST". Mọi người fail vì chỉ check node-vs-direct-children. KHÔNG cho đáp án. Hỏi tôi:
1. Vẽ counter-example: cây mà mọi node-vs-children đúng nhưng KHÔNG phải BST.
2. Điều kiện BST đúng là gì? (Hint: mọi node trái phải nhỏ hơn root, không chỉ con trực tiếp)
3. Truyền thông tin "đang ở subtree trái của X" xuống recursion thế nào?
4. Helper cần 2 tham số gì? (lo, hi)`
            }
          ],
          exercises: [
            {
              title: 'Height of tree',
              prompt: 'Tính chiều cao binary tree recursive. Null = 0.',
              hints: [
                'Câu hỏi 1: Base case node == null trả gì?',
                'Câu hỏi 2: Combine left + right thế nào để có height của node hiện tại?'
              ],
              solution: {
                code: `public int height(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — thăm mỗi node 1 lần. Space O(h) stack depth. Worst skewed = O(n).',
                explanationVi: 'Post-order pattern: cần info từ children trước khi tính node. <code>1 +</code> = "thêm 1 cho node hiện tại".'
              }
            },
            {
              title: 'BST insert + search',
              prompt: 'Implement BST với insert(int) + boolean contains(int). Recursive.',
              hints: [
                'Câu hỏi 1: Insert vào subtree nào khi val &lt; node.val? &gt;?',
                'Câu hỏi 2: Return value của insert là gì? Vì sao "return new root"?'
              ],
              solution: {
                code: `class BST {
    private TreeNode root;

    public void insert(int val) { root = insertHelper(root, val); }

    private TreeNode insertHelper(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val)      node.left  = insertHelper(node.left, val);
        else if (val > node.val) node.right = insertHelper(node.right, val);
        return node;     // duplicates ignored
    }

    public boolean contains(int val) { return contains(root, val); }

    private boolean contains(TreeNode node, int val) {
        if (node == null) return false;
        if (val == node.val) return true;
        return val < node.val ? contains(node.left, val) : contains(node.right, val);
    }
}`,
                lang: 'java',
                complexityVi: 'Time: average O(log n), worst O(n) khi skewed (sorted insert). Space O(h) stack.',
                explanationVi: '"Return new root" pattern: helper trả node hiện tại (đã update children). Pattern này cực tiện cho insert/delete vì xử lý cả null base case sạch.'
              }
            },
            {
              title: 'Validate BST (đúng cách với bounds)',
              prompt: 'isValidBST(root) — chỉ check node-vs-children là SAI. Phải pass bounds.',
              hints: [
                'Câu hỏi 1: Khi đi xuống subtree LEFT, upper bound đổi không? Lower bound?',
                'Câu hỏi 2: Vì sao dùng <code>Long</code> cho bounds thay vì <code>int</code>?'
              ],
              solution: {
                code: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);
}`,
                lang: 'java',
                complexityVi: 'Time O(n) — thăm mỗi node 1 lần. Space O(h) stack.',
                explanationVi: '<code>long</code> tránh bug khi node.val = Integer.MIN_VALUE hoặc MAX_VALUE — bounds gốc Long.MIN/MAX an toàn. Đi LEFT: hi = node.val (mọi node trái phải &lt; node.val). Đi RIGHT: lo = node.val.'
              }
            }
          ]
        },

        {
          id: 'l-1-6-2',
          type: 'theory',
          title: 'PriorityQueue (Heap) — When You Need Min/Max Fast',
          mentalModel: {
            vi: `Heap = "<strong>cây nhị phân hoàn chỉnh</strong> với tính chất: parent ≤ children (min-heap) hoặc parent ≥ children (max-heap)". KHÔNG sorted hoàn toàn — chỉ ưu tiên root.
<br/><br/>
Hình dung mảng <code>heap[]</code>: parent của i là <code>(i-1)/2</code>, children là <code>2i+1, 2i+2</code>. Đó là lý do heap KHÔNG cần pointer.
<br/><br/>
Operations:
<ul>
<li><strong>peek</strong>: O(1) — luôn root.</li>
<li><strong>offer</strong>: O(log n) — sift up.</li>
<li><strong>poll</strong>: O(log n) — last vào root rồi sift down.</li>
</ul>`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Heap khác BST ở đâu?</strong>
BST: range query, sorted traversal — đắt. Heap: chỉ làm 1 việc (lấy min/max) — rẻ, compact (không pointer).
<br/><br/>
<strong>2) Build heap O(n) — NOT O(n log n)</strong>
Trick: sift-down từ CUỐI lên đầu. Hầu hết node ở đáy chỉ sift 0-1 step. Floyd's heap construction: tổng cost = sum của (heightOfSubtreeAt(i)) qua i từ 0..n/2 ≈ 2n. Đây là tối ưu kinh ngạc — viết "PriorityQueue(collection)" trong Java cũng dùng O(n).
<br/><br/>
<strong>3) Heap KHÔNG ổn định (stable)</strong>
2 element cùng priority có thể bị swap thứ tự. Nếu cần stable, lưu kèm "insertion index" làm tie-breaker.
<br/><br/>
<strong>4) Indexed priority queue</strong>
Heap thường KHÔNG hỗ trợ decrease-key O(log n) (cần biết position node trong heap). Dijkstra optimal cần indexed PQ — Java không có sẵn, phải tự code.`
          },
          theory: {
            vi: `<h3>The "Why" — Top-K vs sort?</h3>
<ul>
  <li>Cần TOP K, không cần thứ tự còn lại — heap size K, O(n log k).</li>
  <li>Sort O(n log n) — chậm hơn khi k &lt;&lt; n.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Mặc định Java PriorityQueue là MIN-heap</strong> → muốn max thì <code>Comparator.reverseOrder()</code>.</li>
  <li><strong>Top K LARGEST dùng MIN-heap</strong> (không phải max!). Nhầm = bug logic.</li>
  <li><strong>Comparator dùng <code>a.val - b.val</code></strong> → overflow với int lớn. Dùng <code>Integer.compare</code>.</li>
  <li><strong>Sửa priority của element sau khi offer</strong> → heap invariant broken. Phải poll + re-offer.</li>
  <li><strong>Iterate PriorityQueue</strong> → KHÔNG theo thứ tự sorted! Chỉ có poll() mới lấy theo thứ tự.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'PriorityQueue patterns',
              code: `// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Custom comparator cho object
PriorityQueue<int[]> byFreq = new PriorityQueue<>((a, b) -> a[1] - b[1]);

// Build heap O(n) từ collection
PriorityQueue<Integer> built = new PriorityQueue<>(Arrays.asList(5, 3, 8, 1));`
            }
          ],
          socraticPrompts: [
            {
              title: 'Khi nào heap?',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Bài có "top K" hay "K-th" hay "median"?
2. "Lúc nào cũng lấy min/max" trong khi data thay đổi?
3. Chỉ sort 1 lần xong rồi access theo thứ tự — heap lợi không?
4. Insert + lấy min trên stream — Array, BST, hay Heap?
5. Median-of-stream — vì sao 2 heap (min + max) là tối ưu?`
            }
          ],
          exercises: [
            {
              title: 'Kth Largest in Array',
              prompt: 'Tìm phần tử lớn thứ K. <em>Bonus: O(n log k) thay vì O(n log n) sort.</em>',
              hints: [
                'Câu hỏi 1: MIN-heap size K — vì sao MIN cho LARGEST? Top heap là gì sau khi xong?',
                'Câu hỏi 2: Khi heap size vượt K, làm gì?'
              ],
              solution: {
                code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();    // loại NHỎ NHẤT
    }
    return minHeap.peek();    // K phần tử lớn nhất còn lại, peek = K-th
}`,
                lang: 'java',
                complexityVi: 'Time O(n log k) — n lần offer/poll, mỗi O(log k). Space O(k).',
                explanationVi: 'Min-heap top = min trong group. Khi value mới &gt; top, swap. Cuối cùng heap chứa K phần tử lớn nhất; peek = K-th largest. Better than sort khi k &lt;&lt; n.'
              }
            },
            {
              title: 'Merge K sorted lists',
              prompt: 'Merge k LinkedList đã sort thành 1 sorted list. Optimal time.',
              hints: [
                'Câu hỏi 1: Brute concat-then-sort: O(N log N). Có cách dùng tính chất "đã sort" không?',
                'Câu hỏi 2: Heap chứa gì — value hay Node? Vì sao Node?'
              ],
              solution: {
                code: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

    // Push head của mỗi list
    for (ListNode head : lists) if (head != null) heap.offer(head);

    ListNode dummy = new ListNode(0), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode min = heap.poll();
        tail.next = min;
        tail = min;
        if (min.next != null) heap.offer(min.next);
    }
    return dummy.next;
}`,
                lang: 'java',
                complexityVi: 'Time O(N log k) — N = total nodes, k = số list. Mỗi node 1 offer + 1 poll, mỗi O(log k). Space O(k) cho heap.',
                explanationVi: 'Heap lưu Node để khi poll min, advance pointer của list đó (min.next) push lại heap. Heap size luôn ≤ k. Đây là pattern "K-way merge" — Hadoop/Spark cũng dùng.'
              }
            }
          ]
        }
      ]
    },

    // ========================================================================
    // ============================================================
    // Module 1.7 — NEW: Advanced Sorting & Divide and Conquer
    // ============================================================
    // ========================================================================
    {
      id: 'mod-1-7',
      title: 'Advanced Sorting & Divide and Conquer (Merge Sort + Quick Sort)',
      lessons: [

        // ----- l-1-7-1: D&C foundations -----
        {
          id: 'l-1-7-1',
          type: 'theory',
          title: 'Divide & Conquer — Mental Model & Recursion Tree',
          subtitle: { en: 'Split, solve, combine', vi: 'Chia, giải, gộp — kiến trúc đẹp nhất trong thuật toán' },
          mentalModel: {
            vi: `<strong>Divide and Conquer</strong> = đệ quy có cấu trúc. Mỗi bài toán giải bằng 3 bước:
<ol>
<li><strong>Divide</strong> — chia bài thành ≥ 2 subproblem nhỏ hơn (giống nhau về bản chất).</li>
<li><strong>Conquer</strong> — giải mỗi subproblem (đệ quy). Base case: bài đủ nhỏ → giải thẳng.</li>
<li><strong>Combine</strong> — gộp lời giải subproblem để có lời giải tổng.</li>
</ol>

<strong>Recursion tree</strong>: vẽ ra cây các call. Mỗi level làm tổng O(n) công. Có log₂(n) level. Tổng cost = n × log n = <strong>O(n log n)</strong>. Đây là vì sao Merge Sort, Quick Sort, FFT đều O(n log n).
<br/><br/>
<strong>Câu thần chú</strong>: "Tôi tin rằng đệ quy đã giải đúng cho subproblem nhỏ. Việc của tôi chỉ là combine."`
          },
          underTheHood: {
            vi: `<h3>First Principles — Recursion tree & stack frames</h3>
<strong>1) Stack frames qua recursion</strong>
Mỗi recursive call push 1 frame: chứa param, local var, return address. Frame size ~50-200 byte. Stack default Java = 512 KB → max depth ~5k-10k frame an toàn.
<br/><br/>
Cho mergeSort trên mảng 1M phần tử: depth = log₂(1M) ≈ 20 frame. Cực an toàn. Cho quicksort skewed (pivot tệ): depth = n = 1M → STACK OVERFLOW.
<br/><br/>
<strong>2) Visualizing recursion tree</strong>
<pre>
mergeSort([1,2,3,4,5,6,7,8]) — n=8
├── mergeSort([1,2,3,4]) — n=4
│   ├── mergeSort([1,2]) — n=2
│   │   ├── mergeSort([1]) — base
│   │   └── mergeSort([2]) — base
│   └── mergeSort([3,4]) — n=2
└── mergeSort([5,6,7,8]) — n=4
    ├── ...
</pre>
Level 0: 1 call, work n.
Level 1: 2 call, mỗi work n/2 → tổng n.
Level 2: 4 call, mỗi work n/4 → tổng n.
Level k: 2^k call, mỗi work n/2^k → tổng n.
Tổng: n × log₂(n) levels = O(n log n).
<br/><br/>
<strong>3) Master Theorem</strong>
Cho công thức T(n) = a·T(n/b) + f(n) (đệ quy chia thành a subproblem size n/b, cộng f(n) công combine).
<ul>
<li>Nếu f(n) = O(n^c) với c &lt; log_b(a) → T(n) = Θ(n^log_b(a))</li>
<li>Nếu f(n) = Θ(n^log_b(a)) → T(n) = Θ(n^log_b(a) · log n)</li>
<li>Nếu f(n) = Ω(n^c) với c &gt; log_b(a) → T(n) = Θ(f(n))</li>
</ul>
Merge sort: a=2, b=2, f(n)=O(n). log_2(2) = 1, c=1 → case 2 → Θ(n log n). ✓`
          },
          theory: {
            vi: `<h3>The "Why" — Vì sao D&C mạnh?</h3>
<ul>
  <li><strong>Cache friendly</strong>: subproblem nhỏ thường vừa cache → tốc độ thực tế tốt hơn O() suy ra.</li>
  <li><strong>Parallelizable</strong>: 2 subproblem độc lập có thể chạy trên 2 core khác nhau. Java ForkJoinPool tận dụng.</li>
  <li><strong>Predictable performance</strong>: O(n log n) cho mọi input của Merge Sort. Quick Sort trung bình O(n log n).</li>
  <li><strong>Reusable</strong>: pattern áp dụng cho sort, search, multiplication, FFT, closest pair, ...</li>
</ul>

<h3>Junior Pitfalls — D&C</h3>
<ul>
  <li><strong>Quên base case</strong> → infinite recursion → StackOverflowError.</li>
  <li><strong>Subproblem không nhỏ hơn</strong> (vd: chia [l, r] thành [l, r] và [l+1, r]) → cũng infinite.</li>
  <li><strong>Combine sai</strong> → toàn bộ recursion vô nghĩa. Test combine với subproblem nhỏ trước.</li>
  <li><strong>Chia không đều</strong> (vd: 1 và n-1) → unbalanced tree depth = n → O(n²) worst.</li>
  <li><strong>Allocate array mới ở mỗi call</strong> → memory pressure. Reuse buffer khi có thể.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'D&C template tổng quát',
              code: `// Template generic
public Result solve(Problem p) {
    // 1. Base case
    if (p.isSmallEnough()) return solveDirect(p);

    // 2. Divide
    Problem[] subs = p.divide();

    // 3. Conquer (recursive)
    Result[] subResults = new Result[subs.length];
    for (int i = 0; i < subs.length; i++) {
        subResults[i] = solve(subs[i]);
    }

    // 4. Combine
    return combine(subResults);
}`
            },
            {
              title: 'Power(x, n) — O(log n) via D&C',
              code: `// Naive O(n): nhân x với chính nó n lần.
// D&C O(log n): chia n đôi, đệ quy.
public double myPow(double x, int n) {
    if (n == 0) return 1.0;
    if (n < 0) return 1.0 / myPow(x, -n);
    double half = myPow(x, n / 2);
    if (n % 2 == 0) return half * half;
    else            return half * half * x;
}
// T(n) = T(n/2) + O(1) → Θ(log n) by Master Theorem (a=1, b=2, c=0)`
            }
          ],
          socraticPrompts: [
            {
              title: 'Tự suy luận D&C',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 3 bước D&C là gì? Cho ví dụ từ đời thực (không thuật toán) — chia việc trong gia đình chẳng hạn.
2. Vì sao subproblem phải nhỏ hơn? Hậu quả nếu không?
3. Vẽ recursion tree cho mergeSort mảng 8 phần tử. Mỗi level làm bao nhiêu công?
4. Tại sao O(n log n) chứ không O(n × n)? (Hint: tổng công per level, không phải sum của số call)
5. Quicksort worst case O(n²) — recursion tree skewed thế nào?
Dẫn tôi qua từng câu.`
            },
            {
              title: 'Recursion vs iteration tradeoff',
              prompt: `KHÔNG cho đáp án. Hỏi tôi:
1. Recursion sạch hơn iteration cho D&C — vì sao?
2. Khi nào recursion gây StackOverflowError? Cho con số cụ thể.
3. Convert quicksort sang iterative thế nào? Stack of (lo, hi) tuples?
4. Tail recursion là gì? Java có optimize không?
5. Khi nào tránh recursion — production code có quy ước gì?`
            }
          ],
          exercises: [
            {
              title: 'Maximum Subarray bằng D&C',
              prompt: 'Kadane là DP O(n). Bonus: viết bằng D&C O(n log n). Hint: max subarray nằm ở left subarray, right subarray, hoặc CROSS giữa.',
              hints: [
                'Câu hỏi 1: 3 case max subarray nằm ở đâu? Tính mỗi case ra sao?',
                'Câu hỏi 2: Crossing max — start ở mid, mở rộng 2 phía. Time complexity?'
              ],
              solution: {
                code: `public int maxSubArray(int[] nums) {
    return divide(nums, 0, nums.length - 1);
}

private int divide(int[] nums, int lo, int hi) {
    if (lo == hi) return nums[lo];                      // base case
    int mid = lo + (hi - lo) / 2;
    int leftMax  = divide(nums, lo, mid);
    int rightMax = divide(nums, mid + 1, hi);
    int crossMax = crossing(nums, lo, mid, hi);
    return Math.max(Math.max(leftMax, rightMax), crossMax);
}

private int crossing(int[] nums, int lo, int mid, int hi) {
    int sum = 0, leftSum = Integer.MIN_VALUE;
    for (int i = mid; i >= lo; i--) {
        sum += nums[i];
        leftSum = Math.max(leftSum, sum);
    }
    sum = 0;
    int rightSum = Integer.MIN_VALUE;
    for (int i = mid + 1; i <= hi; i++) {
        sum += nums[i];
        rightSum = Math.max(rightSum, sum);
    }
    return leftSum + rightSum;
}`,
                lang: 'java',
                complexityVi: 'Time O(n log n) — T(n) = 2T(n/2) + O(n). Master Theorem case 2. Space O(log n) stack.',
                explanationVi: 'Kadane DP nhanh hơn (O(n)) nhưng D&C version dạy bạn cách tổ chức "3 case combine" — pattern cho closest-pair-of-points, count inversion, ...'
              }
            },
            {
              title: 'Power(x, n) iterative version',
              prompt: 'myPow(x, n) — convert recursive sang iterative (bit manipulation). Vẫn O(log n).',
              hints: [
                'Câu hỏi 1: Đệ quy chia n đôi → biểu diễn n trong base 2 có ý nghĩa gì?',
                'Câu hỏi 2: Mỗi bit của n: 0 hay 1, quyết định nhân result với x^(current_power) không?'
              ],
              solution: {
                code: `public double myPow(double x, int n) {
    long N = n;                       // long để handle n = Integer.MIN_VALUE
    if (N < 0) { x = 1 / x; N = -N; }
    double result = 1.0;
    while (N > 0) {
        if ((N & 1) == 1) result *= x;   // bit 1 → multiply
        x *= x;                            // square base
        N >>= 1;                           // next bit
    }
    return result;
}`,
                lang: 'java',
                complexityVi: 'Time O(log n) — n có log₂(n) bit. Space O(1) — không recursion.',
                explanationVi: 'Exponentiation by squaring. n = sum của bit×2^i. <code>x^n = x^(b0·1) × x^(b1·2) × x^(b2·4) × ...</code>. Loop qua bit, mỗi step square x. Khi bit = 1, multiply vào result. <code>long N</code> tránh overflow khi <code>n = Integer.MIN_VALUE</code> (do <code>-MIN_VALUE</code> overflow int).'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              '3 bước D&C: Divide → Conquer → Combine.',
              'Recursion tree giúp visualize complexity — tổng work per level × số level.',
              'Master Theorem là công cụ tính O() cho mọi đệ quy chia đều.',
              'Cẩn thận stack overflow trên recursion deep hoặc skewed.',
              'Subproblem PHẢI nhỏ hơn — nếu không infinite recursion.'
            ]
          }
        },

        // ----- l-1-7-2: Merge Sort -----
        {
          id: 'l-1-7-2',
          type: 'practice',
          title: 'Merge Sort — Stable, Predictable, External-Sort Friendly',
          mentalModel: {
            vi: `<strong>Merge Sort</strong>:
<ol>
<li>Chia mảng làm đôi (mid).</li>
<li>Đệ quy sort 2 nửa.</li>
<li>Merge 2 nửa đã sort thành 1 mảng sort (linear scan).</li>
</ol>

Recursion tree: depth log₂(n). Mỗi level merge tổng n element → O(n log n) MỌI input (best/average/worst đều giống).
<br/><br/>
<strong>Stable</strong>: 2 phần tử bằng nhau giữ thứ tự gốc → quan trọng khi sort theo nhiều tiêu chí.`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Time: O(n log n) GUARANTEED</strong>
Khác Quick Sort có worst O(n²), Merge Sort luôn n log n. Java's Arrays.sort cho object dùng <strong>Timsort</strong> (Merge Sort tối ưu cho gần-sorted) chính vì điều này — predictable.
<br/><br/>
<strong>2) Space: O(n) extra</strong>
Cần buffer để merge. Đây là nhược điểm vs Quick Sort (in-place). Trên RAM hạn chế, Quick Sort thắng. Nhưng cho <strong>external sort</strong> (data &gt; RAM, sort từ disk), Merge Sort là CHUẨN — vì merge chỉ cần đọc 2 stream tuần tự.
<br/><br/>
<strong>3) Iterative bottom-up</strong>
Có thể viết Merge Sort iterative: merge cặp size 1 → size 2 → size 4 → ... Tiết kiệm stack, dễ parallelize.
<br/><br/>
<strong>4) Stable property</strong>
Khi merge, nếu <code>left[i] == right[j]</code>, lấy <code>left[i]</code> TRƯỚC. Đảm bảo phần tử trái (xuất hiện trước trong mảng gốc) giữ vị trí trước. Mất stability nếu lấy <code>right[j]</code> trước.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào Merge Sort?</h3>
<ul>
  <li><strong>Cần stability</strong> (sort theo nhiều criteria).</li>
  <li><strong>External sort</strong> (data lớn hơn RAM).</li>
  <li><strong>Linked list sort</strong> — Merge Sort tự nhiên cho LL (split bằng tortoise/hare). Quick Sort tệ cho LL.</li>
  <li><strong>Parallel</strong> — 2 subproblem độc lập, chia cho 2 core. ForkJoinPool ideal.</li>
  <li><strong>Cần predictable performance</strong> — system real-time.</li>
</ul>

<h3>Junior Pitfalls</h3>
<ul>
  <li><strong>Allocate array mới mỗi recursion</strong> → memory thrashing. Allocate 1 buffer dùng chung.</li>
  <li><strong>Index sai khi merge</strong> — off-by-one ở boundary. Test với mảng 2-3 phần tử trước.</li>
  <li><strong>Mất stability</strong> khi merge nếu so <code>&gt;</code> thay vì <code>&gt;=</code>. Cẩn thận điều kiện.</li>
  <li><strong>Forget copy lại buffer</strong> sau merge → kết quả bị overwrite ở recursion tiếp.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Merge Sort — recursive với buffer chung',
              code: `public class MergeSorter {
    public void sort(int[] arr) {
        int[] buf = new int[arr.length];     // 1 buffer dùng chung, KHÔNG allocate mỗi call
        sort(arr, buf, 0, arr.length - 1);
    }

    private void sort(int[] arr, int[] buf, int lo, int hi) {
        if (lo >= hi) return;                 // base case: 0 hoặc 1 phần tử
        int mid = lo + (hi - lo) / 2;
        sort(arr, buf, lo, mid);
        sort(arr, buf, mid + 1, hi);
        merge(arr, buf, lo, mid, hi);
    }

    private void merge(int[] arr, int[] buf, int lo, int mid, int hi) {
        // Copy phần cần merge vào buf
        for (int k = lo; k <= hi; k++) buf[k] = arr[k];

        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) {
            if (buf[i] <= buf[j]) arr[k++] = buf[i++];   // <= giữ STABLE
            else                  arr[k++] = buf[j++];
        }
        // Phần còn lại của nửa trái (nếu có) — phần phải đã ở đúng chỗ
        while (i <= mid) arr[k++] = buf[i++];
    }
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Suy luận Merge Sort',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. 3 bước D&C cho Merge Sort là gì cụ thể?
2. Merge 2 nửa đã sort — 2 con trỏ duyệt. Cần buffer riêng không? Vì sao?
3. Vẽ recursion tree cho mảng [5,2,4,7,1,3,6,8]. Mỗi level merge bao nhiêu phần tử?
4. Vì sao O(n log n) là cận DƯỚI cho sort comparison-based?
5. External sort: data 1TB, RAM 8GB — Merge Sort vận hành thế nào với disk?`
            },
            {
              title: 'Stable sort intuition',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Sort theo 2 tiêu chí (rating DESC, rồi date ASC) — cần stable sort? Vì sao?
2. Strategy: sort theo tiêu chí PHỤ trước, rồi tiêu chí CHÍNH với stable sort. Vì sao đúng?
3. Quick Sort không stable — workaround: nhét index vào key. Trade-off?
4. Java's Arrays.sort cho int[] là Quick Sort (unstable). Cho Object[] là Timsort (stable). Vì sao khác biệt?`
            }
          ],
          exercises: [
            {
              title: 'Implement Merge Sort iterative (bottom-up)',
              prompt: 'Tránh recursion. Merge cặp size 1 → 2 → 4 → ...',
              hints: [
                'Câu hỏi 1: Vòng ngoài tăng <code>size = 1, 2, 4, ...</code> đến khi ≥ n. Vòng trong làm gì?',
                'Câu hỏi 2: Block cuối có thể không đủ <code>size</code> phần tử — xử lý ra sao?'
              ],
              solution: {
                code: `public void mergeSortIter(int[] arr) {
    int n = arr.length;
    int[] buf = new int[n];
    for (int size = 1; size < n; size *= 2) {
        for (int lo = 0; lo < n - size; lo += 2 * size) {
            int mid = lo + size - 1;
            int hi = Math.min(lo + 2 * size - 1, n - 1);   // boundary cuối có thể lệch
            merge(arr, buf, lo, mid, hi);
        }
    }
}

private void merge(int[] arr, int[] buf, int lo, int mid, int hi) {
    for (int k = lo; k <= hi; k++) buf[k] = arr[k];
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
        if (buf[i] <= buf[j]) arr[k++] = buf[i++];
        else                  arr[k++] = buf[j++];
    }
    while (i <= mid) arr[k++] = buf[i++];
}`,
                lang: 'java',
                complexityVi: 'Time O(n log n). Space O(n) buffer. Stack O(1) — không recursion.',
                explanationVi: 'Bottom-up: bắt đầu từ block size 1 (mỗi phần tử là 1 group sorted trivially), merge cặp thành size 2, rồi 4, 8, ... <code>Math.min(..., n-1)</code> xử lý block cuối ngắn hơn 2×size. Tránh StackOverflow trên mảng RẤT lớn.'
              }
            },
            {
              title: 'Count Inversions (sử dụng Merge Sort)',
              prompt: 'Cho mảng, đếm "inversion" = số cặp (i, j) với i &lt; j và arr[i] &gt; arr[j]. Vd [2,4,1,3,5] có 3 inversions: (2,1), (4,1), (4,3). Optimal O(n log n).',
              hints: [
                'Câu hỏi 1: Brute O(n²) check mọi cặp. Merge Sort cho phép đếm trong khi sort — đếm ở bước nào?',
                'Câu hỏi 2: Khi merge, lấy phần tử từ RIGHT half — bao nhiêu phần tử ở LEFT half còn lại vẫn lớn hơn nó? Đó là inversion gì?'
              ],
              solution: {
                code: `public long countInversions(int[] arr) {
    int[] buf = new int[arr.length];
    return mergeSortCount(arr, buf, 0, arr.length - 1);
}

private long mergeSortCount(int[] arr, int[] buf, int lo, int hi) {
    if (lo >= hi) return 0;
    int mid = lo + (hi - lo) / 2;
    long count = mergeSortCount(arr, buf, lo, mid)
               + mergeSortCount(arr, buf, mid + 1, hi);
    count += mergeCount(arr, buf, lo, mid, hi);
    return count;
}

private long mergeCount(int[] arr, int[] buf, int lo, int mid, int hi) {
    for (int k = lo; k <= hi; k++) buf[k] = arr[k];
    int i = lo, j = mid + 1, k = lo;
    long count = 0;
    while (i <= mid && j <= hi) {
        if (buf[i] <= buf[j]) {
            arr[k++] = buf[i++];
        } else {
            arr[k++] = buf[j++];
            count += (mid - i + 1);     // tất cả phần tử LEFT còn lại > buf[j]
        }
    }
    while (i <= mid) arr[k++] = buf[i++];
    return count;
}`,
                lang: 'java',
                complexityVi: 'Time O(n log n) — cùng cấu trúc Merge Sort, thêm count O(1) per swap. Space O(n) buffer.',
                explanationVi: 'Trick: khi merge, lấy <code>buf[j]</code> (RIGHT) trước <code>buf[i]</code> (LEFT) → CÓ <code>mid - i + 1</code> phần tử ở LEFT half lớn hơn <code>buf[j]</code> → đó chính là <code>mid - i + 1</code> inversion. Cộng dồn. Đếm trong khi sort = bonus free.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Merge Sort: stable, O(n log n) MỌI input, O(n) extra space.',
              'External sort, LL sort, parallel sort — Merge Sort thắng Quick Sort.',
              'Iterative bottom-up tránh stack overflow trên mảng cực lớn.',
              'Merge step: <code>&lt;=</code> để giữ stability.'
            ]
          }
        },

        // ----- l-1-7-3: Quick Sort -----
        {
          id: 'l-1-7-3',
          type: 'practice',
          title: 'Quick Sort — Fastest In Practice, Pivot Selection Is Everything',
          mentalModel: {
            vi: `<strong>Quick Sort</strong>:
<ol>
<li>Chọn <strong>pivot</strong> (một phần tử trong mảng).</li>
<li>Partition: sắp xếp sao cho mọi phần tử &lt; pivot ở bên trái, &gt; pivot bên phải. Pivot ở đúng vị trí final.</li>
<li>Đệ quy sort 2 nửa (không cần combine — partition đã chuẩn).</li>
</ol>
KHÔNG có combine step → in-place → O(log n) space (chỉ stack).
<br/><br/>
<strong>Bí mật</strong>: pivot tốt → balanced split → O(n log n) trung bình. Pivot tệ (luôn min hoặc max) → unbalanced → O(n²) worst case.`
          },
          underTheHood: {
            vi: `<h3>First Principles</h3>
<strong>1) Tại sao Quick Sort nhanh hơn Merge Sort trong thực tế?</strong>
Mặc dù cả hai O(n log n), Quick Sort:
<ul>
<li><strong>In-place</strong> — không allocate buffer → ít cache miss.</li>
<li><strong>Cache friendly</strong> — partition truy cập tuần tự, cực fit cache line.</li>
<li><strong>Constant factor nhỏ</strong> — chỉ swap, không copy.</li>
</ul>
Benchmark: Quick Sort thường nhanh hơn Merge Sort 2-3× trên cùng input. Java's <code>Arrays.sort(int[])</code> dùng Dual-Pivot Quick Sort chính vì lý do này.
<br/><br/>
<strong>2) Pivot selection</strong>
<ul>
<li><strong>First/last element</strong>: dễ code nhưng O(n²) trên mảng đã sort hoặc reverse-sorted (worst case kinh điển).</li>
<li><strong>Random element</strong>: tránh worst case adversarial. Java JDK 7+ dùng.</li>
<li><strong>Median-of-three</strong>: lấy median(first, middle, last) làm pivot. Heuristic tốt cho near-sorted data.</li>
<li><strong>Ninther</strong>: median of 3 median (9 sample). JDK Dual-Pivot dùng cho mảng &gt; 286 elements.</li>
</ul>
<br/><br/>
<strong>3) Lomuto vs Hoare partition</strong>
<ul>
<li><strong>Lomuto</strong>: pivot = last element. 1 pointer slow, 1 pointer fast. Dễ code, nhưng nhiều swap hơn (kể cả khi mảng đã sort).</li>
<li><strong>Hoare</strong>: 2 pointer từ 2 đầu vào giữa. Ít swap hơn (~3×). Khó code (off-by-one nhiều), nhưng nhanh thực tế.</li>
</ul>
<br/><br/>
<strong>4) 3-way partition (Dutch flag)</strong>
Quan trọng khi mảng có nhiều duplicate. Partition thành &lt; pivot, == pivot, &gt; pivot. Không recurse vào phần == pivot → tiết kiệm.
<br/><br/>
<strong>5) Worst case O(n²) — vì sao?</strong>
Pivot luôn min/max → 1 partition empty, 1 partition size n-1. Recursion depth = n. Tổng cost = n + (n-1) + (n-2) + ... + 1 = O(n²). FIX: random pivot hoặc median-of-three.
<br/><br/>
<strong>6) Tail call elimination</strong>
Sau recursion + partition, recurse vào nửa NHỎ HƠN trước rồi LOOP cho nửa lớn hơn. Giới hạn stack ở O(log n) cả worst case.`
          },
          theory: {
            vi: `<h3>The "Why" — Khi nào Quick Sort?</h3>
<ul>
  <li><strong>Sort in-memory mảng primitive</strong> — Java Arrays.sort(int[]) dùng.</li>
  <li><strong>Cache-critical hot loop</strong>.</li>
  <li><strong>Không cần stability</strong> (Quick Sort KHÔNG stable).</li>
  <li><strong>Average performance quan trọng hơn worst case</strong> — vì random pivot làm worst case ~ 0%.</li>
</ul>

<h3>Junior Pitfalls — Quick Sort</h3>
<ul>
  <li><strong>Pivot luôn last element</strong> trên mảng đã sort → O(n²). Adversarial inputs phá app production. Phải random.</li>
  <li><strong>Quicksort trên linked list</strong> → cực chậm (truy cập random là O(n)). Dùng Merge Sort.</li>
  <li><strong>Lomuto trên mảng có nhiều duplicate</strong> → cũng O(n²)! Vì partition tạo 1 phần size n-1. Dùng 3-way partition.</li>
  <li><strong>Stack overflow</strong> trên skewed split → recurse vào nửa nhỏ trước, loop nửa lớn.</li>
  <li><strong>Off-by-one trong partition</strong> — bug kinh điển. Test với mảng 2-3 phần tử + đã sort + reverse sorted.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Quick Sort — Lomuto partition + random pivot',
              code: `public class QuickSorter {
    private final Random rng = new Random();

    public void sort(int[] arr) { quickSort(arr, 0, arr.length - 1); }

    private void quickSort(int[] arr, int lo, int hi) {
        while (lo < hi) {                                  // tail call elimination: loop thay recurse
            int p = partition(arr, lo, hi);
            // Recurse vào nửa NHỎ HƠN, loop nửa lớn hơn → stack ≤ O(log n)
            if (p - lo < hi - p) {
                quickSort(arr, lo, p - 1);
                lo = p + 1;
            } else {
                quickSort(arr, p + 1, hi);
                hi = p - 1;
            }
        }
    }

    private int partition(int[] arr, int lo, int hi) {
        // Random pivot — tránh O(n²) adversarial
        int pivotIdx = lo + rng.nextInt(hi - lo + 1);
        swap(arr, pivotIdx, hi);                            // move pivot to end
        int pivot = arr[hi];

        int i = lo - 1;                                     // boundary phần < pivot
        for (int j = lo; j < hi; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, hi);                               // pivot vào đúng chỗ
        return i + 1;
    }

    private void swap(int[] arr, int i, int j) {
        int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
}`
            },
            {
              title: '3-way partition (Dutch National Flag) — handle duplicates',
              code: `public void quickSort3Way(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[lo + new Random().nextInt(hi - lo + 1)];
    int lt = lo, gt = hi, i = lo;
    while (i <= gt) {
        if      (arr[i] < pivot) swap(arr, i++, lt++);
        else if (arr[i] > pivot) swap(arr, i, gt--);
        else                       i++;                     // arr[i] == pivot
    }
    // [lo..lt-1] < pivot; [lt..gt] == pivot; [gt+1..hi] > pivot
    quickSort3Way(arr, lo, lt - 1);
    quickSort3Way(arr, gt + 1, hi);
}`
            }
          ],
          socraticPrompts: [
            {
              title: 'Vì sao pivot quan trọng?',
              prompt: `KHÔNG cho code. Hỏi tôi:
1. Vẽ recursion tree cho QuickSort trên mảng đã sort, pivot luôn last. Depth là bao nhiêu?
2. Total work qua mọi level = bao nhiêu? (Hint: n + (n-1) + ...)
3. Tại sao random pivot làm worst case "biến mất" trong thực tế?
4. Adversarial input cho random pivot — có làm worst O(n²) được không?
5. Median-of-three vs random — heuristic nào tốt hơn cho near-sorted data?`
            },
            {
              title: 'Quick Sort vs Merge Sort decision tree',
              prompt: `KHÔNG cho đáp án. Cho mỗi tình huống, hỏi tôi nên chọn cái nào:
1. Sort 1M number trong RAM.
2. Sort 10GB log file trên disk, RAM = 4GB.
3. Sort danh sách Order theo (createdAt, priority) — cần stability.
4. Sort LinkedList<Integer>.
5. Sort mảng [1, 1, 1, 2, 2, 3, 3, ...] với rất nhiều duplicate.
6. Sort trong embedded device với stack hạn chế.
Dẫn tôi qua từng case.`
            }
          ],
          exercises: [
            {
              title: 'Implement Quick Sort with random pivot',
              prompt: 'In-place sort dùng Lomuto partition, random pivot, tail call elimination. Đảm bảo O(log n) stack worst case.',
              hints: [
                'Câu hỏi 1: Random pivot khác gì last-element pivot về worst case?',
                'Câu hỏi 2: Tail call: sau partition, recurse vào nửa NHỎ HƠN trước, vì sao?'
              ],
              solution: {
                code: `public class QuickSorter {
    private final Random rng = new Random();

    public void sort(int[] arr) { quickSort(arr, 0, arr.length - 1); }

    private void quickSort(int[] arr, int lo, int hi) {
        while (lo < hi) {
            int p = partition(arr, lo, hi);
            if (p - lo < hi - p) {
                quickSort(arr, lo, p - 1);   // recurse nửa nhỏ
                lo = p + 1;                    // loop nửa lớn
            } else {
                quickSort(arr, p + 1, hi);
                hi = p - 1;
            }
        }
    }

    private int partition(int[] arr, int lo, int hi) {
        int pivotIdx = lo + rng.nextInt(hi - lo + 1);
        swap(arr, pivotIdx, hi);
        int pivot = arr[hi], i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (arr[j] < pivot) swap(arr, ++i, j);
        }
        swap(arr, ++i, hi);
        return i;
    }

    private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}`,
                lang: 'java',
                complexityVi: 'Time: average O(n log n), worst O(n²) (xác suất gần như 0 với random pivot). Space: O(log n) stack worst case (nhờ tail call vào nửa nhỏ).',
                explanationVi: '<strong>Random pivot</strong>: adversarial input phá being-sorted KHÔNG hiệu quả nữa. <strong>Recurse nửa nhỏ trước, loop nửa lớn</strong>: kể cả worst skewed split, stack depth = O(log n) vì mỗi recursion frame xử lý chính xác 1 nửa nhỏ ≤ n/2 size.'
              }
            },
            {
              title: 'Quickselect — Kth Largest in O(n) average',
              prompt: 'Tìm K-th largest. Heap O(n log k). Quickselect O(n) average bằng partition. Vd: [3,2,1,5,6,4], k=2 → 5.',
              hints: [
                'Câu hỏi 1: Sau 1 lần partition, pivot ở đúng chỗ final. Nếu chỉ số đó = (n - k), pivot CHÍNH LÀ k-th largest. Vì sao?',
                'Câu hỏi 2: Nếu pivotIdx < n-k, recurse vào nửa NÀO? Vì sao chỉ recurse 1 nửa, không cả hai?'
              ],
              solution: {
                code: `public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;   // index nếu sort ASC
    int lo = 0, hi = nums.length - 1;
    Random rng = new Random();
    while (lo <= hi) {
        int p = partition(nums, lo, hi, rng);
        if (p == target) return nums[p];
        if (p < target) lo = p + 1;
        else            hi = p - 1;
    }
    return -1;     // unreachable nếu k valid
}

private int partition(int[] arr, int lo, int hi, Random rng) {
    int pivotIdx = lo + rng.nextInt(hi - lo + 1);
    int tmp = arr[pivotIdx]; arr[pivotIdx] = arr[hi]; arr[hi] = tmp;
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    i++;
    arr[hi] = arr[i]; arr[i] = pivot;
    return i;
}`,
                lang: 'java',
                complexityVi: 'Time: average O(n) — T(n) = T(n/2) + O(n) = O(n) by Master Theorem (a=1, b=2, c=1 → case 3). Worst O(n²) cực hiếm với random pivot. Space O(1) extra.',
                explanationVi: 'Quickselect = Quick Sort nhưng CHỈ recurse vào 1 nửa (nửa chứa target). Vì T(n) = T(n/2) + O(n), không phải 2T(n/2) + O(n) → giảm từ n log n xuống n. Đây là cách <code>nth_element</code> của C++ STL và <code>numpy.partition</code> implement.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Quick Sort: in-place, average O(n log n), cache-friendly — nhanh nhất trong thực tế cho RAM.',
              'PIVOT là tất cả — random hoặc median-of-three để tránh O(n²).',
              'KHÔNG stable. Cho stability dùng Merge Sort hoặc Timsort.',
              '3-way partition (Dutch flag) cho mảng nhiều duplicate.',
              'Quickselect tận dụng partition để find K-th trong O(n) average.',
              'Stack control: recurse nửa NHỎ HƠN trước, loop nửa lớn — đảm bảo O(log n) stack.'
            ]
          }
        },

        // ----- l-1-7-4: Sort selection guide -----
        {
          id: 'l-1-7-4',
          type: 'theory',
          title: 'Sort Selection Guide — When to Use Which',
          mentalModel: {
            vi: `Không có "sort tốt nhất" universal — chỉ có "sort phù hợp nhất cho tình huống". Hỏi 4 câu trước khi chọn:
<ol>
<li>Data trong RAM hay external?</li>
<li>Cần stability không?</li>
<li>Primitive (int[]) hay Object?</li>
<li>Adversarial input có thể không? (vd: user controlled)</li>
</ol>`
          },
          underTheHood: {
            vi: `<h3>Java's built-in sort behavior</h3>
<ul>
<li><code>Arrays.sort(int[])</code> → <strong>Dual-Pivot Quick Sort</strong> (JDK 7+). Fast, in-place, UNSTABLE (primitive không cần stability).</li>
<li><code>Arrays.sort(Object[])</code> → <strong>Timsort</strong> (Merge Sort tối ưu). Stable, O(n log n) worst case, ưu việt với near-sorted data.</li>
<li><code>Collections.sort(list)</code> → Timsort qua <code>Arrays.sort(Object[])</code>.</li>
<li><code>list.sort(Comparator)</code> → Timsort.</li>
<li><code>Arrays.parallelSort()</code> → Parallel Merge Sort qua ForkJoinPool.</li>
</ul>
<h3>Timsort — vì sao chuẩn cho Object?</h3>
Phát hiện "run" (đoạn đã sort sẵn) và merge. Best case O(n) với data đã gần sort. Stable. Worst case O(n log n). Đặt theo Tim Peters từ Python — Java áp dụng cho JDK 7.`
          },
          theory: {
            vi: `<h3>Quyết định nhanh</h3>
<table style="border-collapse:collapse;width:100%">
<tr style="background:#f0f0f0">
<th style="border:1px solid #ccc;padding:6px;text-align:left">Tình huống</th>
<th style="border:1px solid #ccc;padding:6px;text-align:left">Algorithm</th>
</tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sort int[] trong RAM</td><td style="border:1px solid #ccc;padding:6px">Quick Sort (Java built-in)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sort Object[] cần stability</td><td style="border:1px solid #ccc;padding:6px">Timsort (Java built-in)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">External data &gt; RAM</td><td style="border:1px solid #ccc;padding:6px">Merge Sort (k-way merge từ disk)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Sort LinkedList</td><td style="border:1px solid #ccc;padding:6px">Merge Sort (split bằng slow/fast)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Top K elements</td><td style="border:1px solid #ccc;padding:6px">Heap (PriorityQueue size K)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">K-th element</td><td style="border:1px solid #ccc;padding:6px">Quickselect (O(n) average)</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Adversarial input có thể</td><td style="border:1px solid #ccc;padding:6px">Merge Sort (guaranteed O(n log n))</td></tr>
<tr><td style="border:1px solid #ccc;padding:6px">Range int hẹp (0..1000)</td><td style="border:1px solid #ccc;padding:6px">Counting Sort O(n+k)</td></tr>
</table>

<h3>The "Why" — Tại sao học cả 2 sort dù Java built-in?</h3>
<ul>
  <li><strong>Hiểu để chọn đúng</strong> — biết khi nào built-in chậm.</li>
  <li><strong>Interview</strong> — implementation và partition technique áp dụng cho Quickselect, K-th element, top K, ...</li>
  <li><strong>Custom data structure</strong> (sort linked list, sort theo nhiều criteria phức tạp) — đôi khi tự viết tốt hơn.</li>
</ul>`
          },
          keyTakeaways: {
            vi: [
              'Java built-in: Quick Sort cho int[], Timsort cho Object[].',
              'Cần stability → Timsort. Cần in-place → Quick Sort.',
              'External / linked list → Merge Sort.',
              'Top K → Heap. K-th → Quickselect.',
              'KHÔNG học vẹt — hiểu cấu trúc để áp dụng partition/merge cho bài khác.'
            ]
          }
        }

      ]
    }

  ]
}
