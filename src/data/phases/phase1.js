// ============================================================================
//  PHASE 1 — Java OOP, Data Structures & Sorting (Under the Hood)
//  Mỗi module 1 file dưới ./phase1/ — multi-file split per CLAUDE.md convention.
//  Mỗi lesson: Mental Model + First Principles (under the hood) + The Why
//             + Junior Pitfalls + Socratic Prompts + Exercises (hints + solution)
// ============================================================================

import oopPillars       from './phase1/01-oop-pillars.js'
import arraysDynamic    from './phase1/02-arrays-dynamic.js'
import linkedLists      from './phase1/03-linked-lists.js'
import stackQueue       from './phase1/04-stack-queue.js'
import hashmapHashset   from './phase1/05-hashmap-hashset.js'
import treesBstHeap     from './phase1/06-trees-bst-heap.js'
import sorting          from './phase1/07-sorting.js'
import oopMiniProjects  from './phase1/08-oop-mini-projects.js'

export const phase1 = {
  id: 'phase-1',
  title: 'Phase 1 — Java OOP, Data Structures & Sorting (Under the Hood)',
  tagline: 'Từng byte, từng cache line. Tự tay code lại mọi container. Sort bằng tư duy chia-để-trị.',
  intro: {
    vi: 'Phase này build foundations: bạn KHÔNG dùng <code>java.util.ArrayList</code> trước khi tự viết được một cái. Mỗi cấu trúc dữ liệu có 3 lớp giải thích — <strong>Mental Model</strong> (cách tư duy), <strong>First Principles</strong> (cơ chế memory/CPU/JVM bên dưới), <strong>Junior Pitfalls</strong> (bug điển hình). Phase kết thúc với Merge Sort + Quick Sort — đây là lúc bạn nắm chia-để-trị và recursion tree, hai trụ cột cho Phase 2.'
  },
  modules: [
    oopPillars,
    arraysDynamic,
    linkedLists,
    stackQueue,
    hashmapHashset,
    treesBstHeap,
    sorting,
    oopMiniProjects
  ]
}
