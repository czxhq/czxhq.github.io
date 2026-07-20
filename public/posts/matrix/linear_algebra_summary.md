---
title: "高等代数重要知识点总结"
slug: "matrix-exercise2"
date: "2026-05-14"
updated: "2026-05-14"
category: "数学/矩阵理论/高等代数重要知识点总结"
tags:
  - "Tutorial"
  - "Math"
summary: "高等代数重要知识点总结"
cover: ""
draft: false
featured: true
format: "md"
---

# 高等代数重要知识点总结

## 1. 正定

### Hermite正定矩阵

%%note {title: "等价条件", icon: "📝"}
1. 定义（二次型）：对任意非零复向量 $x \in \mathbb{C}^n$，$x^H A x > 0$（注：Hermite阵保证了 $x^H A x$ 必为实数）。

2. 特征值：$A$ 的所有特征值 $\lambda_i$ 均为正实数（$\lambda_i > 0$）。

3. 顺序主子式（Sylvester判别法）：$A$ 的所有各阶顺序主子式均为正实数。

4. 主子式：$A$ 的所有各阶主子式均为正实数。

5. Cholesky分解：存在主对角线元素全为正实数的下三角复矩阵 $L$，使得 $A = L L^H$。

6. 酉对角化：存在酉矩阵 $U$（满足 $U^H U = I$）和对角元全为正的实对角阵 $\Lambda$，使得 $A = U \Lambda U^H$。

7. 平方根阵：存在唯一的 Hermite 正定矩阵 $B$，使得 $A = B^2$（记为 $A^{1/2}$）。

%%

**证明**

为了证明，先证明两个定理

#### Schur定理

%%theorem {id="theorem-id" title="定理 s1.1 复数域上Schur定理"}
 对任意 $n$ 阶复矩阵 $A \in \mathbb{C}^{n \times n}$，必定存在一个酉矩阵 $U$ 和一个上三角矩阵 $T$，使得 $U^H A U = T$。
 
%%fold {title: "证明", icon: "📂"}
我们对矩阵的阶数 $n$ 使用数学归纳法。
步骤 1：当 $n = 1$ 时一个 $1 \times 1$ 的矩阵本身就是上三角矩阵，取 $U = [1]$（显然是酉矩阵），定理自动成立。

步骤 2：假设归纳成立假设对于所有 $(n-1)$ 阶的复方阵，Schur 定理均成立。

步骤 3：证明对 $n$ 阶方阵 $A$ 也成立这一步是核心。因为我们在复数域 $\mathbb{C}$ 中，根据代数基本定理，矩阵 $A$ 的特征多项式在复数域内一定至少有一个根。设这个根（特征值）为 $\lambda_1$，其对应的非零特征向量为 $v_1$。我们将 $v_1$ 单位化，使其长度为 1。把 $v_1$ 扩充为复空间 $\mathbb{C}^n$ 的一组标准正交基。把这组基作为列向量，拼成一个 $n$ 阶的酉矩阵 $U_1 = \begin{bmatrix} v_1 & V_{rest} \end{bmatrix}$。我们来考察 $A$ 在这个新坐标系下的模样，即计算 $U_1^H A U_1$：$$U_1^H A U_1 = \begin{bmatrix} v_1^H \\ V_{rest}^H \end{bmatrix} A \begin{bmatrix} v_1 & V_{rest} \end{bmatrix} = \begin{bmatrix} v_1^H A v_1 & v_1^H A V_{rest} \\ V_{rest}^H A v_1 & V_{rest}^H A V_{rest} \end{bmatrix}$$我们重点观察左边的第一列：左上角：$v_1^H A v_1 = v_1^H (\lambda_1 v_1) = \lambda_1 (v_1^H v_1) = \lambda_1$。左下角：$V_{rest}^H A v_1 = V_{rest}^H (\lambda_1 v_1) = \lambda_1 (V_{rest}^H v_1)$。因为 $V_{rest}$ 里的列向量全都与 $v_1$ 正交，所以这个内积为 $\mathbf{0}$。于是，矩阵变成了这种形状：$$U_1^H A U_1 = \begin{bmatrix} \lambda_1 & * \\ \mathbf{0} & A_{n-1} \end{bmatrix}$$

