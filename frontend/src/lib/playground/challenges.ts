import { CodingChallenge } from "./types";

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    domain: "Computer Science",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Example Test
print(two_sum([2, 7, 11, 15], 9))
`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    auto ans = twoSum(nums, 9);
    std::cout << "[" << ans[0] << ", " << ans[1] << "]" << std::endl;
    return 0;
}
`,
      c: `#include <stdio.h>

void twoSum(int nums[], int n, int target, int *out1, int *out2) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                *out1 = i;
                *out2 = j;
                return;
            }
        }
    }
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int i1 = -1, i2 = -1;
    twoSum(nums, 4, 9, &i1, &i2);
    printf("[%d, %d]\\n", i1, i2);
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(result));
    }
}
`,
    },
    testCases: [
      {
        id: "tc-1",
        input: "nums = [2, 7, 11, 15], target = 9",
        expectedOutput: "[0, 1]",
        description: "Basic array pair",
      },
      {
        id: "tc-2",
        input: "nums = [3, 2, 4], target = 6",
        expectedOutput: "[1, 2]",
        description: "Middle indices pair",
      },
      {
        id: "tc-3",
        input: "nums = [3, 3], target = 6",
        expectedOutput: "[0, 1]",
        description: "Duplicate number pair",
      },
    ],
    solutionHints: [
      "A brute force approach checks all pairs in O(N^2) time.",
      "Can you use a hash map to look up the complement in O(1) time?",
    ],
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number & String",
    difficulty: "Easy",
    domain: "Computer Science",
    description: `Determine whether an integer or string is a palindrome. An entity is a palindrome when it reads the same backward as forward.`,
    constraints: ["Input can be negative or positive.", "Solve without converting to a string for bonus points."],
    starterCode: {
      python: `def is_palindrome(x):
    s = str(x)
    return s == s[::-1]

print("121 ->", is_palindrome(121))
print("-121 ->", is_palindrome(-121))
print("racecar ->", is_palindrome("racecar"))
`,
      javascript: `function isPalindrome(val) {
  const str = String(val);
  return str === str.split('').reverse().join('');
}

console.log("121 ->", isPalindrome(121));
console.log("-121 ->", isPalindrome(-121));
console.log("racecar ->", isPalindrome("racecar"));
`,
      c: `#include <stdio.h>
#include <stdbool.h>

bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int reverted = 0;
    while (x > reverted) {
        reverted = reverted * 10 + x % 10;
        x /= 10;
    }
    return x == reverted || x == reverted / 10;
}

int main() {
    printf("121 -> %s\\n", isPalindrome(121) ? "true" : "false");
    printf("-121 -> %s\\n", isPalindrome(-121) ? "true" : "false");
    return 0;
}
`,
    },
    testCases: [
      { id: "tc-1", input: "121", expectedOutput: "true" },
      { id: "tc-2", input: "-121", expectedOutput: "false" },
      { id: "tc-3", input: "10", expectedOutput: "false" },
    ],
    solutionHints: [
      "Negative numbers cannot be palindromes because of the minus sign.",
      "Reversing half of the number avoids integer overflow.",
    ],
  },
  {
    id: "matrix-dot-product",
    title: "Vector Dot Product & Cosine Similarity",
    difficulty: "Medium",
    domain: "AI & Data Science",
    description: `Implement vector dot product and cosine similarity between two feature embeddings A and B. This is the foundation of Vector Databases, RAG semantic search, and Neural Network attention heads.`,
    constraints: ["Vectors A and B have the same dimension N (1 <= N <= 10^3)", "Magnitude of vectors > 0"],
    starterCode: {
      python: `import math

def dot_product(a, b):
    return sum(x * y for x, y in zip(a, b))

def cosine_similarity(a, b):
    dot = dot_product(a, b)
    norm_a = math.sqrt(sum(x ** 2 for x in a))
    norm_b = math.sqrt(sum(y ** 2 for y in b))
    if norm_a == 0 or norm_b == 0: return 0.0
    return dot / (norm_a * norm_b)

v1 = [1.0, 2.0, 3.0]
v2 = [1.0, 2.0, 3.0]
print(f"Similarity: {cosine_similarity(v1, v2):.4f}")
`,
      javascript: `function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

console.log("Cosine Sim:", cosineSimilarity([1, 2, 3], [1, 2, 3]).toFixed(4));
`,
    },
    testCases: [
      { id: "tc-1", input: "A=[1,0,0], B=[1,0,0]", expectedOutput: "1.0000" },
      { id: "tc-2", input: "A=[1,0], B=[0,1]", expectedOutput: "0.0000" },
    ],
    solutionHints: [
      "Cosine similarity is dot(A, B) / (||A|| * ||B||).",
      "Identical vectors have cosine similarity of 1.0; orthogonal vectors have 0.0.",
    ],
  },
  {
    id: "bit-manipulation-flags",
    title: "Bitwise Register Masking & Parity",
    difficulty: "Medium",
    domain: "ECE & Embedded",
    description: `Write a low-level routine that takes an 8-bit or 32-bit register value, counts the number of set bits (popcount / parity), and verifies if specific hardware interrupt flags (e.g., bit 3 and bit 7) are enabled.`,
    constraints: ["0 <= register_value <= 0xFFFFFFFF"],
    starterCode: {
      c: `#include <stdio.h>

int countSetBits(unsigned int n) {
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

int main() {
    unsigned int reg = 0x88; // 10001000 in binary
    printf("Register 0x%02X set bits: %d\\n", reg, countSetBits(reg));
    
    // Check bit 7 and bit 3
    int bit3 = (reg >> 3) & 1;
    int bit7 = (reg >> 7) & 1;
    printf("Bit 3 status: %d, Bit 7 status: %d\\n", bit3, bit7);
    return 0;
}
`,
      python: `def count_set_bits(n):
    return bin(n).count('1')

reg = 0x88
print(f"Set bits in 0x{reg:02X}: {count_set_bits(reg)}")
`,
    },
    testCases: [
      { id: "tc-1", input: "reg = 0x0F", expectedOutput: "4" },
      { id: "tc-2", input: "reg = 0x88", expectedOutput: "2" },
    ],
    solutionHints: [
      "Brian Kernighan's algorithm clears the lowest set bit in each iteration: n = n & (n - 1).",
    ],
  },
];
