// ============================================================================
//  PHASE 2 — 17 LeetCode Patterns (Bilingual, Anti-Copy-Paste)
//  Mỗi pattern là 1 file riêng dưới ./phase2/ — dễ tinker từng pattern.
// ============================================================================

import slidingWindow      from './phase2/01-sliding-window.js'
import twoPointers        from './phase2/02-two-pointers.js'
import fastSlow           from './phase2/03-fast-slow.js'
import mergeIntervals     from './phase2/04-merge-intervals.js'
import cyclicSort         from './phase2/05-cyclic-sort.js'
import reversalLL         from './phase2/06-reversal-ll.js'
import treeBFS            from './phase2/07-tree-bfs.js'
import treeDFS            from './phase2/08-tree-dfs.js'
import twoHeaps           from './phase2/09-two-heaps.js'
import backtracking       from './phase2/10-backtracking.js'
import binarySearch       from './phase2/11-binary-search.js'
import topK               from './phase2/12-top-k.js'
import graphTraversal     from './phase2/13-graph-traversal.js'
import graphShortestPath  from './phase2/14-graph-shortest-path.js'
import trie               from './phase2/15-trie.js'
import dp1D               from './phase2/16-dp-1d.js'
import dp2D               from './phase2/17-dp-2d.js'

// Transformer: each pattern file exports { id, title, mental, under, theory, code, prompts, problems }
// We wrap it into the module/lessons shape MainContent expects.
const toModule = ({ id, title, mental, under, theory, code, prompts, problems }) => ({
  id: `mod-2-${id}`,
  title,
  lessons: [
    {
      id: `l-2-${id}-theory`,
      type: 'theory',
      title: `${title.split('—')[1]?.trim() || title} — Theory`,
      mentalModel: { vi: mental },
      underTheHood: { vi: under },
      theory: { vi: theory },
      codeExamples: code ? [{ code }] : undefined,
      socraticPrompts: prompts
    },
    {
      id: `l-2-${id}-problems`,
      type: 'problems',
      title: `${title.split('—')[1]?.trim() || title} — Problem Set`,
      problems
    }
  ]
})

export const phase2 = {
  id: 'phase-2',
  title: 'Phase 2 — 17 LeetCode Patterns (Mental Models)',
  tagline: 'Hiểu LÝ DO trước, code sau. Mỗi problem có hints + lời giải tham khảo, locked khi Mock Mode chạy timer.',
  intro: {
    vi: 'KHÔNG học pattern bằng cách thuộc lòng code. Hãy hiểu CÂU HỎI mà pattern trả lời. Mỗi pattern dưới đây: <strong>First Principles</strong> (tại sao đúng về mặt toán), <strong>The Why</strong> (vs alternatives), <strong>Junior Pitfalls</strong> (5 lỗi điển hình), Socratic prompts để bạn TỰ suy luận template, và 10-15 LeetCode problem có hints Socratic + lời giải tham khảo Java optimal.'
  },
  modules: [
    toModule(slidingWindow),
    toModule(twoPointers),
    toModule(fastSlow),
    toModule(mergeIntervals),
    toModule(cyclicSort),
    toModule(reversalLL),
    toModule(treeBFS),
    toModule(treeDFS),
    toModule(twoHeaps),
    toModule(backtracking),
    toModule(binarySearch),
    toModule(topK),
    toModule(graphTraversal),
    toModule(graphShortestPath),
    toModule(trie),
    toModule(dp1D),
    toModule(dp2D)
  ]
}

export const LC = (slug) => `https://leetcode.com/problems/${slug}/`