右下角的 $A_{n-1}$ 是一个 $(n-1)$ 阶的复方阵。根据归纳假设，一定存在一个 $(n-1)$ 阶的酉矩阵 $Q$，使得 $Q^H A_{n-1} Q = T_{n-1}$（$T_{n-1}$ 是一个上三角阵）。接下来，我们利用 $Q$ 构造一个 $n$ 阶的新酉矩阵 $V$：$$V = \begin{bmatrix} 1 & 0 \\ 0 & Q \end{bmatrix}$$最后，我们把这两次坐标变换叠加上去，令最终的酉矩阵为 $U = U_1 V$。计算 $U^H A U$：$$(U_1 V)^H A (U_1 V) = V^H (U_1^H A U_1) V$$$$= \begin{bmatrix} 1 & 0 \\ 0 & Q^H \end{bmatrix} \begin{bmatrix} \lambda_1 & * \\ \mathbf{0} & A_{n-1} \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & Q \end{bmatrix}$$$$= \begin{bmatrix} \lambda_1 & *' \\ \mathbf{0} & Q^H A_{n-1} Q \end{bmatrix}$$$$= \begin{bmatrix} \lambda_1 & *' \\ \mathbf{0} & T_{n-1} \end{bmatrix}$$因为 $T_{n-1}$ 是上三角阵，而它左边全都是 $0$，左上角又是 $\lambda_1$，所以整个大矩阵已经变成了一个完美的大上三角矩阵 $T$。至此，通过数学归纳法，Schur 定理得证。这个过程本质上就是逐层剥离特征值，硬生生把一个稠密矩阵“削”成了上三角阵。
%%
%%

%%theorem {id="theorem-id1" title="定理 s1.2 实数域Schur定理"}
对于任意实方阵 $A \in \mathbb{R}^{n \times n}$，存在一个正交矩阵 $Q \in \mathbb{R}^{n \times n}$（满足 $Q^T Q = I$），使得：$$Q^T A Q = T$$其中，$T$ 是一个实拟上三角矩阵 (Quasi-upper triangular matrix)。即 $T$ 的主对角线上是由 $1 \times 1$ 实数块和 $2 \times 2$ 实矩阵块组成的分块矩阵，且主对角线下方全为 0。
%%fold {title: "证明", icon: "📂"}
第一步：奠基
当 $n = 1$ 时，矩阵本身就是 $1 \times 1$ 块，定理显然成立。当 $n = 2$ 时，矩阵本身就是一个 $2 \times 2$ 块，直接取 $Q = I$ 即可，定理也成立。（如果它有实根，还可以进一步化为两个 $1 \times 1$ 块）。

第二步：归纳假设假设对于所有阶数 $k < n$ 的实矩阵，实 Schur 定理均成立。

第三步：归纳推导（对 $n$ 阶实方阵 $A$）

因为 $A$ 是实多项式，它的特征方程在复数域 $\mathbb{C}$ 中必定有根。实系数多项式的根只有两种情况：至少有一个实根，或者只有成对出现的共轭复根。我们分这两种情况讨论：

情况 A：矩阵 $A$ 至少有一个实特征值设 $\lambda \in \mathbb{R}$ 是 $A$ 的一个实特征值，对应的特征向量为 $v \in \mathbb{R}^n$。将 $v$ 单位化，使其长度为 1。由于 $v$ 是一维的不变子空间，我们采用和复 Schur 定理完全一样的“剥离”手法：将 $v$ 扩充为 $\mathbb{R}^n$ 的一组标准正交基，并构成正交矩阵 $Q_1 = [v, V_{rest}]$。计算相似变换：$$Q_1^T A Q_1 = \begin{bmatrix} v^T \\ V_{rest}^T \end{bmatrix} A \begin{bmatrix} v & V_{rest} \end{bmatrix} = \begin{bmatrix} \lambda & * \\ \mathbf{0} & A_{n-1} \end{bmatrix}$$其中 $A_{n-1}$ 是一个 $(n-1) \times (n-1)$ 的实矩阵。根据归纳假设，$A_{n-1}$ 可以被正交矩阵 $Q_{n-1}$ 化为拟上三角阵。再用类似复数域的方法将 $Q_{n-1}$ 拼接到 $Q_1$ 上，即可将整个矩阵化为拟上三角阵。

