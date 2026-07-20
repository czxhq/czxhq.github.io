---
title: "第一章习题21-40"
slug: "matrix-exercise2"
date: "2026-05-14"
updated: "2026-05-14"
category: "数学/矩阵理论/第一章 线性代数引论"
tags:
  - "Tutorial"
  - "Math"
summary: "第一章习题解答"
cover: ""
draft: false
featured: true
format: "kmd"
---

# 第一章习题21-40

## 习题21
%%example {title: "习题21", icon: "📝"}
设 $A \in \mathbb{C}^{m \times n}, b \in \mathbb{R}^m$，且 $\text{rank}(A) = r$，若非齐次线性方程组 $Ax = b$ 有特解 $x = \xi$，记方程组的解集为 $V$，求 $V$ 的极大线性无关组向量个数。
%%fold {title: "解答", icon: "📂"}
非齐次线性方程组 $Ax = b$ 的解集 $V$ 的极大线性无关组的向量个数为 $n - r + 1$。

**证明过程如下：**

1. **解集的构成**：
若 $Ax = b$ 有特解 $\xi$，则其通解为 $V = \{ \xi + \eta \mid \eta \in W \}$，其中 $W = \{ x \mid Ax = 0 \}$ 是对应齐次线性方程组的解空间。
2. **齐次解空间的维数**：
根据秩一零度定理，$\dim(W) = n - \text{rank}(A) = n - r$。
3. **线性无关组的构造**：
设 $\{\eta_1, \eta_2, \dots, \eta_{n-r}\}$ 为 $W$ 的一组基。则向量组 $\xi, \xi+\eta_1, \xi+\eta_2, \dots, \xi+\eta_{n-r}$ 属于 $V$。
4. **线性无关性验证**：
考虑线性组合：

$$k_0 \xi + k_1 (\xi + \eta_1) + \dots + k_{n-r} (\xi + \eta_{n-r}) = 0$$



整理得：

$$(\sum_{i=0}^{n-r} k_i) \xi + \sum_{j=1}^{n-r} k_j \eta_j = 0$$



左乘 $A$ 可得 $(\sum_{i=0}^{n-r} k_i) b = 0$。
* 若 $b \neq 0$，则 $\sum k_i = 0$，进而 $\sum_{j=1}^{n-r} k_j \eta_j = 0$。由于 $\eta_j$ 线性无关，得 $k_j = 0$（$j=1,\dots,n-r$），最终 $k_0 = 0$。
* 若 $b = 0$，则 $V = W$，极大线性无关组个数即为维数 $n-r$。但题目给定的是非齐次方程组且通常隐含 $b \neq 0$ 的一般情形。


5. **结论**：
在 $b \neq 0$ 的情况下，$V$ 的极大线性无关组向量个数为 $(n-r) + 1 = n - r + 1$。
%%
%%

## 习题22
%%example {title: "习题22", icon: "📝"}
证明 $R(\boldsymbol{A})=R(\boldsymbol{AB})$ 成立的充分必要条件是存在适当阶数的矩阵 $\boldsymbol{C}$ 使得 $\boldsymbol{ABC}=\boldsymbol{A}$。
%%fold {title: "解答", icon: "📂"}
**证明：**

记矩阵 $\boldsymbol{X}$ 的列空间为 $R(\boldsymbol{X}) = \{ \boldsymbol{Xx} \mid \boldsymbol{x} \text{ 为适当维数的列向量} \}$。

**1. 必要性（$\Rightarrow$）**
已知 $R(\boldsymbol{A}) = R(\boldsymbol{AB})$。
因为矩阵 $\boldsymbol{A}$ 的每一个列向量显然都属于其自身的列空间 $R(\boldsymbol{A})$，
又由已知 $R(\boldsymbol{A}) = R(\boldsymbol{AB})$，所以 $\boldsymbol{A}$ 的每一个列向量必然也属于 $R(\boldsymbol{AB})$。
这意味着 $\boldsymbol{A}$ 的每一列都可以由矩阵 $\boldsymbol{AB}$ 的列向量线性表出。
根据矩阵乘法的列向量表示法，必然存在一个适当阶数的矩阵 $\boldsymbol{C}$，使得：


$$\boldsymbol{A} = (\boldsymbol{AB})\boldsymbol{C}$$


即 $\boldsymbol{ABC} = \boldsymbol{A}$ 成立。

**2. 充分性（$\Leftarrow$）**
已知存在矩阵 $\boldsymbol{C}$ 使得 $\boldsymbol{ABC} = \boldsymbol{A}$。
首先，根据矩阵分块乘法及列空间的定义，对于任意矩阵 $\boldsymbol{A}$ 和 $\boldsymbol{B}$，$\boldsymbol{AB}$ 的列向量都是 $\boldsymbol{A}$ 的列向量的线性组合，因此总是成立：


$$R(\boldsymbol{AB}) \subseteq R(\boldsymbol{A})$$


其次，任取 $\boldsymbol{y} \in R(\boldsymbol{A})$，根据列空间的定义，存在向量 $\boldsymbol{x}$ 使得 $\boldsymbol{y} = \boldsymbol{Ax}$。
将 $\boldsymbol{A} = \boldsymbol{ABC}$ 代入上式，可得：


$$\boldsymbol{y} = (\boldsymbol{ABC})\boldsymbol{x} = (\boldsymbol{AB})(\boldsymbol{Cx})$$


令 $\boldsymbol{z} = \boldsymbol{Cx}$，则 $\boldsymbol{z}$ 为一个列向量，且 $\boldsymbol{y} = (\boldsymbol{AB})\boldsymbol{z}$。
由此可知 $\boldsymbol{y} \in R(\boldsymbol{AB})$，这表明：


$$R(\boldsymbol{A}) \subseteq R(\boldsymbol{AB})$$


综合以上两个包含关系，即得：


$$R(\boldsymbol{A}) = R(\boldsymbol{AB})$$

证毕。
%%
%%

## 习题23
%%example {title: "习题23", icon: "📝"}
设 $x_0, x_1, \cdots, x_n$ 是 $[a, b]$ 上取定的 $n+1$ 个已知互异点, 定义

$$l_i(x) = \prod_{\substack{j=0, \\ j \neq i}}^{n} \frac{(x - x_j)}{(x_i - x_j)}, \quad i = 1, \cdots, n$$



则 $l_i(x), i = 1, \cdots, n$ 是 $P_n(x)$ 空间中的一组基.
%%fold {title: "解答", icon: "📂"}
**证明：**

