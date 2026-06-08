// ============================================================================
//  PHASE 1 — Module 1.9: Java Core Essentials (Exception · Lambda · Stream · Concurrency)
//  Lấp 4 công cụ Java mà các module trước ĐÃ DÙNG trong solution nhưng chưa DẠY.
//  Đây là prerequisite mềm cho Phase 2 (stream/lambda trong solution) và Phase 3 (async).
// ============================================================================

export default
    {
      id: 'mod-1-9',
      title: 'Java Core Essentials — Exception, Lambda, Stream & Concurrency',
  prerequisites: { vi: 'Hoàn thành <strong>Module 1.1</strong> (class, interface, OOP). 📌 <strong>Lưu ý:</strong> các module 1.5–1.8 và Phase 2 đã dùng <code>stream()</code>, lambda, <code>Comparator.comparing()</code> trong phần solution. Nếu bạn thấy lạ khi gặp chúng, học module này TRƯỚC rồi quay lại — đây là chỗ giải thích tường tận.' },
      lessons: [

        // ----- l-1-9-1: Exception Handling -----
        {
          id: 'l-1-9-1',
          type: 'theory',
          title: 'Exception Handling — Checked vs Unchecked, try/catch/finally',
          subtitle: { en: 'Failing loudly and recovering safely.', vi: 'Khi nào "bắt", khi nào "ném", khi nào để chương trình chết.' },
          mentalModel: {
            vi: `Hình dung exception như <strong>chuông báo cháy</strong>: khi một method gặp tình huống nó KHÔNG tự xử được, nó "ném" (throw) một object lỗi lên trên. Object đó <strong>nhảy ngược</strong> theo chuỗi gọi method (call stack) cho tới khi gặp một <code>catch</code> phù hợp. Không ai bắt → chương trình dừng và in stack trace.
<br/><br/>
<strong>2 nhánh lớn</strong> (đều kế thừa <code>Throwable</code>):
<ul>
  <li><code>Error</code> — JVM hỏng nặng (<code>OutOfMemoryError</code>, <code>StackOverflowError</code>). <strong>KHÔNG bắt</strong> — bạn không sửa được.</li>
  <li><code>Exception</code> — lỗi chương trình. Chia tiếp:
    <ul>
      <li><strong>Checked</strong> (<code>IOException</code>, <code>SQLException</code>): compiler BẮT BUỘC bạn xử lý (try/catch hoặc <code>throws</code>). "Lỗi có thể lường trước, người gọi nên biết."</li>
      <li><strong>Unchecked</strong> (<code>RuntimeException</code> và con: <code>NullPointerException</code>, <code>IllegalArgumentException</code>): compiler KHÔNG ép. "Lỗi do bug lập trình, sửa code chứ không catch."</li>
    </ul>
  </li>
</ul>`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Stack unwinding tốn gì?</strong>
Khi throw, JVM phải "tháo" từng stack frame, chạy mọi block <code>finally</code> trên đường đi, và <strong>chụp lại toàn bộ stack trace</strong> (tốn nhất). Vì thế: <em>KHÔNG dùng exception cho control flow bình thường</em> (vd dùng exception để thoát vòng lặp) — chậm hơn <code>if</code> hàng chục lần.
<br/><br/>
<strong>2) Vì sao checked exception gây tranh cãi?</strong>
Checked exception ép caller xử lý → an toàn, nhưng dễ bị lạm dụng thành <code>catch (Exception e) {}</code> (nuốt lỗi). Nhiều framework hiện đại (Spring) chuyển hết sang unchecked (<code>DataAccessException</code>) để code gọn. Bạn vẫn phải HIỂU checked vì JDK core (IO, SQL) dùng nó.
<br/><br/>
<strong>3) try-with-resources làm gì dưới mui?</strong>
<code>try (var x = ...)</code> tự sinh code gọi <code>x.close()</code> trong một <code>finally</code> ẩn — kể cả khi có exception. Compiler còn xử lý "suppressed exception" (nếu cả body lẫn close() đều ném). Đây là lý do bạn KHÔNG bao giờ phải tự viết <code>finally { conn.close(); }</code> nữa.
<br/><br/>
<strong>4) Exception chaining giữ "nguyên nhân gốc"</strong>
<code>throw new ServiceException("Không tạo được order", e)</code> — tham số thứ 2 là <code>cause</code>. Stack trace sẽ in "Caused by: ..." → bạn thấy cả lỗi nghiệp vụ LẪN lỗi gốc (SQL timeout). Mất cause = mất manh mối debug.`
          },
          theory: {
            vi: `<h3>Cú pháp & quy tắc dùng</h3>
<ul>
  <li><strong>try / catch / finally</strong>: <code>finally</code> LUÔN chạy (kể cả return trong try) — dùng để dọn tài nguyên. Nhưng ưu tiên try-with-resources thay finally thủ công.</li>
  <li><strong>Multi-catch</strong>: <code>catch (IOException | SQLException e)</code> — gộp khi xử lý giống nhau.</li>
  <li><strong>Bắt từ cụ thể → tổng quát</strong>: catch <code>FileNotFoundException</code> trước <code>IOException</code>. Ngược lại → compile error (unreachable).</li>
  <li><strong>Custom exception</strong>: tạo class kế thừa <code>RuntimeException</code> (unchecked) cho lỗi nghiệp vụ — vd <code>OrderNotFoundException</code>. Đặt tên rõ nghĩa.</li>
</ul>

<h3>The "Why" — Vì sao không "nuốt" exception?</h3>
<code>catch (Exception e) {}</code> (block rỗng) là tội ác số 1 với người mới: lỗi xảy ra nhưng KHÔNG ai biết → bug câm, đến production mới lộ, không có log để truy. Tối thiểu: log kèm context. Tốt hơn: bọc lại bằng exception nghĩa rõ + ném tiếp.

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Nuốt lỗi</strong>: <code>catch (Exception e) {}</code> hoặc chỉ <code>e.printStackTrace()</code> trong server thật (lẫn vào stdout, không structured). Dùng logger.</li>
  <li><strong>Catch quá rộng</strong>: <code>catch (Exception e)</code> nuốt cả <code>NullPointerException</code> bạn cần thấy. Bắt đúng loại bạn xử lý được.</li>
  <li><strong>Mất cause</strong>: <code>throw new MyException("msg")</code> mà quên truyền <code>e</code> → không còn "Caused by".</li>
  <li><strong>Đóng resource thủ công sai</strong>: <code>conn.close()</code> trong try thay vì finally/try-with-resources → exception giữa chừng = rò connection.</li>
  <li><strong>Dùng exception làm control flow</strong>: throw để thoát loop. Chậm và khó đọc.</li>
  <li><strong>return trong finally</strong>: nuốt mất exception đang bay + ghi đè giá trị return. Đừng bao giờ.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'try-with-resources + exception chaining + custom exception',
              code: `// Custom exception nghiệp vụ — unchecked cho gọn (theo style Spring)
public class OrderImportException extends RuntimeException {
    public OrderImportException(String message, Throwable cause) {
        super(message, cause);   // GIỮ cause để có "Caused by:"
    }
}

public class OrderImporter {
    private static final Logger log = LoggerFactory.getLogger(OrderImporter.class);

    public int importFrom(Path csv) {
        // try-with-resources: reader tự đóng kể cả khi lỗi
        try (BufferedReader reader = Files.newBufferedReader(csv)) {
            int count = 0;
            String line;
            while ((line = reader.readLine()) != null) {
                count += parseAndSave(line);   // có thể ném IllegalArgumentException
            }
            return count;
        } catch (IOException e) {
            // Bọc lỗi IO thành lỗi nghiệp vụ, GIỮ cause, ném tiếp cho tầng trên
            throw new OrderImportException("Không đọc được file: " + csv, e);
        }
        // KHÔNG cần finally { reader.close() } — try-with-resources lo rồi
    }
}`,
              lang: 'java',
              description: 'Mẫu chuẩn doanh nghiệp: resource tự đóng, lỗi được bọc lại có ngữ cảnh, cause được giữ.'
            }
          ],
          socraticPrompts: [
            {
              title: 'Thiết kế chiến lược exception cho 1 service',
              prompt: `Tôi đang viết UserService có method register(email, password). KHÔNG viết code hộ. Hỏi tôi:
1. "Email đã tồn tại" nên là checked hay unchecked exception? Vì sao?
2. Lỗi DB timeout — tôi nên catch ở tầng service hay để nó bay lên controller? Ai mới biết cách trả lỗi cho client?
3. Nếu tôi catch DB exception rồi throw lại exception nghiệp vụ, tôi PHẢI làm gì để không mất manh mối debug?
4. Khi nào dùng finally, khi nào try-with-resources?
5. Nuốt exception (catch rỗng) gây hậu quả gì ở production?`
            }
          ],
          exercises: [
            {
              title: 'Phân loại checked vs unchecked',
              prompt: 'Cho 5 tình huống: (a) file không tồn tại, (b) chia cho 0, (c) parse "abc" thành int, (d) gọi method trên biến null, (e) kết nối DB thất bại. Tên exception nào? Checked hay unchecked? Bạn xử lý từng cái ra sao?',
              hints: [
                'Câu hỏi 1: Lỗi nào do "bug code của tôi" (sửa code là hết) → thường unchecked. Lỗi nào do "môi trường ngoài" (file, mạng, DB) → thường checked?',
                'Câu hỏi 2: NullPointerException và ArithmeticException và NumberFormatException — chúng có chung cha nào không?'
              ],
              solution: {
                code: `// (a) FileNotFoundException  — CHECKED   (con của IOException). Catch + báo user.
// (b) ArithmeticException    — UNCHECKED (/ by zero). Validate trước: if (b == 0) ...
// (c) NumberFormatException  — UNCHECKED (con RuntimeException). Validate input.
// (d) NullPointerException   — UNCHECKED. Sửa code: null-check / Optional.
// (e) SQLException           — CHECKED. Catch + bọc thành exception nghiệp vụ.

// Quy tắc: con của RuntimeException = unchecked = "bug lập trình, sửa code".
//          còn lại (con Exception trực tiếp) = checked = "lỗi lường trước, phải xử lý".`,
                lang: 'java',
                complexityVi: 'N/A — bài phân loại khái niệm.',
                explanationVi: 'b, c, d là <code>RuntimeException</code> → unchecked → nên PHÒNG bằng validate, không phải catch. a, e là checked → compiler ép xử lý vì là lỗi ngoài tầm kiểm soát code (file/mạng/DB). Mẹo nhớ: "Runtime = lỗi runtime của LẬP TRÌNH VIÊN, đừng catch — hãy sửa".'
              }
            },
            {
              title: 'Sửa code nuốt lỗi',
              prompt: 'Cho method đọc config: <code>try { return Integer.parseInt(read("port")); } catch (Exception e) { return 8080; }</code>. Chỉ ra 2 vấn đề và viết lại đúng.',
              hints: [
                'Câu hỏi 1: catch (Exception) có nuốt luôn cả lỗi bạn KHÔNG ngờ tới (vd read() ném NPE vì config null) không?',
                'Câu hỏi 2: Khi rơi về 8080, có ai biết là "config sai" hay "không có config"? Log ở đâu?'
              ],
              solution: {
                code: `private static final Logger log = LoggerFactory.getLogger(Config.class);

public int readPort() {
    String raw = read("port");
    if (raw == null || raw.isBlank()) {
        log.info("Không có config 'port', dùng mặc định 8080");
        return 8080;
    }
    try {
        return Integer.parseInt(raw.trim());
    } catch (NumberFormatException e) {          // bắt ĐÚNG loại, không nuốt tất
        log.warn("Config 'port' không hợp lệ: '{}', dùng 8080", raw, e);
        return 8080;
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(1).',
                explanationVi: 'Hai lỗi gốc: (1) <code>catch (Exception)</code> quá rộng — nuốt cả NPE/lỗi lạ; (2) không log → "8080" xuất hiện bí ẩn, không ai biết config hỏng. Sửa: tách trường hợp null (bình thường, log info) khỏi trường hợp parse fail (bất thường, log warn KÈM exception). Bắt đúng <code>NumberFormatException</code>.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Checked (IOException, SQLException) = compiler ép xử lý = lỗi ngoài tầm kiểm soát. Unchecked (RuntimeException) = bug code = nên phòng bằng validate.',
              'try-with-resources thay cho finally{ close() } — tự đóng resource, an toàn với exception.',
              'Bọc lỗi thì PHẢI giữ cause: <code>new MyException(msg, e)</code> → có "Caused by" để debug.',
              'KHÔNG nuốt exception (catch rỗng), KHÔNG catch quá rộng, KHÔNG dùng exception cho control flow.',
              'Error (OutOfMemory, StackOverflow) — đừng bắt, bạn không sửa được.'
            ]
          }
        },

        // ----- l-1-9-2: Lambda & Functional Interfaces -----
        {
          id: 'l-1-9-2',
          type: 'theory',
          title: 'Lambda & Functional Interfaces — Code như một giá trị',
          subtitle: { en: 'Passing behavior, not just data.', vi: 'Truyền "hành vi" vào method như truyền một con số.' },
          mentalModel: {
            vi: `Trước Java 8, muốn truyền "một đoạn hành vi" (vd: cách so sánh 2 object) bạn phải viết cả một class hoặc anonymous class dài dòng. <strong>Lambda</strong> là cú pháp ngắn để viết hành vi đó như một biểu thức.
<br/><br/>
Chìa khóa: lambda KHÔNG phải phép màu — nó chỉ là cách viết gọn của một <strong>functional interface</strong> (interface có ĐÚNG 1 abstract method). Compiler nhìn vào kiểu mong đợi, suy ra interface nào, rồi biến lambda thành implementation của method duy nhất đó.
<br/><br/>
<pre>// Cũ — anonymous class (8 dòng)
Comparator&lt;String&gt; byLen = new Comparator&lt;&gt;() {
    public int compare(String a, String b) { return a.length() - b.length(); }
};
// Mới — lambda (1 dòng), cùng ý nghĩa
Comparator&lt;String&gt; byLen = (a, b) -&gt; a.length() - b.length();
// Gọn hơn nữa — method reference
Comparator&lt;String&gt; byLen = Comparator.comparingInt(String::length);</pre>`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Lambda KHÔNG phải anonymous class.</strong>
Anonymous class sinh ra một file <code>.class</code> riêng (Outer$1.class) và một object mới mỗi lần. Lambda dùng bytecode <code>invokedynamic</code> + <code>LambdaMetafactory</code> — JVM sinh implementation lúc runtime, có thể tái dùng instance (lambda không capture biến → singleton). Nhẹ hơn về số class và bộ nhớ.
<br/><br/>
<strong>2) "Effectively final" — vì sao?</strong>
Lambda chỉ capture được biến local <strong>không đổi giá trị</strong> (effectively final). Lý do: biến local nằm trên stack, mà lambda có thể sống lâu hơn method (vd lưu vào field, chạy ở thread khác). JVM copy giá trị biến vào lambda — nếu cho phép biến đổi sau đó thì bản copy và bản gốc lệch nhau → bug. Nên Java cấm luôn.
<br/><br/>
<strong>3) Functional interface & <code>@FunctionalInterface</code></strong>
Annotation này không bắt buộc nhưng nên có: compiler sẽ báo lỗi nếu interface lỡ có 2 abstract method. <code>default</code> method và <code>static</code> method KHÔNG tính (vì có thân hàm). Đó là lý do <code>Comparator</code> có hàng chục default method (<code>reversed()</code>, <code>thenComparing()</code>) mà vẫn là functional interface.
<br/><br/>
<strong>4) Method reference = lambda viết tắt</strong>
<code>String::length</code> ⇔ <code>s -> s.length()</code>. 4 dạng: static (<code>Integer::parseInt</code>), instance của object cụ thể (<code>System.out::println</code>), instance của tham số (<code>String::length</code>), constructor (<code>ArrayList::new</code>).`
          },
          theory: {
            vi: `<h3>Bộ functional interface có sẵn (java.util.function) — học thuộc 4 cái này</h3>
<ul>
  <li><code>Function&lt;T,R&gt;</code> — nhận T, trả R. <code>r = f.apply(t)</code>. VD: biến User → email.</li>
  <li><code>Predicate&lt;T&gt;</code> — nhận T, trả boolean. <code>p.test(t)</code>. VD: lọc "active".</li>
  <li><code>Consumer&lt;T&gt;</code> — nhận T, không trả gì. <code>c.accept(t)</code>. VD: in, lưu.</li>
  <li><code>Supplier&lt;T&gt;</code> — không nhận, trả T. <code>s.get()</code>. VD: tạo giá trị mặc định lazy.</li>
</ul>
Phụ: <code>BiFunction&lt;T,U,R&gt;</code>, <code>UnaryOperator&lt;T&gt;</code> (Function cùng kiểu), <code>BinaryOperator&lt;T&gt;</code>, <code>Comparator&lt;T&gt;</code>.

<h3>The "Why" — Lambda giải quyết vấn đề gì?</h3>
Tách <strong>"làm gì"</strong> khỏi <strong>"làm thế nào"</strong>. <code>list.sort(by)</code> lo việc sort; bạn chỉ truyền "tiêu chí so sánh". Đây là nền của Stream API (lesson sau) và của callback/strategy pattern gọn gàng.

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Cố sửa biến capture</strong>: <code>int sum=0; list.forEach(x -> sum += x);</code> → compile error (sum không effectively final). Dùng stream <code>.sum()</code> hoặc mảng 1 phần tử (xấu).</li>
  <li><strong>Lambda quá dài</strong>: lambda 20 dòng → tách thành method riêng rồi dùng method reference. Lambda nên là biểu thức ngắn.</li>
  <li><strong><code>this</code> trong lambda</strong> trỏ tới enclosing object (khác anonymous class — trỏ tới chính nó). Dễ nhầm.</li>
  <li><strong>NPE trong method reference</strong>: <code>user::getName</code> khi <code>user == null</code> → NPE ngay lúc tạo reference.</li>
  <li><strong>Lạm dụng</strong>: không phải chỗ nào cũng cần lambda. Vòng lặp đơn giản đôi khi dễ đọc hơn.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Bốn functional interface trong một ví dụ thật',
              code: `import java.util.function.*;
import java.util.*;

record User(String name, String email, boolean active) {}

public class FunctionalDemo {
    public static void main(String[] args) {
        List<User> users = List.of(
            new User("An",  "an@x.com",  true),
            new User("Binh","binh@x.com", false),
            new User("Chi", "chi@x.com",  true)
        );

        Predicate<User> isActive   = User::active;              // T -> boolean
        Function<User, String> email = User::email;             // T -> R
        Consumer<String> print      = System.out::println;      // T -> void
        Supplier<User> guest        = () -> new User("guest", "-", false); // () -> T

        // Ghép lại: lọc active → lấy email → in
        for (User u : users) {
            if (isActive.test(u)) {
                print.accept(email.apply(u));   // in: an@x.com, chi@x.com
            }
        }

        // Comparator bằng method reference + default method
        List<User> sorted = new ArrayList<>(users);
        sorted.sort(Comparator.comparing(User::name).reversed());
    }
}`,
              lang: 'java',
              description: 'Predicate/Function/Consumer/Supplier dùng chung; Comparator.comparing + reversed() minh hoạ default method.'
            }
          ],
          socraticPrompts: [
            {
              title: 'Khi nào lambda, khi nào không',
              prompt: `KHÔNG viết code hộ. Hỏi tôi:
1. Tôi cần truyền "cách tính giảm giá" khác nhau cho từng loại khách. Lambda (Function) hợp hơn hay tạo nhiều class? Trade-off?
2. "Effectively final" nghĩa là gì? Vì sao lambda không cho tôi sửa biến local bên ngoài?
3. <code>String::length</code> tương đương lambda nào? Bốn loại method reference là gì?
4. Khi lambda dài 15 dòng, tôi nên làm gì để code dễ đọc?
5. Functional interface là gì? Vì sao Comparator có nhiều method mà vẫn là functional interface?`
            }
          ],
          exercises: [
            {
              title: 'Tự định nghĩa functional interface',
              prompt: 'Định nghĩa functional interface <code>Discount</code> nhận <code>long priceCents</code> trả <code>long</code> (giá sau giảm). Tạo 2 lambda: giảm 10%, và giảm cố định 50k. Viết method áp dụng discount lên một giá.',
              hints: [
                'Câu hỏi 1: Functional interface cần mấy abstract method? Đặt @FunctionalInterface để compiler kiểm tra giúp.',
                'Câu hỏi 2: "giảm 10%" và "trừ 50k" có cùng chữ ký (long -> long) không? Nếu có thì cùng kiểu Discount.'
              ],
              solution: {
                code: `@FunctionalInterface
interface Discount {
    long apply(long priceCents);          // đúng 1 abstract method
}

public class Shop {
    static long checkout(long priceCents, Discount d) {
        return d.apply(priceCents);
    }

    public static void main(String[] args) {
        Discount tenPercent = p -> p - p / 10;          // giảm 10%
        Discount flat50k    = p -> Math.max(0, p - 5_000_000L); // trừ 50k (cents), không âm

        System.out.println(checkout(20_000_000L, tenPercent)); // 18_000_000
        System.out.println(checkout(20_000_000L, flat50k));    // 15_000_000
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(1) mỗi lần apply.',
                explanationVi: 'Cả 2 chiến lược giảm giá có CÙNG chữ ký <code>long -> long</code> nên cùng kiểu <code>Discount</code> — đó là sức mạnh của functional interface: hành vi khác nhau, cùng "khuôn". <code>checkout()</code> không cần biết công thức, chỉ gọi <code>d.apply()</code> (Strategy pattern viết gọn). Lưu ý <code>Math.max(0, ...)</code> để giá không âm.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Lambda = cách viết gọn của một functional interface (interface có ĐÚNG 1 abstract method).',
              'Lambda chỉ capture biến "effectively final" (không đổi giá trị sau khi gán) — vì biến local nằm trên stack.',
              'Thuộc 4 interface gốc: Function (T→R), Predicate (T→boolean), Consumer (T→void), Supplier (()→T).',
              'Method reference (<code>String::length</code>) = lambda viết tắt; có 4 dạng (static, bound, unbound, constructor).',
              'Lambda dài → tách method + dùng method reference. Đừng lạm dụng cho mọi vòng lặp.'
            ]
          }
        },

        // ----- l-1-9-3: Stream API -----
        {
          id: 'l-1-9-3',
          type: 'theory',
          title: 'Stream API — Pipeline xử lý dữ liệu khai báo',
          subtitle: { en: 'Describe what, not how.', vi: 'Mô tả KẾT QUẢ muốn có, không viết vòng lặp từng bước.' },
          mentalModel: {
            vi: `Stream như một <strong>dây chuyền nhà máy</strong>: dữ liệu (collection) đi vào một đầu, qua các trạm xử lý (lọc, biến đổi), ra đầu kia thành kết quả. Bạn mô tả CÁC TRẠM, không quản từng vòng lặp.
<br/><br/>
Một pipeline luôn có 3 phần:
<ol>
  <li><strong>Source</strong>: <code>list.stream()</code>, <code>Arrays.stream(arr)</code>, <code>IntStream.range(0,n)</code>.</li>
  <li><strong>Intermediate</strong> (0..n trạm, trả Stream, LAZY): <code>filter</code>, <code>map</code>, <code>sorted</code>, <code>distinct</code>, <code>limit</code>, <code>flatMap</code>.</li>
  <li><strong>Terminal</strong> (đúng 1, kích hoạt chạy): <code>collect</code>, <code>forEach</code>, <code>count</code>, <code>reduce</code>, <code>findFirst</code>, <code>anyMatch</code>.</li>
</ol>
<pre>List&lt;String&gt; emails = users.stream()   // source
    .filter(User::active)               // intermediate (lazy)
    .map(User::email)                   // intermediate (lazy)
    .sorted()                           // intermediate (lazy)
    .toList();                          // terminal → CHẠY</pre>`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Lazy evaluation — vì sao quan trọng?</strong>
Các trạm intermediate KHÔNG chạy ngay. Stream chỉ "ghi nhận" chúng. Khi gặp terminal, JVM mới chạy — và chạy <strong>theo từng phần tử</strong> qua hết pipeline, KHÔNG tạo list trung gian sau mỗi bước. Nhờ đó <code>.filter(...).findFirst()</code> dừng ngay khi tìm thấy phần tử đầu (short-circuit) — không duyệt hết.
<br/><br/>
<strong>2) Stream KHÔNG lưu dữ liệu & dùng MỘT LẦN.</strong>
Stream không phải collection — nó không giữ phần tử, chỉ là "kế hoạch xử lý". Đã gọi terminal thì stream "đóng" — gọi lại ném <code>IllegalStateException: stream has already been operated upon</code>. Mỗi lần xử lý phải tạo stream mới.
<br/><br/>
<strong>3) Collectors — vì sao mạnh?</strong>
<code>collect()</code> nhận một <code>Collector</code> mô tả cách "gom" kết quả. <code>groupingBy</code> trả <code>Map</code>, <code>joining</code> nối chuỗi, <code>counting</code>, <code>summingLong</code>, <code>partitioningBy</code>. Có thể lồng nhau: nhóm theo X rồi đếm mỗi nhóm.
<br/><br/>
<strong>4) Stream vs for-loop về hiệu năng</strong>
Với dữ liệu nhỏ/vừa, khác biệt không đáng kể; stream dễ đọc hơn. For-loop có thể nhanh hơn chút (không tạo object lambda/pipeline). <code>parallelStream()</code> chia việc ra nhiều core — nhưng CHỈ lợi khi: dữ liệu lớn + thao tác nặng + KHÔNG có shared mutable state. Lạm dụng parallel = chậm hơn + bug race condition.`
          },
          theory: {
            vi: `<h3>Các thao tác hay dùng nhất</h3>
<ul>
  <li><code>filter(predicate)</code> — giữ phần tử thoả điều kiện.</li>
  <li><code>map(function)</code> — biến đổi từng phần tử (User → email).</li>
  <li><code>flatMap</code> — "làm phẳng" Stream của List thành Stream phẳng (vd: List&lt;Order&gt; → tất cả OrderItem).</li>
  <li><code>reduce</code> — gộp về 1 giá trị (tổng, max). Thường <code>mapToLong(...).sum()</code> rõ hơn.</li>
  <li><code>collect(Collectors.*)</code> — gom: <code>toList()</code>, <code>groupingBy()</code>, <code>joining(", ")</code>, <code>toMap()</code>.</li>
  <li><code>anyMatch / allMatch / count / findFirst</code> — short-circuit, dừng sớm.</li>
</ul>

<h3>The "Why" — Khai báo vs mệnh lệnh</h3>
For-loop = "mệnh lệnh" (đi từng bước: tạo list, lặp, if, add). Stream = "khai báo" (nói KẾT QUẢ: "active emails đã sort"). Code khai báo ngắn, ít biến trung gian, ít chỗ sai off-by-one. Nhưng debug khó hơn (không đặt breakpoint giữa pipeline dễ như loop).

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Tái dùng stream</strong>: gán <code>var s = list.stream()</code> rồi gọi 2 terminal → IllegalStateException.</li>
  <li><strong>Side effect trong map/filter</strong>: sửa biến ngoài, gọi API, lưu DB trong <code>.map()</code> → khó debug, sai với parallel. map/filter phải "thuần" (chỉ tính toán).</li>
  <li><strong>Lạm dụng parallelStream</strong>: với list nhỏ → chậm hơn vì overhead chia việc; với shared mutable → race.</li>
  <li><strong>toMap với key trùng</strong> → <code>IllegalStateException: Duplicate key</code>. Phải truyền merge function.</li>
  <li><strong>forEach để build list</strong>: <code>stream().forEach(list::add)</code> → dùng <code>.toList()</code>/collect thay vì side effect.</li>
  <li><strong>NPE khi map ra null</strong> rồi thao tác tiếp. Lọc null hoặc dùng Optional.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Pipeline thật: thống kê doanh thu theo khách',
              code: `import java.util.*;
import java.util.stream.*;

record Order(String customer, long amountCents, String status) {}

public class RevenueReport {
    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("An",  500_000_000L, "PAID"),
            new Order("An",  200_000_000L, "PAID"),
            new Order("Binh",300_000_000L, "CANCELLED"),
            new Order("Chi", 100_000_000L, "PAID")
        );

        // Tổng doanh thu các đơn PAID, nhóm theo khách hàng
        Map<String, Long> revenueByCustomer = orders.stream()
            .filter(o -> o.status().equals("PAID"))          // chỉ đơn đã trả
            .collect(Collectors.groupingBy(
                Order::customer,                              // key: tên khách
                Collectors.summingLong(Order::amountCents))); // value: tổng tiền

        // { An=700000000, Chi=100000000 }   (Binh bị loại vì CANCELLED)
        System.out.println(revenueByCustomer);

        // Tổng toàn bộ doanh thu PAID
        long total = orders.stream()
            .filter(o -> o.status().equals("PAID"))
            .mapToLong(Order::amountCents)
            .sum();                                           // 800000000

        // Có khách nào chi > 5 triệu không? (short-circuit, dừng sớm)
        boolean hasWhale = orders.stream()
            .anyMatch(o -> o.amountCents() > 500_000_000L);
    }
}`,
              lang: 'java',
              description: 'groupingBy + summingLong cho báo cáo; mapToLong().sum() cho tổng; anyMatch short-circuit.'
            }
          ],
          socraticPrompts: [
            {
              title: 'Chuyển for-loop sang stream (và ngược lại)',
              prompt: `KHÔNG viết code hộ. Hỏi tôi:
1. Pipeline của tôi có 1 source, mấy intermediate, mấy terminal? Trạm nào lazy?
2. Vì sao stream chỉ chạy khi gặp terminal? "Short-circuit" giúp gì cho findFirst/anyMatch?
3. Tôi muốn nhóm order theo status rồi đếm mỗi nhóm — Collector nào? Lồng nhau ra sao?
4. Khi nào tôi KHÔNG nên dùng stream (debug khó, side effect, vòng lặp đơn giản)?
5. parallelStream lợi và hại gì? Điều kiện để nó thực sự nhanh hơn?`
            }
          ],
          exercises: [
            {
              title: 'Top-3 sản phẩm bán chạy',
              prompt: 'Cho <code>List&lt;Order&gt;</code> (mỗi order có <code>product</code> và <code>qty</code>). Trả về tên 3 sản phẩm có TỔNG qty cao nhất, giảm dần. Dùng stream.',
              hints: [
                'Câu hỏi 1: Bước 1 nhóm theo product và cộng qty — Collector nào trả Map<String,Integer>?',
                'Câu hỏi 2: Có Map rồi, làm sao sort theo value giảm dần và lấy 3 key đầu? stream trên entrySet().'
              ],
              solution: {
                code: `import java.util.*;
import java.util.stream.*;

record Order(String product, int qty) {}

public class TopProducts {
    static List<String> top3(List<Order> orders) {
        return orders.stream()
            .collect(Collectors.groupingBy(            // gom tổng qty theo product
                Order::product,
                Collectors.summingInt(Order::qty)))
            .entrySet().stream()                       // stream MỚI trên Map
            .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
            .limit(3)                                  // lấy 3 đầu (short-circuit sort+limit)
            .map(Map.Entry::getKey)
            .toList();
    }
}`,
                lang: 'java',
                complexityVi: 'Time O(n + k log k) với n = số order, k = số product phân biệt (sort các nhóm). Space O(k).',
                explanationVi: 'Hai pipeline nối tiếp: (1) <code>groupingBy + summingInt</code> tạo Map product→tổng qty; (2) tạo <strong>stream MỚI</strong> trên <code>entrySet()</code>, sort theo value giảm dần bằng <code>Map.Entry.comparingByValue().reversed()</code>, <code>limit(3)</code>, rồi <code>map</code> lấy tên. Lưu ý phải tạo stream mới ở bước 2 vì stream bước 1 đã đóng sau <code>collect()</code>.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Pipeline = source → intermediate (lazy, trả Stream) → terminal (chạy, đúng 1 cái).',
              'Stream LAZY + short-circuit: findFirst/anyMatch dừng ngay khi đủ, không duyệt hết.',
              'Stream dùng MỘT LẦN — gọi terminal xong là đóng; cần xử lý lại phải tạo stream mới.',
              'groupingBy + summingLong/counting cho báo cáo; mapToLong().sum() cho tổng số.',
              'KHÔNG side-effect trong map/filter; cẩn thận parallelStream (chỉ lợi khi data lớn + không shared state).'
            ]
          }
        },

        // ----- l-1-9-4: Concurrency Basics -----
        {
          id: 'l-1-9-4',
          type: 'theory',
          title: 'Concurrency Basics — Thread, Race Condition & ExecutorService',
          subtitle: { en: 'Two hands reaching for the same thing.', vi: 'Vì sao 2 thread cùng sửa 1 biến lại ra kết quả sai.' },
          mentalModel: {
            vi: `Hình dung mỗi <strong>thread</strong> là một công nhân làm việc song song trên cùng một xưởng (bộ nhớ chung). Lợi: nhiều việc cùng lúc (xử lý 1000 request đồng thời). Hại: hai công nhân cùng thò tay vào MỘT thùng đồ → giẫm chân nhau.
<br/><br/>
<strong>Race condition</strong> kinh điển: <code>count++</code> KHÔNG phải 1 thao tác — nó là 3 bước (đọc count → +1 → ghi lại). Hai thread xen kẽ 3 bước này → mất update:
<pre>Thread A đọc count=5
Thread B đọc count=5   ← cùng đọc 5
Thread A ghi 6
Thread B ghi 6         ← đáng lẽ phải 7!</pre>
Đây gọi là thao tác KHÔNG nguyên tử (non-atomic). Sửa: làm cho nó nguyên tử (synchronized / Atomic / lock).`
          },
          underTheHood: {
            vi: `<h3>First Principles — Bản chất ngầm</h3>
<strong>1) Vì sao cần <code>volatile</code>?</strong>
Mỗi CPU core có cache riêng. Thread A ghi <code>flag=true</code> vào cache của nó, thread B (core khác) vẫn đọc giá trị cũ trong cache của B → vòng lặp <code>while(!flag)</code> chạy mãi. <code>volatile</code> bắt mọi đọc/ghi đi thẳng main memory (visibility). NHƯNG volatile KHÔNG làm <code>count++</code> nguyên tử — nó chỉ lo "nhìn thấy", không lo "atomic".
<br/><br/>
<strong>2) <code>synchronized</code> làm 2 việc.</strong>
(a) Mutual exclusion: chỉ 1 thread vào block tại một thời điểm (qua "monitor lock" của object). (b) Visibility: vào/ra synchronized tạo "happens-before" → flush cache. Vì thế synchronized vừa chống race vừa đảm bảo nhìn thấy.
<br/><br/>
<strong>3) Atomic classes — không cần lock.</strong>
<code>AtomicLong.incrementAndGet()</code> dùng lệnh CPU CAS (compare-and-swap) — nguyên tử ở mức phần cứng, không khoá. Nhanh hơn synchronized cho counter đơn giản.
<br/><br/>
<strong>4) Đừng tự <code>new Thread()</code> cho mỗi việc.</strong>
Tạo thread tốn ~1MB stack + chi phí OS. 1000 request = 1000 thread = sập. Dùng <strong>thread pool</strong> (<code>ExecutorService</code>): tái dùng số thread cố định, xếp việc vào hàng đợi. Đây là cách Spring/Tomcat xử lý request bên dưới.`
          },
          theory: {
            vi: `<h3>Công cụ cốt lõi</h3>
<ul>
  <li><strong>Tạo & chạy</strong>: implement <code>Runnable</code> (không trả về) hoặc <code>Callable&lt;T&gt;</code> (trả T + ném checked). Nộp vào <code>ExecutorService</code>.</li>
  <li><strong>ExecutorService</strong>: <code>Executors.newFixedThreadPool(n)</code>. <code>submit(callable)</code> trả <code>Future&lt;T&gt;</code>; <code>future.get()</code> chờ kết quả. Nhớ <code>shutdown()</code>.</li>
  <li><strong>synchronized</strong>: bảo vệ vùng "critical section" (đọc-sửa-ghi shared state).</li>
  <li><strong>Atomic</strong>: <code>AtomicInteger/AtomicLong</code> cho counter; <code>AtomicReference</code> cho object.</li>
  <li><strong>volatile</strong>: cho flag boolean được nhiều thread đọc/ghi (visibility, không atomic).</li>
  <li><strong>ConcurrentHashMap</strong>: map thread-safe. KHÔNG dùng <code>HashMap</code> chung giữa thread.</li>
</ul>

<h3>The "Why" — Vì sao người mới phải biết tối thiểu?</h3>
Bạn ít khi tự quản thread (Spring lo), nhưng code của bạn CHẠY trong môi trường đa luồng: nhiều request gọi cùng một <code>@Service</code> (singleton). Nếu service giữ <strong>mutable state</strong> ở field → race condition trong production. Quy tắc vàng: <em>service Spring nên stateless</em>. Đây cũng là chủ đề phỏng vấn backend phổ biến (và là nền cho concurrency ở capstone ShopCore: optimistic/pessimistic locking).

<h3>Junior Pitfalls — Lỗi thường gặp</h3>
<ul>
  <li><strong>Field mutable trong Spring @Service/@Component</strong> (singleton) → nhiều request ghi đè nhau. Giữ state trong tham số/biến local.</li>
  <li><strong>Dùng <code>volatile</code> cho counter</strong> tưởng đủ → vẫn mất update vì <code>++</code> không atomic. Dùng Atomic.</li>
  <li><strong>HashMap dùng chung giữa thread</strong> → có thể infinite loop / data corrupt khi resize. Dùng ConcurrentHashMap.</li>
  <li><strong>Quên <code>shutdown()</code> ExecutorService</strong> → JVM không thoát (non-daemon thread sống mãi).</li>
  <li><strong>Deadlock</strong>: 2 thread khoá A→B và B→A. Phòng: luôn khoá theo CÙNG thứ tự.</li>
  <li><strong>Bắt nuốt <code>InterruptedException</code></strong> rồi không set lại interrupt flag → mất tín hiệu dừng thread.</li>
</ul>`
          },
          codeExamples: [
            {
              title: 'Race condition & 3 cách sửa + thread pool',
              code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class CounterDemo {
    // ❌ SAI: count++ không atomic — chạy đa luồng ra số < mong đợi
    static long unsafe = 0;

    // ✅ Cách 1: AtomicLong (CAS, không khoá — nhanh nhất cho counter)
    static final AtomicLong atomic = new AtomicLong();

    // ✅ Cách 2: synchronized (khoá monitor)
    static long guarded = 0;
    static synchronized void incGuarded() { guarded++; }

    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(8);  // tái dùng 8 thread
        int tasks = 100_000;
        CountDownLatch done = new CountDownLatch(tasks);

        for (int i = 0; i < tasks; i++) {
            pool.submit(() -> {
                unsafe++;                 // ❌ race → kết quả < 100000
                atomic.incrementAndGet();  // ✅ luôn đúng
                incGuarded();              // ✅ luôn đúng
                done.countDown();
            });
        }
        done.await();                 // chờ tất cả task xong
        pool.shutdown();              // BẮT BUỘC: cho JVM thoát

        System.out.println("unsafe  = " + unsafe  + " (thường < 100000 — SAI)");
        System.out.println("atomic  = " + atomic.get() + " (= 100000)");
        System.out.println("guarded = " + guarded + " (= 100000)");
    }
}`,
              lang: 'java',
              description: 'unsafe++ minh hoạ mất update; AtomicLong và synchronized cùng cho kết quả đúng; thread pool + CountDownLatch + shutdown.'
            }
          ],
          socraticPrompts: [
            {
              title: 'Truy vết một race condition',
              prompt: `KHÔNG viết code hộ. Hỏi tôi:
1. Vì sao <code>count++</code> không nguyên tử? 3 bước CPU của nó là gì?
2. <code>volatile</code> sửa được vấn đề "visibility" hay "atomicity"? <code>count++</code> cần cái nào?
3. Tôi có @Service Spring với field <code>private int requestCount</code>. Vì sao đây là bug đa luồng? Sửa thế nào?
4. Khi nào chọn AtomicLong, khi nào synchronized, khi nào ConcurrentHashMap?
5. Vì sao không nên <code>new Thread()</code> cho mỗi request? ExecutorService giải quyết gì?`
            }
          ],
          exercises: [
            {
              title: 'Tìm bug đa luồng trong service',
              prompt: 'Cho <code>@Service class OrderService { private long total = 0; public void add(long c){ total += c; } public long total(){ return total; } }</code>. Spring tạo 1 instance dùng chung cho mọi request. Bug gì? Liệt kê 2 cách sửa.',
              hints: [
                'Câu hỏi 1: Singleton + field mutable + nhiều request song song gọi add() → total += c có an toàn không?',
                'Câu hỏi 2: Nếu BẮT BUỘC giữ tổng tích luỹ trong service, dùng kiểu nào để += an toàn mà không tự synchronized?'
              ],
              solution: {
                code: `// BUG: total += c là đọc-cộng-ghi (non-atomic). Nhiều request đồng thời
// → mất update → total nhỏ hơn thực tế (race condition).

// Cách 1 — AtomicLong (gọn, nhanh cho counter):
@Service
class OrderService {
    private final AtomicLong total = new AtomicLong();
    public void add(long c) { total.addAndGet(c); }   // nguyên tử
    public long total()     { return total.get(); }
}

// Cách 2 — synchronized (khi cần khoá nhiều thao tác liên quan):
@Service
class OrderService2 {
    private long total = 0;
    public synchronized void add(long c) { total += c; }
    public synchronized long total()     { return total; }
}

// Cách TỐT NHẤT thực tế: KHÔNG giữ state tích luỹ trong service singleton —
// lưu vào DB (UPDATE ... SET total = total + :c) hoặc tính từ query SUM().`,
                lang: 'java',
                complexityVi: 'Time O(1) mỗi thao tác.',
                explanationVi: 'Gốc rễ: Spring <code>@Service</code> là <strong>singleton</strong> — 1 object dùng chung cho mọi request chạy trên nhiều thread. Field mutable <code>total</code> + <code>+=</code> non-atomic = race condition. Hai cách kỹ thuật: <code>AtomicLong</code> (CAS, không khoá) hoặc <code>synchronized</code> cả getter lẫn setter. Nhưng bài học sâu hơn: <em>service nên stateless</em> — tổng tiền thuộc về DB, không phải field trong RAM của service.'
              }
            }
          ],
          keyTakeaways: {
            vi: [
              'Race condition: <code>count++</code> là 3 bước (đọc-cộng-ghi) → 2 thread xen kẽ làm mất update.',
              'volatile lo VISIBILITY (nhìn thấy giá trị mới), KHÔNG lo ATOMICITY. count++ cần atomicity.',
              'synchronized = mutual exclusion + visibility; Atomic = CAS không khoá cho counter; ConcurrentHashMap thay HashMap chung.',
              'Dùng ExecutorService (thread pool) thay vì new Thread() cho mỗi việc; nhớ shutdown().',
              'Quy tắc vàng backend: @Service Spring nên STATELESS — state mutable trong singleton = bug đa luồng.'
            ]
          }
        }
      ],
  references: [
    { title: 'Java Exceptions (Oracle Tutorial)', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' },
    { title: 'try-with-resources (Oracle)', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html' },
    { title: 'Lambda Expressions (Oracle Tutorial)', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html' },
    { title: 'java.util.function (Java 21 API)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html' },
    { title: 'Stream API (Java 21 API)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html' },
    { title: 'java.util.concurrent (Java 21 API)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html' },
    { title: 'Java Memory Model & volatile (JLS §17)', url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html' }
  ]
    }