情况 B：矩阵 $A$ 没有实特征值（这是实数域专属的难点！）如果 $A$ 没有实根，那它必定有一对共轭的复数特征值：$\lambda = \alpha + i\beta$ 和 $\bar{\lambda} = \alpha - i\beta$ （其中 $\alpha, \beta \in \mathbb{R}$ 且 $\beta \neq 0$）。设 $\lambda$ 对应的复特征向量为 $z = u + iw$，其中 $u, w \in \mathbb{R}^n$ 分别是实部和虚部向量。根据特征值定义 $Az = \lambda z$，我们代入实部和虚部：$$A(u + iw) = (\alpha + i\beta)(u + iw)$$展开右边：$$Au + iAw = (\alpha u - \beta w) + i(\beta u + \alpha w)$$由于等式两边的实部和虚部必须分别相等，我们得到了两个纯实数域的等式：$$Au = \alpha u - \beta w$$$$Aw = \beta u + \alpha w$$这就是最神奇的一步！观察这两个等式，你会发现：矩阵 $A$ 作用在 $u$ 和 $w$ 上产生的新向量，依然是由 $u$ 和 $w$ 线性组合而成的。这意味着，由实向量 $u$ 和 $w$ 张成的 2 维实空间 $W = \text{span}\{u, w\}$，是矩阵 $A$ 的一个实 2 维不变子空间！现在，我们在 $W$ 内部使用格拉姆-施密特正交化，找到一组标准正交基 $\{q_1, q_2\}$。然后，把 $\{q_1, q_2\}$ 扩充为整个 $\mathbb{R}^n$ 空间的标准正交基，构造正交矩阵：$$Q_1 = \begin{bmatrix} q_1 & q_2 & V_{rest} \end{bmatrix}$$考察 $A$ 在这个新坐标系下的表现：$$Q_1^T A Q_1 = \begin{bmatrix} q_1^T \\ q_2^T \\ V_{rest}^T \end{bmatrix} A \begin{bmatrix} q_1 & q_2 & V_{rest} \end{bmatrix}$$因为 $\{q_1, q_2\}$ 生成的空间 $W$ 是 $A$ 的不变子空间，所以 $A q_1$ 和 $A q_2$ 依然在 $W$ 内，它们与 $V_{rest}$ 中的所有向量都正交。因此，左下角会产生一个大块的零矩阵：$$Q_1^T A Q_1 = \begin{bmatrix} R_{11} & * \\ \mathbf{0} & A_{n-2} \end{bmatrix}$$这里：$R_{11}$ 是一个 $2 \times 2$ 的实矩阵（这就是拟上三角阵主对角线上的 $2 \times 2$ 块的来源！它容纳了那对共轭复根）。$A_{n-2}$ 是一个 $(n-2) \times (n-2)$ 的实矩阵。最后，对 $A_{n-2}$ 应用归纳假设，存在正交阵 $Q_{n-2}$ 使得它化为拟上三角阵。令 $V = \begin{bmatrix} I_2 & 0 \\ 0 & Q_{n-2} \end{bmatrix}$，最终的正交矩阵即为 $Q = Q_1 V$。至此，通过数学归纳法，实 Schur 定理得证。
%%
%%

#### 谱定理

%%theorem {id="theorem-id2" title="定理 s1.3 复数域谱定理"}
一个复方阵 $A$ 可以被酉对角化，当且仅当 $A$ 是正规矩阵。即存在酉矩阵 $U$（满足 $U^H U = I$）和对角矩阵 $\Lambda$，使得 $A = U \Lambda U^H \iff A^H A = A A^H$。
%%fold {title: "证明", icon: "📂"}
第一部分：证明必要性（若可酉对角化，则必为正规矩阵）