*注：根据题意，插值节点共有 $n+1$ 个（$x_0$ 到 $x_n$），因此对应的基函数应为 $l_i(x)$，其中 $i = 0, 1, \cdots, n$。以下证明这 $n+1$ 个函数构成 $P_n(x)$（次数不超过 $n$ 的多项式空间）的一组基。*

要证明 $l_0(x), l_1(x), \cdots, l_n(x)$ 是 $P_n(x)$ 空间的一组基，需证明它们属于该空间且线性无关，并且向量的个数等于空间的维数。

**1. 证明 $l_i(x) \in P_n(x)$**
根据定义：


$$l_i(x) = \prod_{\substack{j=0, \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j}, \quad i = 0, 1, \cdots, n$$


该连乘式由 $n$ 个形如 $(x - x_j)$ 的一次因子相乘而成（分母为常数）。因此，每个 $l_i(x)$ 都是关于 $x$ 的 $n$ 次多项式，即 $l_i(x) \in P_n(x)$。

**2. 证明函数组 $l_0(x), l_1(x), \cdots, l_n(x)$ 线性无关**
由定义可知，当 $x = x_k$ 时，基函数满足克罗内克-δ性质（Kronecker delta）：


$$l_i(x_k) = \begin{cases} 1, & i = k \\ 0, & i \neq k \end{cases}$$


设有实数 $c_0, c_1, \cdots, c_n$，使得下列等式对任意实数 $x$ 恒成立：


$$\sum_{i=0}^{n} c_i l_i(x) = 0$$


为了求出系数 $c_i$，分别将 $x = x_k \ (k = 0, 1, \cdots, n)$ 代入上式。由于当 $i \neq k$ 时 $l_i(x_k) = 0$，当 $i = k$ 时 $l_k(x_k) = 1$，则有：


$$\sum_{i=0}^{n} c_i l_i(x_k) = c_k \cdot l_k(x_k) = c_k = 0$$


即对于所有的 $k = 0, 1, \cdots, n$，必然有 $c_k = 0$。
这表明这 $n+1$ 个多项式 $l_0(x), l_1(x), \cdots, l_n(x)$ 是线性无关的。

**3. 结合空间维数得出结论**
已知多项式空间 $P_n(x)$ 的一组标准基为 $1, x, x^2, \cdots, x^n$，其维数 $\dim P_n(x) = n + 1$。
因为 $l_0(x), l_1(x), \cdots, l_n(x)$ 是 $P_n(x)$ 空间中的 $n+1$ 个线性无关的多项式，且向量个数刚好等于空间的维数，所以它们必然张成整个 $P_n(x)$ 空间。

**结论：**
因此，$l_i(x), i = 0, 1, \cdots, n$ 是 $P_n(x)$ 空间中的一组基。证毕。
%%
%%

## 习题24
%%example {title: "习题24", icon: "📝"}
取 $P_2(t)$ 的一组基为 $1+t, t-2, t^2$, 求多项式 $p(t)=2t^2-t+1$ 在该组基下的坐标.
%%fold {title: "解答", icon: "📂"}
**解：**

设多项式 $p(t) = 2t^2 - t + 1$ 在基 $1+t, t-2, t^2$ 下的坐标为 $(x_1, x_2, x_3)^T$，则满足：


$$x_1(1+t) + x_2(t-2) + x_3(t^2) = 2t^2 - t + 1$$

将等式左边按 $t$ 的幂次展开并合并同类项，得：


$$x_3t^2 + (x_1 + x_2)t + (x_1 - 2x_2) = 2t^2 - t + 1$$

比较等式两边同次幂的系数，可得如下线性方程组：
$$\begin{cases}
x_3 = 2 \\
x_1 + x_2 = -1 \\
x_1 - 2x_2 = 1
\end{cases}$$

解该方程组：
由第一式直接可得 $x_3 = 2$。
由第二式得 $x_1 = -1 - x_2$，代入第三式可得：


$$(-1 - x_2) - 2x_2 = 1$$

$$-3x_2 = 2 \implies x_2 = -\frac{2}{3}$$

将 $x_2 = -\frac{2}{3}$ 代入 $x_1 = -1 - x_2$ 得：


$$x_1 = -1 - \left(-\frac{2}{3}\right) = -\frac{1}{3}$$

因此，方程组的解为：
$$\begin{cases}
x_1 = -\frac{1}{3} \
x_2 = -\frac{2}{3} \
x_3 = 2
\end{cases}$$

所以，多项式 $p(t) = 2t^2 - t + 1$ 在该组基下的坐标为 $\left(-\frac{1}{3}, -\frac{2}{3}, 2\right)^T$。
%%
%%

## 习题25

%%example {title: "习题25", icon: "📝"}
在 $\mathbb{R}^{2 \times 2}$ 中求向量 $\boldsymbol{A}=\begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix}$ 在基 $\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}, \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}, \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}, \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}$ 下的坐标.
%%fold {title: "解答", icon: "📂"}
**解：**

设向量 $\boldsymbol{A}$ 在给定基下的坐标为 $(x_1, x_2, x_3, x_4)^T$，则满足：


$$x_1 \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} + x_2 \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix} + x_3 \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + x_4 \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix}$$

将等式左边的矩阵进行线性组合，可得：


$$\begin{bmatrix} x_1+x_2+x_3+x_4 & x_1+x_2 \\ x_1+x_2+x_4 & x_1+x_3+x_4 \end{bmatrix} = \begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix}$$

根据矩阵相等的条件，对应元素相等，得到如下线性方程组：
$$\begin{cases}
x_1 + x_2 + x_3 + x_4 = 1 & (1)\\
x_1 + x_2 = 2 & (2)\\
x_1 + x_2 + x_4 = 1 & (3)\\
x_1 + x_3 + x_4 = 0 & (4)
\end{cases}$$

求解该方程组：
将 (2) 式代入 (3) 式，得：


$$2 + x_4 = 1 \implies x_4 = -1$$

将 (2) 式和 $x_4 = -1$ 代入 (1) 式，得：


$$2 + x_3 - 1 = 1 \implies x_3 = 0$$

将 $x_3 = 0$ 和 $x_4 = -1$ 代入 (4) 式，得：


$$x_1 + 0 - 1 = 0 \implies x_1 = 1$$

将 $x_1 = 1$ 代入 (2) 式，得：


