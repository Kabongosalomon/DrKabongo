---
layout: post
title:  "Circular Queue, Python Implementation"
categories: Coding
tags: [leetcode, data_structure]
comments: true
# categories: coding
# tags: linux

---

* TOC
{:toc}

## Problem Description
Design an implementation of the circular queue. The **circular queue** is a linear data structure in which the operations are performed based on [FIFO](https://en.wikipedia.org/wiki/FIFO_and_LIFO_accounting) (First In First Out) principle and the last position is connected back to the first position to make a circle. It is also called **"Ring Buffer"**.

This implementation should support following operations:

- **MyCircularQueue(k):** Constructor, set the size of the queue to be k.
- **Front:** Get the front item from the queue. If the queue is empty, return -1.
- **Rear:** Get the last item from the queue. If the queue is empty, return -1.
- **enQueue(value):** Insert an element into the circular queue. Return true if the operation is successful.
- **deQueue():** Delete an element from the circular queue. Return true if the operation is successful.
- **isEmpty():** Checks whether the circular queue is empty or not.
- **isFull():** Checks whether the circular queue is full or not.

Find below my python implementation that beats 94.37% of submission done using python3. 

## Code
```python
class MyCircularQueue:

    def __init__(self, k: int):
        """
        Initialize your data structure here. Set the size of the queue to be k.
        """
        self.q = []         # our queue
        self.k = k          # max_len
        

    def enQueue(self, value: int) -> bool:
        """
        Insert an element into the circular queue. Return true if the operation is successful.
        """
        if len(self.q)>=self.k:
            return False
        else :    
            self.q.append(value)
            return True
        

    def deQueue(self) -> bool:
        """
        Delete an element from the circular queue. Return true if the operation is successful.
        """
        if len(self.q)==0:
            return False
        else :
            # self.q.pop()
            del self.q[0]
            return True    

    def Front(self) -> int:
        """
        Get the front item from the queue.
        """
        if len(self.q)==0:
            return -1
        else :
            return self.q[0]
        

    def Rear(self) -> int:
        """
        Get the last item from the queue.
        """
        if self.isEmpty():
            return -1
        else :
            return self.q[-1]


    def isEmpty(self) -> bool:
        """
        Checks whether the circular queue is empty or not.
        """
        if len(self.q)==0:
            return True
        else:
            return False
        

    def isFull(self) -> bool:
        """
        Checks whether the circular queue is full or not.
        """
        if len(self.q) == self.k:
            return True
        else:
            return False
        
        


# Your MyCircularQueue object will be instantiated and called as such:
# obj = MyCircularQueue(k)
# param_1 = obj.enQueue(value)
# param_2 = obj.deQueue()
# param_3 = obj.Front()
# param_4 = obj.Rear()
# param_5 = obj.isEmpty()
# param_6 = obj.isFull()
```
---

## Reference
- [Leetcode](https://leetcode.com/explore/learn/card/queue-stack/228/first-in-first-out-data-structure/1337/), Queue and Stack Chapter. 


<!--<table style="width:100%">
<col width="20%">
<col width="10">
<col >

</table>-->

<style type="text/css">
td {
    border: 0.5px;
    vertical-align: center;
    text-align: left;
}
</style>