这一步非常直接，主要是利用矩阵转置共轭的运算性质。证明：假设 $A$ 可以被酉对角化，即存在酉矩阵 $U$ 和对角矩阵 $\Lambda$，使得：$$A = U \Lambda U^H$$我们分别计算 $A^H A$ 和 $A A^H$：首先，求 $A$ 的共轭转置：$$A^H = (U \Lambda U^H)^H = (U^H)^H \Lambda^H U^H = U \bar{\Lambda} U^H$$(注：对角矩阵的共轭转置就是对其主对角线元素取复共轭，记为 $\bar{\Lambda}$)计算 $A^H A$：$$A^H A = (U \bar{\Lambda} U^H) (U \Lambda U^H) = U \bar{\Lambda} (U^H U) \Lambda U^H = U \bar{\Lambda} I \Lambda U^H = U (\bar{\Lambda} \Lambda) U^H$$计算 $A A^H$：$$A A^H = (U \Lambda U^H) (U \bar{\Lambda} U^H) = U \Lambda (U^H U) \bar{\Lambda} U^H = U \Lambda I \bar{\Lambda} U^H = U (\Lambda \bar{\Lambda}) U^H$$因为 $\Lambda$ 和 $\bar{\Lambda}$ 都是对角矩阵，对角矩阵相乘满足交换律（对应的对角元相乘即可），所以 $\bar{\Lambda} \Lambda = \Lambda \bar{\Lambda}$。代回上式，显然有：$$A^H A = A A^H$$因此，$A$ 必然是正规矩阵。必要性得证。

---

第二部分：证明充分性（若为正规矩阵，则必可酉对角化）