$$1 + x_2 = 2 \implies x_2 = 1$$

解得：
$$\begin{cases}
x_1 = 1 \
x_2 = 1 \
x_3 = 0 \
x_4 = -1
\end{cases}$$

因此，向量 $\boldsymbol{A}$ 在该组基下的坐标为 $(1, 1, 0, -1)^T$。
%%
%%

## 习题26

%%example {title: "习题26", icon: "📝"}
设多项式空间 $P_2(x)$, 证明 $1, (x-1), (x-1)^2$ 是 $P_2(x)$ 的一组基; 并求从基 $1, x, x^2$ 到基 $1, (x-1), (x-1)^2$ 的过渡矩阵.
%%fold {title: "解答", icon: "📂"}
**证明与求解过程如下：**

**1. 证明 $1, (x-1), (x-1)^2$ 是 $P_2(x)$ 的一组基**

已知多项式空间 $P_2(x)$ 的维数为 $3$，其自然基（标准基）为 $1, x, x^2$。
将给定的多项式用自然基展开：
$$\begin{aligned}
1 &= 1 \cdot 1 + 0 \cdot x + 0 \cdot x^2 \\
x-1 &= -1 \cdot 1 + 1 \cdot x + 0 \cdot x^2 \\
(x-1)^2 &= 1 - 2x + x^2 = 1 \cdot 1 - 2 \cdot x + 1 \cdot x^2
\end{aligned}$$

将其坐标写成矩阵形式（以列向量排列），得到系数矩阵 $A$：


