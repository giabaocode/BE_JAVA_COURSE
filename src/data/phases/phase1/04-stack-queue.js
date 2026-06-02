// ============================================================================
//  PHASE 1 — Module 1.4: Stack, Queue & Circular Buffer
// ============================================================================

export default
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
    }