这是定理的核心。证明它的最优雅的方法是借助线性代数中著名的 Schur 引理 (Schur's Triangularization Theorem)。Schur 引理前提（不在此处展开证明）：任何一个 $n$ 阶复方阵 $A$，都酉等价于一个上三角矩阵。也就是说，一定存在酉矩阵 $U$ 和上三角矩阵 $T$，使得 $A = U T U^H$。

证明：

已知 $A$ 是正规矩阵，即 $A^H A = A A^H$。根据 Schur 引理，设 $A = U T U^H$，其中 $U$ 是酉矩阵，$T$ 是上三角矩阵。我们要证明的是：因为 $A$ 是正规的，所以这个上三角矩阵 $T$ 其实是个对角矩阵。将 $A = U T U^H$ 和 $A^H = U T^H U^H$ 代入正规矩阵的定义式中：$$(U T^H U^H) (U T U^H) = (U T U^H) (U T^H U^H)$$$$U T^H (U^H U) T U^H = U T (U^H U) T^H U^H$$因为 $U^H U = I$，消去中间项，得：$$U (T^H T) U^H = U (T T^H) U^H$$等式两边同时左乘 $U^H$，右乘 $U$，得到：$$T^H T = T T^H$$这说明，与 $A$ 酉等价的上三角矩阵 $T$ 本身也是一个正规矩阵。接下来，我们比较 $T^H T$ 和 $T T^H$ 这两个矩阵的主对角线元素。设上三角矩阵 $T$ 的元素为 $t_{ij}$（当 $i > j$ 时，$t_{ij} = 0$）。考察 $T T^H$ 主对角线上的第一个元素（第 1 行与第 1 列的乘积）。由于 $T$ 是上三角阵，它的第 1 行是 $(t_{11}, t_{12}, \dots, t_{1n})$。$$(T T^H)_{11} = |t_{11}|^2 + |t_{12}|^2 + \dots + |t_{1n}|^2$$考察 $T^H T$ 主对角线上的第一个元素。$T^H$ 的第 1 行就是 $T$ 第 1 列的共轭。由于 $T$ 是上三角阵，其第 1 列除了第一个元素外全为 0，即 $( \bar{t}_{11}, 0, \dots, 0 )$。$$(T^H T)_{11} = |t_{11}|^2$$因为 $T T^H = T^H T$，所以它们左上角的第一个元素必须相等：$$|t_{11}|^2 + |t_{12}|^2 + \dots + |t_{1n}|^2 = |t_{11}|^2$$由此可推导出一个极其重要的结论：$$|t_{12}|^2 + \dots + |t_{1n}|^2 = 0 \implies t_{12} = t_{13} = \dots = t_{1n} = 0$$这意味着，上三角矩阵 $T$ 的第一行，除了主对角线上的 $t_{11}$ 之外，其余元素全为 0。

依次类推，考察第 2 个对角元素：由于第一行除 $t_{11}$ 外全为 0，在计算第 2 个对角元时，$T T^H$ 贡献的行和 $T^H T$ 贡献的列同样会迫使 $t_{23} = t_{24} = \dots = t_{2n} = 0$。通过这种方式一路比较下去（严格地说可以使用数学归纳法），我们可以得出对于所有的 $i < j$，都有 $t_{ij} = 0$。既然 $T$ 是上三角阵（主对角线下方全为0），现在又证明了主对角线上方也全为0，那么 $T$ 只能是一个对角矩阵。令 $\Lambda = T$。最终我们得出：$$A = U \Lambda U^H$$充分性得证。
%%
%%

证明
%%fold {title: "正定矩阵等价性证明", icon: "📂"}
我们将采用以下证明路径：
**(1) 定义 $\Rightarrow$ (6) 酉对角化 $\Rightarrow$ (2) 特征值 $\Rightarrow$ (7) 平方根阵 $\Rightarrow$ (4) 主子式 $\Rightarrow$ (3) 顺序主子式 $\Rightarrow$ (5) Cholesky分解 $\Rightarrow$ (1) 定义**

---

### **证明过程**

#### **第一步：(1) $\Rightarrow$ (6) 从定义推导酉对角化**

已知 $A$ 是 Hermite 矩阵（由题设注记默认），根据有限维空间的谱定理，Hermite 矩阵必然存在酉矩阵 $U$ （满足 $U^H U = I$）和实对角阵 $\Lambda$，使得：


$$A = U \Lambda U^H$$


对于 $\Lambda$ 中的任意对角元 $\lambda_i$，其对应的特征向量为 $u_i$（即 $U$ 的第 $i$ 列）。
根据条件(1)的定义，对任意非零向量 $x \in \mathbb{C}^n$ 都有 $x^H A x > 0$。取 $x = u_i$，则有：


$$u_i^H A u_i = u_i^H (\lambda_i u_i) = \lambda_i \|u_i\|^2 > 0$$


因为 $U$ 是酉矩阵，其列向量为单位向量（$\|u_i\|^2 = 1$），故 $\lambda_i > 0$。因此，$\Lambda$ 是对角元全为正的实对角阵。

#### **第二步：(6) $\Rightarrow$ (2) 从酉对角化推导特征值**

已知 $A = U \Lambda U^H$，其中 $\Lambda = \text{diag}(\lambda_1, \dots, \lambda_n)$ 且 $\lambda_i > 0$。
由于相似变换（此处为酉等价）不改变矩阵的特征值，$A$ 的特征值就是对角矩阵 $\Lambda$ 的对角线元素。
因此，$A$ 的所有特征值 $\lambda_i$ 均为正实数。

#### **第三步：(2) $\Rightarrow$ (7) 从特征值推导平方根阵**

已知 $A$ 为 Hermite 阵且特征值 $\lambda_i > 0$。由谱定理可作分解 $A = U \Lambda U^H$。
因为 $\lambda_i > 0$，我们可以对 $\Lambda$ 的每一个对角元开算术平方根，构造一个新的对角阵 $\Lambda^{1/2} = \text{diag}(\sqrt{\lambda_1}, \dots, \sqrt{\lambda_n})$。
令 $B = U \Lambda^{1/2} U^H$。
验证 $B$ 的性质：

* **Hermite 性**：$B^H = (U \Lambda^{1/2} U^H)^H = U (\Lambda^{1/2})^H U^H = U \Lambda^{1/2} U^H = B$。
* **正定性**：$B$ 的特征值为 $\sqrt{\lambda_i} > 0$，故 $B$ 为正定矩阵。
* **平方关系**：$B^2 = (U \Lambda^{1/2} U^H)(U \Lambda^{1/2} U^H) = U \Lambda^{1/2} (U^H U) \Lambda^{1/2} U^H = U \Lambda U^H = A$。
（注：由谱分解唯一性可知，这样的正定平方根阵是唯一的）。

#### **第四步：(7) $\Rightarrow$ (4) 从平方根阵推导主子式**

已知存在正定 Hermite 阵 $B$ 使得 $A = B^2$。因为 $B$ 正定且特征值大于0，所以 $B$ 是可逆矩阵。
任取 $A$ 的一个 $k$ 阶主子矩阵 $A_k$。可以通过某种置换矩阵 $P$ 将该主子矩阵移到左上角，即：


$$P^T A P = \begin{pmatrix} A_k & * \\ * & * \end{pmatrix}$$


对于任意非零向量 $y \in \mathbb{C}^k$，构造 $n$ 维向量 $x = P \begin{pmatrix} y \\ 0 \end{pmatrix}$，显然 $x \neq 0$。
计算二次型：


$$y^H A_k y = x^H A x = x^H B^2 x = x^H B^H B x = \|Bx\|^2$$


因为 $B$ 可逆，且 $x \neq 0$，所以 $Bx \neq 0$。因此 $\|Bx\|^2 > 0$，即 $y^H A_k y > 0$。
这说明任意主子矩阵 $A_k$ 自身也是正定矩阵。正定矩阵的特征值全为正，而行列式等于特征值之积，因此 $\det(A_k) > 0$。即 $A$ 的所有各阶主子式均为正实数。

#### **第五步：(4) $\Rightarrow$ (3) 从主子式推导顺序主子式**

这一步是显然的逻辑包含关系。
顺序主子式（取前 $k$ 行前 $k$ 列构成的主子矩阵的行列式）是主子式的一个特定子集。既然“所有”主子式都为正，那么“所有顺序主子式”自然均为正实数。

#### **第六步：(3) $\Rightarrow$ (5) 从顺序主子式推导Cholesky分解**

已知 $A$ 的所有顺序主子式 $\Delta_k > 0$。
在线性代数中，只要矩阵的所有顺序主子式非零，该矩阵就存在唯一的 LDU 分解（且不需要行交换）：


$$A = L_1 D U_1$$


其中 $L_1$ 为单位下三角阵，$U_1$ 为单位上三角阵，$D$ 为对角阵。
因为 $A = A^H$，两边取共轭转置得到 $A = U_1^H D^H L_1^H$。根据 LDU 分解的唯一性，必然有 $U_1 = L_1^H$，且 $D$ 为实对角阵。因此 $A = L_1 D L_1^H$。
根据分块矩阵的性质，$A$ 的第 $k$ 阶顺序主子式 $\Delta_k = d_1 d_2 \dots d_k$ （$d_i$ 为 $D$ 的对角元）。由于对所有 $k$ 都有 $\Delta_k > 0$，通过数学归纳法可得所有 $d_i > 0$。
此时，令 $D^{1/2} = \text{diag}(\sqrt{d_1}, \dots, \sqrt{d_n})$，并令 $L = L_1 D^{1/2}$。
$L$ 显然是一个主对角线元素全为正的下三角矩阵，且：


$$L L^H = (L_1 D^{1/2})(D^{1/2} L_1^H) = L_1 D L_1^H = A$$


这就证明了 Cholesky 分解的存在性。

#### **第七步：(5) $\Rightarrow$ (1) 从Cholesky分解回到定义**

已知存在主对角线元素全为正实数的下三角矩阵 $L$，使得 $A = L L^H$。
因为 $L$ 是下三角矩阵且对角线元素严格大于 0，所以 $\det(L) > 0$，$L$ 是可逆矩阵。这也意味着 $L^H$ 是可逆的。
对于任意非零复向量 $x \in \mathbb{C}^n$（$x \neq 0$），必然有 $L^H x \neq 0$。
我们将该向量代入二次型计算：


$$x^H A x = x^H (L L^H) x = (L^H x)^H (L^H x) = \|L^H x\|^2$$


因为 $L^H x$ 是非零向量，其复向量范数的平方必定严格大于 0，即：


$$x^H A x > 0$$

---

**结论：** 通过 $(1) \Rightarrow (6) \Rightarrow (2) \Rightarrow (7) \Rightarrow (4) \Rightarrow (3) \Rightarrow (5) \Rightarrow (1)$ 的闭环推导，这七个关于 Hermite 正定矩阵的命题互为充要条件，等价性得证。
%%