$$A = \begin{bmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1 \end{bmatrix}$$

计算该矩阵的行列式：


$$|A| = \begin{vmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1 \end{vmatrix} = 1 \times 1 \times 1 = 1 \neq 0$$

由于系数矩阵 $A$ 是满秩的（行列式不为零），说明多项式 $1, (x-1), (x-1)^2$ 是线性无关的。
又因为 $P_2(x)$ 空间的维数是 $3$，且该向量组包含 $3$ 个线性无关的向量，因此它们必然张成整个空间，是 $P_2(x)$ 的一组基。

**2. 求过渡矩阵**

设基一为 $E_1 = (1, x, x^2)$，基二为 $E_2 = (1, x-1, (x-1)^2)$。
根据过渡矩阵的定义，若存在矩阵 $P$ 使得 $E_2 = E_1 P$，则 $P$ 即为从基一到基二的过渡矩阵。

由第一步的线性表出关系可以直接写出矩阵等式：


$$(1, x-1, (x-1)^2) = (1, x, x^2) \begin{bmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1 \end{bmatrix}$$

因此，从基 $1, x, x^2$ 到基 $1, (x-1), (x-1)^2$ 的过渡矩阵为：


$$P = \begin{bmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1 \end{bmatrix}$$
%%
%%

## 习题27

%%example {title: "习题27", icon: "📝"}
设 $\boldsymbol{A} = \begin{bmatrix} 0 & 2 & 2 & 2 \\ -1 & 4 & 5 & 3 \end{bmatrix}$ , 求 $N(\boldsymbol{A})$ 和 $R(\boldsymbol{A})$ 的维数与基.
%%fold {title: "解答", icon: "📂"}
**解：**

已知矩阵 $\boldsymbol{A} = \begin{bmatrix} 0 & 2 & 2 & 2 \\ -1 & 4 & 5 & 3 \end{bmatrix}$。

**1. 初等行变换化简矩阵**
对矩阵 $\boldsymbol{A}$ 进行初等行变换，将其化为行最简形矩阵：


$$\begin{bmatrix} 0 & 2 & 2 & 2 \\ -1 & 4 & 5 & 3 \end{bmatrix} \xrightarrow{r_1 \leftrightarrow r_2} \begin{bmatrix} -1 & 4 & 5 & 3 \\ 0 & 2 & 2 & 2 \end{bmatrix} \xrightarrow{\begin{subarray}{l} -r_1 \\ \frac{1}{2}r_2 \end{subarray}} \begin{bmatrix} 1 & -4 & -5 & -3 \\ 0 & 1 & 1 & 1 \end{bmatrix}$$

$$\xrightarrow{r_1 + 4r_2} \begin{bmatrix} 1 & 0 & -1 & 1 \\ 0 & 1 & 1 & 1 \end{bmatrix}$$

**2. 求列空间 $R(\boldsymbol{A})$ 的维数与基**
由行最简形矩阵可知，矩阵 $\boldsymbol{A}$ 的主元列位于第 $1$ 列和第 $2$ 列。
因此，矩阵 $\boldsymbol{A}$ 的列秩为 $2$，即列空间 $R(\boldsymbol{A})$ 的维数为：


$$\dim(R(\boldsymbol{A})) = 2$$


列空间的一组基可取原矩阵 $\boldsymbol{A}$ 对应的第 $1$ 列和第 $2$ 列向量：


$$\left\{ \begin{bmatrix} 0 \\ -1 \end{bmatrix}, \begin{bmatrix} 2 \\ 4 \end{bmatrix} \right\}$$


*（注：由于 $\boldsymbol{A}$ 的列向量属于 $\mathbb{R}^2$ 且列空间维数为 $2$，故 $R(\boldsymbol{A}) = \mathbb{R}^2$，取标准基 $\left\{ \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \begin{bmatrix} 0 \\ 1 \end{bmatrix} \right\}$ 作为基同样正确。）*

**3. 求零空间 $N(\boldsymbol{A})$ 的维数与基**
齐次线性方程组 $\boldsymbol{Ax} = \boldsymbol{0}$ 对应的化简后同解方程组为：


$$\begin{cases} x_1 - x_3 + x_4 = 0 \\ x_2 + x_3 + x_4 = 0 \end{cases} \implies \begin{cases} x_1 = x_3 - x_4 \\ x_2 = -x_3 - x_4 \end{cases}$$


其中 $x_1, x_2$ 为主元变量，$x_3, x_4$ 为自由变量。
因此，零空间 $N(\boldsymbol{A})$ 的维数为自由变量的个数：


$$\dim(N(\boldsymbol{A})) = 4 - 2 = 2$$


分别令自由变量 $(x_3, x_4) = (1, 0)$ 和 $(x_3, x_4) = (0, 1)$，可得基础解系：
当 $x_3 = 1, x_4 = 0$ 时，$\boldsymbol{\xi}_1 = \begin{bmatrix} 1 \\ -1 \\ 1 \\ 0 \end{bmatrix}$
当 $x_3 = 0, x_4 = 1$ 时，$\boldsymbol{\xi}_2 = \begin{bmatrix} -1 \\ -1 \\ 0 \\ 1 \end{bmatrix}$
零空间 $N(\boldsymbol{A})$ 的一组基为：


$$\left\{ \begin{bmatrix} 1 \\ -1 \\ 1 \\ 0 \end{bmatrix}, \begin{bmatrix} -1 \\ -1 \\ 0 \\ 1 \end{bmatrix} \right\}$$
%%
%%

## 习题28

%%example {title: "习题28", icon: "📝"}
28. 设齐次线性方程组 $\boldsymbol{Ax}=\boldsymbol{0}$, 其中 $\boldsymbol{A} \in \mathbb{R}^{40 \times 42}, \boldsymbol{x} \in \mathbb{R}^{42}$. 若该方程组的基础解系由两个线性无关的解向量构成, 请判断非齐次线性方程组 $\boldsymbol{Ax}=\boldsymbol{b}$ 是否有解.
%%fold {title: "解答", icon: "📂"}
**结论：** 非齐次线性方程组 $\boldsymbol{Ax}=\boldsymbol{b}$ **一定有解**。

**证明/解析过程如下：**

1. 根据题意，矩阵 $\boldsymbol{A} \in \mathbb{R}^{40 \times 42}$，即该线性方程组包含 $m = 40$ 个方程，$n = 42$ 个未知数。
2. 已知齐次线性方程组 $\boldsymbol{Ax}=\boldsymbol{0}$ 的基础解系由 $2$ 个线性无关的解向量构成。根据解空间维数定理，基础解系所含向量的个数等于 $n - \text{rank}(\boldsymbol{A})$，即：

$$n - \text{rank}(\boldsymbol{A}) = 2$$


3. 代入未知数的个数 $n = 42$，可以求得系数矩阵 $\boldsymbol{A}$ 的秩为：

$$\text{rank}(\boldsymbol{A}) = 42 - 2 = 40$$


4. 由于矩阵 $\boldsymbol{A}$ 的行数为 $40$，且求得的秩 $\text{rank}(\boldsymbol{A}) = 40$，这说明矩阵 $\boldsymbol{A}$ 是**行满秩**矩阵。
5. 考虑任意列向量 $\boldsymbol{b} \in \mathbb{R}^{40}$，增广矩阵 $[\boldsymbol{A} \mid \boldsymbol{b}]$ 的尺寸为 $40 \times 43$。因为矩阵的秩不能超过其行数（即 $40$），所以必然有：

$$\text{rank}([\boldsymbol{A} \mid \boldsymbol{b}]) \le 40$$


6. 又因为增广矩阵的秩大于等于系数矩阵的秩，即 $\text{rank}([\boldsymbol{A} \mid \boldsymbol{b}]) \ge \text{rank}(\boldsymbol{A}) = 40$。
综合可得：

$$\text{rank}(\boldsymbol{A}) = \text{rank}([\boldsymbol{A} \mid \boldsymbol{b}]) = 40$$


7. 根据克罗内克-卡佩里定理（线性方程组有解判别定理），当系数矩阵的秩等于增广矩阵的秩时，非齐次线性方程组必定有解。

因此，无论 $\boldsymbol{b}$ 取何值，方程组 $\boldsymbol{Ax}=\boldsymbol{b}$ 都有解（且因为 $\text{rank}(\boldsymbol{A}) < n$，该方程组有无穷多解）。
%%
%%

## 习题29

%%example {title: "习题29", icon: "📝"}
证明[[matrix1.3#8|命题1.3.1（过渡矩阵的性质）]]
%%fold {title: "解答", icon: "📂"}
详见[[matrix1.3#8|命题1.3.1（过渡矩阵的性质）]]
%%
%%

## 习题30

%%example {title: "习题30", icon: "📝"}
30. 设 $P_2(x)$ 是 $\mathbb{R}$ 上的线性空间, 定义函数

$$(f, g) = \int_{-1}^{1} f(x)g(x)\mathrm{d}x, \quad f(x), g(x) \in P_2(x)$$\

(1) 证明 $P_2(x)$ 是欧氏空间
(2) 求 $P_2(x)$ 关于基 $1, x, x^2$ 的度量矩阵;
(3) 计算 $f(x) = 1 - x + x^2$ 和 $g(x) = 1 - 4x - 5x^2$ 的内积。
%%fold {title: "解答", icon: "📂"}
**(1) 证明 $P_2(x)$ 是欧氏空间**

要证明 $P_2(x)$ 在所给内积定义下构成欧氏空间，只需验证该内积满足以下四个公理。对于任意 $f(x), g(x), h(x) \in P_2(x)$ 及任意实数 $k$：

1. **对称性**：

$$(f, g) = \int_{-1}^{1} f(x)g(x)\mathrm{d}x = \int_{-1}^{1} g(x)f(x)\mathrm{d}x = (g, f)$$


2. **可加性**：

$$(f+h, g) = \int_{-1}^{1} [f(x)+h(x)]g(x)\mathrm{d}x = \int_{-1}^{1} f(x)g(x)\mathrm{d}x + \int_{-1}^{1} h(x)g(x)\mathrm{d}x = (f, g) + (h, g)$$


3. **齐次性**：

$$(kf, g) = \int_{-1}^{1} kf(x)g(x)\mathrm{d}x = k\int_{-1}^{1} f(x)g(x)\mathrm{d}x = k(f, g)$$


4. **正定性**：

$$(f, f) = \int_{-1}^{1} f^2(x)\mathrm{d}x \ge 0$$



且 $(f, f) = 0 \iff \int_{-1}^{1} f^2(x)\mathrm{d}x = 0$。由于 $f(x)$ 是多项式函数，其在 $[-1, 1]$ 上必然连续，故 $f^2(x) \equiv 0$，即 $f(x) \equiv 0$（零多项式）。

综上所述，该定义满足内积的四条公理，因此 $P_2(x)$ 是欧氏空间。

---

**(2) 求 $P_2(x)$ 关于基 $1, x, x^2$ 的度量矩阵**

设基底为 $\varepsilon_1 = 1, \varepsilon_2 = x, \varepsilon_3 = x^2$。
度量矩阵（Gram矩阵）为 $\boldsymbol{A} = (a_{ij})_{3 \times 3}$，其中矩阵元素 $a_{ij} = (\varepsilon_i, \varepsilon_j) = \int_{-1}^{1} x^{i-1} x^{j-1} \mathrm{d}x = \int_{-1}^{1} x^{i+j-2} \mathrm{d}x$。

分别计算矩阵的各项元素：


$$a_{11} = (1, 1) = \int_{-1}^{1} 1 \mathrm{d}x = 2$$

$$a_{12} = a_{21} = (1, x) = \int_{-1}^{1} x \mathrm{d}x = 0$$

$$a_{13} = a_{31} = (1, x^2) = \int_{-1}^{1} x^2 \mathrm{d}x = \frac{2}{3}$$

$$a_{22} = (x, x) = \int_{-1}^{1} x^2 \mathrm{d}x = \frac{2}{3}$$

$$a_{23} = a_{32} = (x, x^2) = \int_{-1}^{1} x^3 \mathrm{d}x = 0$$

$$a_{33} = (x^2, x^2) = \int_{-1}^{1} x^4 \mathrm{d}x = \frac{2}{5}$$

故所求的度量矩阵为：


$$\boldsymbol{A} = \begin{bmatrix} 2 & 0 & \frac{2}{3} \\ 0 & \frac{2}{3} & 0 \\ \frac{2}{3} & 0 & \frac{2}{5} \end{bmatrix}$$

---

**(3) 计算 $f(x) = 1 - x + x^2$ 和 $g(x) = 1 - 4x - 5x^2$ 的内积**

根据内积的定义，直接进行积分计算：


$$(f, g) = \int_{-1}^{1} (1 - x + x^2)(1 - 4x - 5x^2)\mathrm{d}x$$

先将积分号内的多项式展开并合并同类项：


$$\begin{aligned} (1 - x + x^2)(1 - 4x - 5x^2) &= 1 - 4x - 5x^2 - x + 4x^2 + 5x^3 + x^2 - 4x^3 - 5x^4 \\ &= 1 - 5x + x^3 - 5x^4 \end{aligned}$$

代回积分式，利用奇函数在对称区间积分为 $0$ 的性质（即 $x$ 和 $x^3$ 的积分为 $0$）：


$$(f, g) = \int_{-1}^{1} (1 - 5x - 5x^4 + x^3)\mathrm{d}x = \int_{-1}^{1} (1 - 5x^4)\mathrm{d}x$$

计算偶函数的积分：


$$(f, g) = 2 \int_{0}^{1} (1 - 5x^4)\mathrm{d}x = 2 \left[ x - x^5 \right]_0^1 = 2(1 - 1) = 0$$

因此，$f(x)$ 和 $g(x)$ 的内积为 $0$。
%%
%%

## 习题32

%%example {title: "习题32", icon: "📝"}
在欧氏空间 $V$ 中, 设 $W$ 是 $V$ 的线性子空间, $\boldsymbol{\alpha}=(\alpha_1, \alpha_2, \alpha_3)^\mathrm{T}$ 为给定向量, 分别求 $\boldsymbol{\alpha}$ 在 $XOY$ 平面与 $X$ 轴上的最佳逼近.
%%fold {title: "解答", icon: "📂"}
**解：**

设欧氏空间 $V$ 为 $\mathbb{R}^3$，取其自然标准正交基为 $\boldsymbol{e}_1 = (1, 0, 0)^\mathrm{T}, \boldsymbol{e}_2 = (0, 1, 0)^\mathrm{T}, \boldsymbol{e}_3 = (0, 0, 1)^\mathrm{T}$。
根据最佳逼近定理，向量 $\boldsymbol{\alpha}$ 在线性子空间 $W$ 上的最佳逼近，即为 $\boldsymbol{\alpha}$ 在 $W$ 上的正交投影向量。

**1. 求 $\boldsymbol{\alpha}$ 在 $XOY$ 平面上的最佳逼近**

$XOY$ 平面对应的线性子空间为 $W_1 = \text{span}(\boldsymbol{e}_1, \boldsymbol{e}_2)$。
由于 $\boldsymbol{e}_1, \boldsymbol{e}_2$ 为标准正交基，向量 $\boldsymbol{\alpha}$ 在 $W_1$ 上的正交投影 $\boldsymbol{\beta}_1$ 为：


$$\boldsymbol{\beta}_1 = (\boldsymbol{\alpha}, \boldsymbol{e}_1)\boldsymbol{e}_1 + (\boldsymbol{\alpha}, \boldsymbol{e}_2)\boldsymbol{e}_2$$


计算内积：


$$(\boldsymbol{\alpha}, \boldsymbol{e}_1) = \alpha_1, \quad (\boldsymbol{\alpha}, \boldsymbol{e}_2) = \alpha_2$$


代入得：


$$\boldsymbol{\beta}_1 = \alpha_1(1, 0, 0)^\mathrm{T} + \alpha_2(0, 1, 0)^\mathrm{T} = (\alpha_1, \alpha_2, 0)^\mathrm{T}$$


因此，$\boldsymbol{\alpha}$ 在 $XOY$ 平面上的最佳逼近为 $(\alpha_1, \alpha_2, 0)^\mathrm{T}$。

**2. 求 $\boldsymbol{\alpha}$ 在 $X$ 轴上的最佳逼近**

$X$ 轴对应的线性子空间为 $W_2 = \text{span}(\boldsymbol{e}_1)$。
向量 $\boldsymbol{\alpha}$ 在 $W_2$ 上的正交投影 $\boldsymbol{\beta}_2$ 为：


$$\boldsymbol{\beta}_2 = (\boldsymbol{\alpha}, \boldsymbol{e}_1)\boldsymbol{e}_1$$


代入内积计算结果，得：


$$\boldsymbol{\beta}_2 = \alpha_1(1, 0, 0)^\mathrm{T} = (\alpha_1, 0, 0)^\mathrm{T}$$


因此，$\boldsymbol{\alpha}$ 在 $X$ 轴上的最佳逼近为 $(\alpha_1, 0, 0)^\mathrm{T}$。
%%
%%

## 习题33

%%example {title: "习题33", icon: "📝"}
33. 设 Hermite 矩阵 $\boldsymbol{A} = \begin{bmatrix} 1 & 1+\mathrm{i} & \mathrm{i} \\ 1-\mathrm{i} & 5 & 0 \\ -\mathrm{i} & 0 & 2 \end{bmatrix}$, 判断矩阵 $\boldsymbol{A}$ 的正负定。
%%fold {title: "解答", icon: "📂"}
**解：**

为了判断 Hermite 矩阵 $\boldsymbol{A}$ 的正负定性，可以计算其各阶顺序主子式。

一阶顺序主子式：


$$\Delta_1 = 1 > 0$$

二阶顺序主子式：


$$\Delta_2 = \begin{vmatrix} 1 & 1+\mathrm{i} \\ 1-\mathrm{i} & 5 \end{vmatrix} = 1 \times 5 - (1+\mathrm{i})(1-\mathrm{i}) = 5 - (1^2 + 1^2) = 5 - 2 = 3 > 0$$

三阶顺序主子式（即矩阵 $\boldsymbol{A}$ 的行列式，这里按第一行展开）：
$$\begin{aligned}
\Delta_3 = |\boldsymbol{A}| &= \begin{vmatrix} 1 & 1+\mathrm{i} & \mathrm{i} \\ 1-\mathrm{i} & 5 & 0 \\ -\mathrm{i} & 0 & 2 \end{vmatrix} \\
&= 1 \cdot \begin{vmatrix} 5 & 0 \\ 0 & 2 \end{vmatrix} - (1+\mathrm{i}) \cdot \begin{vmatrix} 1-\mathrm{i} & 0 \\ -\mathrm{i} & 2 \end{vmatrix} + \mathrm{i} \cdot \begin{vmatrix} 1-\mathrm{i} & 5 \\ -\mathrm{i} & 0 \end{vmatrix} \\
&= 1 \cdot (10 - 0) - (1+\mathrm{i}) \cdot (2(1-\mathrm{i}) - 0) + \mathrm{i} \cdot (0 - 5(-\mathrm{i})) \\
&= 10 - 2(1+\mathrm{i})(1-\mathrm{i}) + 5\mathrm{i}^2 \\
&= 10 - 2(1^2 + 1^2) - 5 \\
&= 10 - 2(2) - 5 \\
&= 10 - 4 - 5 \\
&= 1 > 0
\end{aligned}$$

**结论：**
因为矩阵 $\boldsymbol{A}$ 的各阶顺序主子式均严格大于零（$\Delta_1 > 0, \Delta_2 > 0, \Delta_3 > 0$），根据 Sylvester 准则，该 Hermite 矩阵 $\boldsymbol{A}$ 是**正定矩阵**。
%%
%%

## 习题34

%%example {title: "习题34", icon: "📝"}
34. 设 $\boldsymbol{A} = \begin{bmatrix} 1 & \lambda & -1 \\ \lambda & 1 & -2 \\ -1 & -2 & 5 \end{bmatrix}$ 是实对称正定矩阵，求 $\lambda$ 的取值。
%%fold {title: "解答", icon: "📂"}
**解：**

根据实对称矩阵正定的充分必要条件（Sylvester 准则），矩阵 $\boldsymbol{A}$ 正定当且仅当其各阶顺序主子式均严格大于零。

一阶顺序主子式：


$$\Delta_1 = 1 > 0$$


（显然成立）

二阶顺序主子式：


$$\Delta_2 = \begin{vmatrix} 1 & \lambda \\ \lambda & 1 \end{vmatrix} = 1 - \lambda^2 > 0$$


解得：


$$-1 < \lambda < 1$$

三阶顺序主子式（即矩阵 $\boldsymbol{A}$ 的行列式，按第一行展开）：
$$\begin{aligned}
\Delta_3 = |\boldsymbol{A}| &= \begin{vmatrix} 1 & \lambda & -1 \\ \lambda & 1 & -2 \\ -1 & -2 & 5 \end{vmatrix} \\
&= 1 \cdot \begin{vmatrix} 1 & -2 \\ -2 & 5 \end{vmatrix} - \lambda \cdot \begin{vmatrix} \lambda & -2 \\ -1 & 5 \end{vmatrix} + (-1) \cdot \begin{vmatrix} \lambda & 1 \\ -1 & -2 \end{vmatrix} \\
&= 1 \cdot (5 - 4) - \lambda \cdot (5\lambda - 2) - 1 \cdot (-2\lambda - (-1)) \\
&= 1 - 5\lambda^2 + 2\lambda + 2\lambda - 1 \\
&= -5\lambda^2 + 4\lambda > 0
\end{aligned}$$
即 $\lambda(4 - 5\lambda) > 0$，解得：


$$0 < \lambda < \frac{4}{5}$$

综合以上条件，$\lambda$ 必须同时满足：


$$\begin{cases} -1 < \lambda < 1 \\ 0 < \lambda < \frac{4}{5} \end{cases}$$

取两者的交集，得到 $\lambda$ 的取值范围为：


$$0 < \lambda < \frac{4}{5}$$
%%
%%

## 习题35

%%example {title: "习题35", icon: "📝"}
设 $\boldsymbol{A}, \boldsymbol{B}$ 均为 Hermite 半正定矩阵, 判断如下命题是否为真: 若 $\text{tr}(\boldsymbol{AB})=0$, 则 $\boldsymbol{AB}=\boldsymbol{O}$。
%%fold {title: "解答", icon: "📂"}
**结论：该命题为真。**

**证明过程如下：**

1. **半正定矩阵的平方根分解**：
因为 $\boldsymbol{A}, \boldsymbol{B}$ 均为 Hermite 半正定矩阵，所以必然存在相应的 Hermite 半正定矩阵 $\boldsymbol{A}^{1/2}$ 和 $\boldsymbol{B}^{1/2}$，使得：

$$\boldsymbol{A} = \boldsymbol{A}^{1/2}\boldsymbol{A}^{1/2}, \quad \boldsymbol{B} = \boldsymbol{B}^{1/2}\boldsymbol{B}^{1/2}$$



并且 $(\boldsymbol{A}^{1/2})^\mathrm{H} = \boldsymbol{A}^{1/2}$，$(\boldsymbol{B}^{1/2})^\mathrm{H} = \boldsymbol{B}^{1/2}$。
2. **利用迹的循环性质**：
根据矩阵迹的循环置换不变性 $\text{tr}(\boldsymbol{XY}) = \text{tr}(\boldsymbol{YX})$，我们有：

$$\text{tr}(\boldsymbol{AB}) = \text{tr}(\boldsymbol{A}^{1/2}\boldsymbol{A}^{1/2}\boldsymbol{B}^{1/2}\boldsymbol{B}^{1/2}) = \text{tr}(\boldsymbol{B}^{1/2}\boldsymbol{A}^{1/2}\boldsymbol{A}^{1/2}\boldsymbol{B}^{1/2})$$


3. **构造范数形式**：
令矩阵 $\boldsymbol{C} = \boldsymbol{B}^{1/2}\boldsymbol{A}^{1/2}$。计算其共轭转置：

$$\boldsymbol{C}^\mathrm{H} = (\boldsymbol{B}^{1/2}\boldsymbol{A}^{1/2})^\mathrm{H} = (\boldsymbol{A}^{1/2})^\mathrm{H}(\boldsymbol{B}^{1/2})^\mathrm{H} = \boldsymbol{A}^{1/2}\boldsymbol{B}^{1/2}$$



将 $\boldsymbol{C}$ 和 $\boldsymbol{C}^\mathrm{H}$ 代入迹的表达式中：

$$\text{tr}(\boldsymbol{AB}) = \text{tr}(\boldsymbol{C}\boldsymbol{C}^\mathrm{H})$$


4. **根据迹为 0 推导零矩阵**：
对于任意复矩阵 $\boldsymbol{C}$，$\text{tr}(\boldsymbol{C}\boldsymbol{C}^\mathrm{H})$ 恰好等于 $\boldsymbol{C}$ 中所有元素模长的平方和（即 Frobenius 范数的平方 $\|\boldsymbol{C}\|_F^2$）。
已知 $\text{tr}(\boldsymbol{AB}) = 0$，则必然有 $\|\boldsymbol{C}\|_F^2 = 0$。
由矩阵范数的非负性可知，这当且仅当 $\boldsymbol{C}$ 为零矩阵，即：

$$\boldsymbol{C} = \boldsymbol{B}^{1/2}\boldsymbol{A}^{1/2} = \boldsymbol{O}$$


5. **得出最终结论**：
因为 $\boldsymbol{B}^{1/2}\boldsymbol{A}^{1/2} = \boldsymbol{O}$，对其两边取共轭转置，同样有：

$$\boldsymbol{A}^{1/2}\boldsymbol{B}^{1/2} = \boldsymbol{O}^\mathrm{H} = \boldsymbol{O}$$



最后，展开矩阵乘积 $\boldsymbol{AB}$：

$$\boldsymbol{AB} = (\boldsymbol{A}^{1/2}\boldsymbol{A}^{1/2})(\boldsymbol{B}^{1/2}\boldsymbol{B}^{1/2}) = \boldsymbol{A}^{1/2}(\boldsymbol{A}^{1/2}\boldsymbol{B}^{1/2})\boldsymbol{B}^{1/2}$$



将中间项代入零矩阵：

$$\boldsymbol{AB} = \boldsymbol{A}^{1/2}(\boldsymbol{O})\boldsymbol{B}^{1/2} = \boldsymbol{O}$$



证毕。
%%
%%

## 习题36

%%example {title: "习题36", icon: "📝"}
36. 设 $\boldsymbol{A} \in \mathbb{C}^{n \times n}$ 是 Hermite 矩阵, 证明
(1) $\boldsymbol{A}$ 的所有特征值均为实数;
(2) 若 $\boldsymbol{A}$ 是正定矩阵, 则 $\boldsymbol{A}$ 的所有特征值均为正实数.
%%fold {title: "解答", icon: "📂"}
**证明：**

**(1) 证明 $\boldsymbol{A}$ 的所有特征值均为实数**

设 $\lambda$ 为 Hermite 矩阵 $\boldsymbol{A}$ 的任意一个特征值，$\boldsymbol{x}$ 为对应的非零特征向量，则有：


$$\boldsymbol{Ax} = \lambda \boldsymbol{x}$$


等式两边左乘 $\boldsymbol{x}$ 的共轭转置 $\boldsymbol{x}^\mathrm{H}$，得到：


$$\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax} = \lambda \boldsymbol{x}^\mathrm{H}\boldsymbol{x}$$


对上述等式两边取共轭转置：


$$(\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax})^\mathrm{H} = (\lambda \boldsymbol{x}^\mathrm{H}\boldsymbol{x})^\mathrm{H}$$


因为 $\boldsymbol{A}$ 是 Hermite 矩阵，满足 $\boldsymbol{A}^\mathrm{H} = \boldsymbol{A}$，所以左边为：


$$(\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax})^\mathrm{H} = \boldsymbol{x}^\mathrm{H}\boldsymbol{A}^\mathrm{H}\boldsymbol{x} = \boldsymbol{x}^\mathrm{H}\boldsymbol{Ax}$$


右边展开为：


$$(\lambda \boldsymbol{x}^\mathrm{H}\boldsymbol{x})^\mathrm{H} = \bar{\lambda} \boldsymbol{x}^\mathrm{H}\boldsymbol{x}$$


从而可得：


$$\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax} = \bar{\lambda} \boldsymbol{x}^\mathrm{H}\boldsymbol{x}$$


比较以上两个关于 $\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax}$ 的等式，有：


$$\lambda \boldsymbol{x}^\mathrm{H}\boldsymbol{x} = \bar{\lambda} \boldsymbol{x}^\mathrm{H}\boldsymbol{x}$$


即：


$$(\lambda - \bar{\lambda}) \boldsymbol{x}^\mathrm{H}\boldsymbol{x} = 0$$


因为 $\boldsymbol{x}$ 是非零向量，所以其内积 $\boldsymbol{x}^\mathrm{H}\boldsymbol{x} > 0$。因此只能是：


$$\lambda - \bar{\lambda} = 0 \implies \lambda = \bar{\lambda}$$


即 $\lambda$ 是实数。这就证明了 Hermite 矩阵的所有特征值均为实数。

---

**(2) 证明若 $\boldsymbol{A}$ 是正定矩阵，则 $\boldsymbol{A}$ 的所有特征值均为正实数**

设 $\lambda$ 为正定 Hermite 矩阵 $\boldsymbol{A}$ 的任意一个特征值，$\boldsymbol{x}$ 为对应的非零特征向量，则：


$$\boldsymbol{Ax} = \lambda \boldsymbol{x}$$


同理，等式两边左乘 $\boldsymbol{x}^\mathrm{H}$，得到：


$$\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax} = \lambda \boldsymbol{x}^\mathrm{H}\boldsymbol{x}$$


因为 $\boldsymbol{A}$ 是正定矩阵，且 $\boldsymbol{x} \neq \boldsymbol{0}$，根据正定矩阵的定义，二次型必严格大于零，即：


$$\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax} > 0$$


同时，非零向量的内积满足：


$$\boldsymbol{x}^\mathrm{H}\boldsymbol{x} > 0$$


因此，特征值 $\lambda$ 可以表示为：


$$\lambda = \frac{\boldsymbol{x}^\mathrm{H}\boldsymbol{Ax}}{\boldsymbol{x}^\mathrm{H}\boldsymbol{x}}$$


由于分子和分母均严格大于零，故必有 $\lambda > 0$。
这就证明了正定 Hermite 矩阵的所有特征值均为正实数。
%%
%%

## 习题37

%%example {title: "习题37", icon: "📝"}
37. 设 $V = \{a \cos t + b \sin t \mid a, b \in \mathbb{R}\}$. $\forall f, g \in V$, 定义

$$(f, g) = f(0)g(0) + f\left(\frac{\pi}{2}\right)g\left(\frac{\pi}{2}\right)$$，


(1) 证明 $V$ 是二维实线性空间;
(2) 证明 $(f, g)$ 是 $V$ 上的内积;
(3) 求 $h(t) = 3 \cos(t+7) + 4 \sin(t+9)$ 的长度.
%%fold {title: "解答", icon: "📂"}
**(1) 证明 $V$ 是二维实线性空间**

**证明：**
由集合 $V = \{a \cos t + b \sin t \mid a, b \in \mathbb{R}\}$ 可知，空间 $V$ 是由函数 $\cos t$ 和 $\sin t$ 在实数域上张成的线性空间。
设存在实数 $c_1, c_2$ 使得对任意 $t \in \mathbb{R}$ 恒有：


$$c_1 \cos t + c_2 \sin t \equiv 0$$


分别取 $t = 0$ 和 $t = \frac{\pi}{2}$ 代入上式：
当 $t = 0$ 时，有 $c_1 \cos(0) + c_2 \sin(0) = c_1 = 0$。
当 $t = \frac{\pi}{2}$ 时，有 $c_1 \cos\left(\frac{\pi}{2}\right) + c_2 \sin\left(\frac{\pi}{2}\right) = c_2 = 0$。
由此可知 $c_1 = c_2 = 0$，说明函数向量组 $\cos t, \sin t$ 线性无关。
因此，$\cos t, \sin t$ 是 $V$ 的一组基，空间 $V$ 的维数为 2。故 $V$ 是二维实线性空间。

---

**(2) 证明 $(f, g)$ 是 $V$ 上的内积**

**证明：**
对任意 $f, g, p \in V$ 和任意实数 $k$，验证内积的四条公理：

1. **对称性**：

$$(f, g) = f(0)g(0) + f\left(\frac{\pi}{2}\right)g\left(\frac{\pi}{2}\right) = g(0)f(0) + g\left(\frac{\pi}{2}\right)f\left(\frac{\pi}{2}\right) = (g, f)$$


2. **可加性**：

$$\begin{aligned} (f+p, g) &= [f(0)+p(0)]g(0) + \left[f\left(\frac{\pi}{2}\right)+p\left(\frac{\pi}{2}\right)\right]g\left(\frac{\pi}{2}\right) \\ &= f(0)g(0) + f\left(\frac{\pi}{2}\right)g\left(\frac{\pi}{2}\right) + p(0)g(0) + p\left(\frac{\pi}{2}\right)g\left(\frac{\pi}{2}\right) \\ &= (f, g) + (p, g) \end{aligned}$$


3. **齐次性**：

$$(kf, g) = [kf(0)]g(0) + \left[kf\left(\frac{\pi}{2}\right)\right]g\left(\frac{\pi}{2}\right) = k\left[f(0)g(0) + f\left(\frac{\pi}{2}\right)g\left(\frac{\pi}{2}\right)\right] = k(f, g)$$


4. **正定性**：

$$(f, f) = (f(0))^2 + \left(f\left(\frac{\pi}{2}\right)\right)^2 \ge 0$$



且 $(f, f) = 0$ 当且仅当 $f(0) = 0$ 且 $f\left(\frac{\pi}{2}\right) = 0$。
设 $f(t) = a \cos t + b \sin t$，代入得：
$f(0) = a = 0$ 且 $f\left(\frac{\pi}{2}\right) = b = 0$。
从而 $f(t) \equiv 0$。

综上所述，四条公理均满足，故 $(f, g)$ 是 $V$ 上的内积。

---

**(3) 求 $h(t) = 3 \cos(t+7) + 4 \sin(t+9)$ 的长度**

**解：**
根据内积导出的长度定义，$\|h\| = \sqrt{(h, h)}$。
已知：


$$(h, h) = (h(0))^2 + \left(h\left(\frac{\pi}{2}\right)\right)^2$$


分别计算 $h(t)$ 在 $t=0$ 和 $t=\frac{\pi}{2}$ 处的值：


$$h(0) = 3 \cos 7 + 4 \sin 9$$

$$h\left(\frac{\pi}{2}\right) = 3 \cos\left(\frac{\pi}{2}+7\right) + 4 \sin\left(\frac{\pi}{2}+9\right) = -3 \sin 7 + 4 \cos 9$$


将其代入内积公式并展开：
$$\begin{aligned}
(h, h) &= (3 \cos 7 + 4 \sin 9)^2 + (-3 \sin 7 + 4 \cos 9)^2 \\
&= (9 \cos^2 7 + 24 \cos 7 \sin 9 + 16 \sin^2 9) + (9 \sin^2 7 - 24 \sin 7 \cos 9 + 16 \cos^2 9) \\
&= 9(\cos^2 7 + \sin^2 7) + 16(\sin^2 9 + \cos^2 9) + 24(\sin 9 \cos 7 - \cos 9 \sin 7)
\end{aligned}$$
利用三角恒等式 $\cos^2 x + \sin^2 x = 1$ 及两角差的正弦公式 $\sin(\alpha - \beta) = \sin \alpha \cos \beta - \cos \alpha \sin \beta$：
$$\begin{aligned}
(h, h) &= 9(1) + 16(1) + 24 \sin(9 - 7) \
&= 25 + 24 \sin 2
\end{aligned}$$
因此，$h(t)$ 的长度为：


$$\|h\| = \sqrt{25 + 24 \sin 2}$$
%%
%%

## 习题38

%%example {title: "习题38", icon: "📝"}
Write your note here.
%%fold {title: "解答", icon: "📂"}
Add collapsible content here.
%%
%%
