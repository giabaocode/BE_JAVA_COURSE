// ============================================================================
//  PHASE 1 — Module 1.1: OOP Pillars (Encapsulation, Inheritance, Polymorphism, Abstraction)
// ============================================================================

export default
    {
      id: 'mod-1-1',
      title: 'OOP Pillars — Encapsulation, Inheritance, Polymorphism, Abstraction',
  prerequisites: { vi: 'Hoàn thành <strong>Phase 0</strong>. Đã viết được class đơn giản, hiểu method/field.' },
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
Khi viết <code>Product p = new Product("X")</code>: biến <code>p</code> nằm Stack, object Product nằm Heap, <code>p</code> chỉ là <strong>handle</strong> (kiểu con trỏ đã được JVM quản lý). Đây là lý do <code>p2 = p</code> KHÔNG copy object — chỉ copy handle. Hai biến cùng trỏ tới một object trong heap.
<br/><br/>
<em>⚠️ Đây là <strong>mô hình tư duy để học</strong>, đúng trong đa số trường hợp. Thực tế JVM + trình biên dịch JIT tối ưu tinh vi hơn: kỹ thuật <strong>escape analysis</strong> có thể cấp phát một số object ngay trên stack (không vào heap) nếu chứng minh được object không "thoát" khỏi method. Cứ nắm mô hình này trước, chi tiết tối ưu học sau.</em>`
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
Stack cực nhanh (chỉ +/- stack pointer). Heap chậm hơn vì phải tìm chỗ trống và đôi khi trigger GC. Đó là lý do biến <strong>local</strong> kiểu primitive (<code>int</code>, <code>long</code>) nằm trên Stack — không cần wrapper. <em>(Chính xác hơn: primitive là <strong>field của một object</strong> thì nằm CÙNG object đó trên Heap, không phải Stack. "Primitive ở Stack" chỉ đúng với biến local.)</em>
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
  <li><strong>Lombok <code>@Data</code> trên JPA entity</strong> → sinh equals/hashCode/toString dùng MỌI field, kể cả lazy collection → LazyInitializationException khi toString(). <em>(Lombok = thư viện tự sinh getter/setter; JPA = ánh xạ object↔bảng DB — cả hai học kỹ ở Phase 3. Giờ chỉ cần nhớ: cẩn thận khi auto-sinh equals/hashCode.)</em></li>
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
                code: `// SNIPPET minh họa composition — Wheel/Chassis/wheels/chassis là class/biến giả định,
// thân hàm để trống (/* ... */) cho gọn. KHÔNG copy chạy trực tiếp; trọng tâm là CẤU TRÚC.
// Interface Engine — dễ swap/mock
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
                explanationVi: '<strong>Lợi ích 1</strong>: Thêm HybridCar = tạo HybridEngine impl Engine, KHÔNG đụng Car. <strong>Lợi ích 2</strong>: Unit test Car với MockEngine (Mockito) cực dễ; inheritance phải spin up cả hierarchy. <em>(Mockito = thư viện tạo "object giả" để test — học ở Phase 3; ý chính ở đây: composition dễ test hơn inheritance.)</em> <strong>Lợi ích 3</strong>: Một Car có thể có nhiều Engine (hybrid) — inheritance không cho.'
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
                code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Book implements Comparable<Book> {
    private final String title;
    private final int year;
    private final double rating;

    public Book(String title, int year, double rating) {
        this.title = title; this.year = year; this.rating = rating;
    }

    @Override public int compareTo(Book other) {
        return this.title.compareTo(other.title);    // natural order = alphabet
    }

    public String getTitle()  { return title; }
    public int    getYear()   { return year; }
    public double getRating() { return rating; }

    public static void main(String[] args) {
        List<Book> books = new ArrayList<>(List.of(
            new Book("Clean Code",     2008, 4.5),
            new Book("Effective Java", 2018, 4.8),
            new Book("Refactoring",    2018, 4.6)
        ));
        // Sort: year DESC, tie-break rating DESC, rồi title ASC
        books.sort(
            Comparator.comparingInt(Book::getYear).reversed()          // an toàn, không overflow
                .thenComparing(Comparator.comparingDouble(Book::getRating).reversed())
                .thenComparing(Book::getTitle)                          // natural order (cần getTitle())
        );
        books.forEach(b -> System.out.println(b.getYear() + " - " + b.getTitle()));
        // In ra: 2018 - Effective Java / 2018 - Refactoring / 2008 - Clean Code
    }
}`,
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
      ],
  references: [
    { title: 'Java OOP Concepts tutorial', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
    { title: 'JEP 395 -Records', url: 'https://openjdk.org/jeps/395' },
    { title: 'JEP 360 -Sealed Classes', url: 'https://openjdk.org/jeps/360' },
    { title: 'Effective Java (Joshua Bloch) -overview', url: 'https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/' }
  ]

    }
