export type Language = {
  slug: string
  label: string
  heading: string
  subheading?: string
  content: string
  dir?: "ltr" | "rtl"
}

// English
const ENGLISH_TEXT = `
Fogo: A High-Performance SVM Layer 1
Version 1.0

Abstract
This paper introduces Fogo, a novel layer 1 blockchain protocol delivering breakthrough performance in throughput, latency, and congestion management. As an extension of the Solana protocol, Fogo maintains full compatibility at the SVM execution layer, allowing existing Solana programs, tooling, and infrastructure to migrate seamlessly while achieving significantly higher performance and lower latency.

Fogo contributes three novel innovations:
• A unified client implementation based on pure Firedancer, unlocking performance levels unattainable by networks with slower clients—including Solana itself.
• Multi-local consensus with dynamic colocation, achieving block times and latencies far below those of any major blockchain.
• A curated validator set that incentivizes high performance and deters predatory behavior at the validator level.

These innovations deliver substantial performance gains while preserving the decentralization and robustness essential to a layer 1 blockchain.

1. Introduction
Blockchain networks face an ongoing challenge in balancing performance with decentralization and security. Today's blockchains suffer severe throughput limitations that make them unsuitable for global financial activity. Ethereum processes fewer than 50 transactions per second (TPS) on its base layer. Even the most centralized layer 2s handle less than 1,000 TPS. While Solana was designed for higher performance, limitations from client diversity currently cause congestion at 5,000 TPS. In contrast, traditional financial systems like NASDAQ, CME, and Eurex regularly process over 100,000 operations per second.

Latency presents another critical limitation for decentralized blockchain protocols. In financial markets—especially for price discovery on volatile assets—low latency is essential for market quality and liquidity. Traditional market participants operate with end-to-end latencies at millisecond or sub-millisecond scales. These speeds are only achievable when market participants can co-locate with the execution environment due to the speed of light constraints.

Traditional blockchain architectures use globally distributed validator sets that operate without geographic awareness, creating fundamental performance limitations. Light itself takes over 130 milliseconds to circumnavigate the globe at the equator, even traveling in a perfect circle—and real-world network paths involve additional distance and infrastructure delays. These physical limitations compound when consensus requires multiple communication rounds between validators. These inter-regional latencies compound when consensus requires multiple communication rounds between validators. As a result, networks must implement conservative block times and finality delays to maintain stability. Even under optimal conditions, a globally distributed consensus mechanism cannot overcome these basic networking delays.

As blockchains integrate further with the global financial system, users will demand performance comparable to today's centralized systems. Without careful design, meeting these demands could significantly compromise blockchain networks' decentralization and resilience. To address this challenge, we propose the Fogo layer one blockchain. Fogo's core philosophy is to maximize throughput and minimize latency through two key approaches: first, using the most performant client software on an optimally decentralized validator set; and second, embracing co-located consensus while preserving most of the decentralization benefits of global consensus.

2. Outline
The paper is broken down into sections covering the major design decisions around Fogo. Section 3 covers the relationship of Fogo to the Solana blockchain protocol and its strategy with regards to client optimization and diversity. Section 4 covers multi-local consensus, its practical implementation, and the tradeoffs it makes relative to global or local consensus. Section 5 covers Fogo's approach to initializing and maintaining the validator set. Section 6 covers prospective extensions that may be introduced after genesis.

3. Protocol and Clients
At a base layer Fogo starts by building on top of the most performant widely used blockchain protocol to date, Solana. The Solana network already comes with numerous optimization solutions, both in terms of protocol design and client implementations. Fogo targets maximum possible backwards compatibility with Solana, including full compatibility at the SVM execution layer and close compatibility with TowerBFT consensus, Turbine block propagation, Solana leader rotation and all other major components of the networking and consensus layers. This compatibility allows Fogo to easily integrate and deploy existing programs, tooling and infrastructure from the Solana ecosystem; as well as benefit from continuous upstream improvements in Solana.

However unlike Solana, Fogo will run with a single canonical client. This canonical client will be the highest performance major client running on Solana. This allows Fogo to achieve significantly higher performance because the network will always run at the speed of the fastest client. Whereas Solana, limited by client diversity will always be bottlenecked by the speed of the slowest client. For now and the foreseeable future this canonical client will be based on the Firedancer stack.

3.1 Firedancer
Firedancer is Jump Crypto's high-performance Solana-compatible client implementation, showing substantially higher transaction processing throughput than current validator clients through optimized parallel processing, memory management, and SIMD instructions.

Two versions exist: "Frankendancer," a hybrid using Firedancer's processing engine with the rust validator's networking stack, and the full Firedancer implementation with a complete C networking stack rewrite, currently in late-stage development.

Both versions maintain Solana protocol compatibility while maximizing performance. Once completed, the pure Firedancer implementation is expected to set new performance benchmarks, making it ideal for Fogo's high-throughput requirements. Fogo will start with a Frankendancer based network then eventually transition to pure Firedancer.

3.2 Canonical Clients vs. Client Diversity
Blockchain protocols operate through client software that implements their rules and specifications. While protocols define the rules of network operation, clients translate these specifications into executable software. The relationship between protocols and clients has historically followed different models, with some networks actively promoting client diversity while others naturally converge on canonical implementations.

Client diversity traditionally serves multiple purposes: it provides implementation redundancy, enables independent verification of protocol rules, and theoretically reduces the risk of network-wide software vulnerabilities. The Bitcoin network demonstrates an interesting precedent - while multiple client implementations exist, Bitcoin Core serves as the de facto canonical client, providing the reference implementation that defines practical network behavior.

However, in high-performance blockchain networks, the relationship between protocol and client implementation becomes more constrained. When a protocol approaches the physical limits of computing and networking hardware, the space for implementation diversity naturally contracts. At these performance boundaries, optimal implementations must converge on similar solutions as they confront the same physical limitations and performance requirements. Any significant deviation from optimal implementation patterns would result in degraded performance that makes the client non-viable for validator operation.

This dynamic is particularly visible in networks targeting minimum possible block times and maximum transaction throughput. In such systems, the theoretical benefits of client diversity become less relevant, as the overhead of maintaining compatibility between different client implementations can itself become a performance bottleneck. When pushing blockchain performance to physical limits, client implementations will necessarily share core architectural decisions, making the security benefits of implementation diversity largely theoretical.

3.3 Protocol Incentives for Performant Clients
While Fogo allows any conforming client implementation, its architecture naturally incentivizes using the highest-performing client available, driven by the practical demands of high-performance co-located operations.

Unlike traditional networks where geographic distance creates the main bottlenecks, Fogo's co-located design means client implementation efficiency directly determines validator performance. In this environment, network latency is minimal, making client speed the critical factor.

The network's dynamic block time and size parameters create economic pressure to maximize throughput. Validators must choose between using the fastest client or risking penalties and reduced revenue. Those running slower clients either risk missing blocks by voting for aggressive parameters or lose revenue by voting for conservative ones.

This creates natural selection for the most efficient client implementation. In Fogo's co-located environment, even small performance differences become significant - a slightly slower client will consistently underperform, leading to missed blocks and penalties. This optimization happens through validator self-interest, not protocol rules.

While client choice cannot be directly enforced by protocol, economic pressures naturally drive the network toward the most efficient implementation while maintaining competitive client development.

4. Multi-Local Consensus
Multi-local consensus represents a novel approach to blockchain consensus that dynamically balances the performance benefits of validator co-location with the security advantages of geographic distribution. The system allows validators to coordinate their physical locations across epochs while maintaining distinct cryptographic identities for different zones, enabling the network to achieve ultra-low latency consensus during normal operation while preserving the ability to fall back to global consensus when needed.

Fogo's multi-local consensus model draws inspiration from established practices in traditional financial markets, particularly the "follow the sun" trading model used in foreign exchange and other global markets. In traditional finance, market making and liquidity provision naturally migrate between major financial centers as the trading day progresses – from Asia to Europe to North America – allowing for continuous market operation while maintaining concentrated liquidity in specific geographic regions. This model has proven effective in traditional finance because it recognizes that while markets are global, the physical limitations of networking and human reaction times make some degree of geographic concentration necessary for optimal price discovery and market efficiency.

4.1 Zones and Zone Rotation
A zone represents a geographical area where validators co-locate to achieve optimal consensus performance. Ideally, a zone is a single data center where network latency between validators approaches hardware limits. However, zones can expand to encompass larger regions when necessary, trading some performance for practical considerations. The exact definition of a zone emerges through social consensus among validators rather than being strictly defined in the protocol. This flexibility allows the network to adapt to real-world infrastructure constraints while maintaining performance objectives.

The network's ability to rotate between zones serves multiple critical purposes:

1. Jurisdictional Decentralization: Regular zone rotation prevents the capture of consensus by any single jurisdiction. This maintains the network's resistance to regulatory pressure and ensures no single government or authority can exert long-term control over network operation.

2. Infrastructure Resilience: Data centers and regional infrastructure can fail for numerous reasons - natural disasters, power outages, networking issues, hardware failures, or maintenance requirements. Zone rotation ensures the network isn't permanently dependent on any single point of failure. Historical examples of major data center outages, such as those caused by severe weather events or power grid failures, demonstrate the importance of this flexibility.

3. Strategic Performance Optimization: Zones can be selected to optimize for specific network activities. For example, during epochs containing significant financial events (such as Federal Reserve announcements, major economic reports, or market opens), validators might choose to locate consensus near the source of this price-sensitive information. This capability allows the network to minimize latency for critical operations while maintaining flexibility for different use cases across epochs.

4.2 Key Management
The protocol implements a two-tier key management system that separates long-term validator identity from zone-specific consensus participation. Each validator maintains a global key pair that serves as their root identity in the network. This global key is used for high-level operations such as stake delegation, zone registration, and participation in global consensus. The global key should be secured with the highest possible security measures, as it represents the validator's ultimate authority in the network.

Validators can then delegate authority to zone-specific sub-keys through an on-chain registry program. These sub-keys are specifically authorized for consensus participation within designated co-location zones. This separation serves multiple security purposes: it allows validators to maintain different security models for different key types, it minimizes the exposure of global keys by keeping them offline during normal operation, and it reduces the risk of key compromise during physical infrastructure transitions between zones.

The delegation of zone-specific keys is managed through an on-chain program that maintains a registry of authorized zone keys for each validator. While validators can register new zone keys at any time using their global key, these registrations only take effect at epoch boundaries. This delay ensures that all network participants have time to verify and record new key delegations before they become active in consensus.

4.3 Zone Proposal and Activation
New zones can be proposed through an on-chain governance mechanism using global keys. However, to ensure network stability and give validators adequate time to prepare secure infrastructure, proposed zones have a mandatory delay period before they become eligible for selection. This delay, set as a protocol parameter, must be sufficiently long to allow validators to:

• Secure appropriate physical infrastructure in the new zone
• Establish secure key management systems for the new location
• Set up and test networking infrastructure
• Perform necessary security audits of the new facility
• Establish backup and recovery procedures

The delay period also serves as a security measure against potential attacks where a malicious actor might attempt to force consensus into a zone where they have infrastructural advantages. By requiring advance notice for new zones, the protocol ensures that all validators have a fair opportunity to establish presence in any zone that might be selected for consensus.

Only after a zone has completed this waiting period can it be selected through the regular zone voting process for future epochs. This careful approach to zone activation helps maintain network security and stability while still allowing for the addition of new strategic locations as network requirements evolve.

4.4 Zone Selection Voting Process
The selection of consensus zones occurs through an on-chain voting mechanism that balances the need for coordinated validator movement with network security. Validators must achieve quorum on each future epoch's co-location zone within a configurable quorum time before the epoch transition. In practice, the epoch schedule may be determined with some lead time, such that voting during epoch n selects the zone for epoch n + k. Votes are cast through an on-chain registry program using validators' global keys, with voting power weighted by stake. This process uses global keys rather than zone keys since it is not latency-sensitive and requires maximum security.

The voting process requires a supermajority of stake weight to establish quorum, ensuring that a small group of validators cannot unilaterally force a zone change. If validators fail to achieve quorum within the designated timeframe, the network automatically defaults to global consensus mode for the next epoch. This fallback mechanism ensures network continuity even when validators cannot agree on a co-location zone.

During the voting period, validators signal both their preferred zone for the next epoch and their target block time for that zone. This joint selection of location and performance parameters allows the network to optimize for both physical constraints and performance capabilities of each zone. Importantly, the voting period provides time for validators to prepare infrastructure in the selected zone, including warming up zone-specific keys and testing network connectivity. This preparation period is crucial for maintaining network stability during zone transitions.

4.5 Global Consensus Mode
Global consensus mode serves as both a fallback mechanism and a foundational safety feature of the protocol. While Fogo achieves its highest performance through zone-based consensus, the ability to fall back to global consensus ensures the network's continued operation under adverse conditions. In global consensus mode, the network operates with conservative parameters optimized for globally distributed validation: a fixed 400ms block time and reduced block size to accommodate higher network latencies between geographically dispersed validators.

The protocol enters global consensus mode through two primary paths:

• Failed Zone Selection: If validators fail to achieve quorum on the next epoch's consensus zone within the designated voting period, the network automatically defaults to global consensus for that epoch.

• Runtime Consensus Failure: If the current zone fails to achieve block finality within its designated timeout period during an epoch, the protocol immediately switches to global consensus mode for the remainder of that epoch. This fallback is "sticky" – once triggered mid-epoch, the network remains in global consensus until the next epoch transition, prioritizing stability over performance recovery.

In global consensus mode, validators participate using a designated key for global operation, which may or may not be one of their zone-specific keys, and the network maintains the same fork choice rules as zone-based consensus. While this mode sacrifices the ultra-low latency achievable in co-located zones, it provides a robust foundation for network continuity and demonstrates how Fogo maintains safety without sacrificing liveness under degraded conditions.

5. Validator Set
To achieve high performance and mitigate abusive MEV practices, Fogo will utilize a curated validator set. This is necessary because even a small fraction of under-provisioned validating nodes can prevent the network from reaching its physical performance limits. Initially, curation will operate through proof-of-authority before transitioning to direct permissioning by the validator set. By placing curation authority with the validator set, Fogo can enforce social layer punishment of abusive behavior like a traditional proof-of-authority system, but in a way that's no more centralized than the fork power that 2/3 of stake already holds in traditional PoS networks like Solana.

5.1 Size and Initial Configuration
Fogo maintains a permissioned validator set with a protocol-enforced minimum and maximum number of validators to ensure sufficient decentralization while optimizing for network performance. The initial target size will be approximately 20-50 validators, though this cap is implemented as a protocol parameter that can be adjusted as the network matures. At genesis, the initial validator set will be selected by a genesis authority, which will retain temporary permissions to manage validator set composition during the network's early stages.

5.2 Governance and Transitions
The genesis authority's control over validator set membership is designed to be temporary. After an initial period of network stabilization, this authority will transition to the validator set itself. Following this transition, changes to validator set membership will require a two-thirds supermajority of staked tokens, matching the same threshold required for protocol-level changes in proof-of-stake networks.

To prevent sudden changes that could destabilize the network, protocol parameters limit validator turnover rates. No more than a fixed percentage of the validator set can be replaced or ejected within a given time period, where this percentage is a tunable protocol parameter. This ensures gradual evolution of the validator set while maintaining network stability.

5.3 Participation Requirements
Validators must meet minimum delegated stake requirements to be eligible for the validator set, maintaining compatibility with Solana's economic model while adding the permissioned component. This dual requirement – sufficient stake and set approval – ensures that validators have both economic skin in the game and the operational capabilities to maintain network performance.

5.4 Rationale and Network Governance
The permissioned validator set does not materially impact network decentralization, as in any proof-of-stake network, a two-thirds supermajority of stake can already effect arbitrary changes to the protocol through forking. Instead, this mechanism provides a formal framework for the validator set to enforce beneficial network behaviors that might otherwise be difficult to encode in protocol rules.

For example, the ability to eject validators enables the network to respond to:

• Persistent performance issues that degrade network capabilities
• Abusive MEV extraction that damages network usability
• Network destabilizing behavior that can't be enforced directly in protocol, such as leaching but not forwarding Turbine blocks
• Other behaviors that, while potentially profitable for individual validators, harm the network's long-term value

This governance mechanism recognizes that while certain behaviors may be profitable in the short term, they can damage the network's long-term viability. By enabling the stake-weighted validator set to police such behaviors through membership control, Fogo aligns validator incentives with the network's long-term health without compromising the fundamental decentralization properties inherent to proof-of-stake systems.

6. Prospective Extensions
While Fogo's core innovations focus on multi-local consensus, client performance, and validator set management, several additional protocol extensions are under consideration for either genesis or post-launch implementation. These features would further enhance network functionality while maintaining backwards compatibility with the Solana ecosystem.

6.1 SPL Token Fee Payment
To enable broader network access and improve user experience, Fogo will potentially introduce a fee_payer_unsigned transaction type that allows transactions to be executed without SOL in the originating account. This feature, combined with an on-chain fee payment program, enables users to pay transaction fees using SPL tokens while maintaining protocol security and validator compensation.

The system works through an out of protocol permissionless relayer marketplace. Users construct transactions that include both their intended operations and an SPL token payment to compensate the eventual fee payer. These transactions can be validly signed without specifying a fee payer, allowing any party to complete them by adding their signature and paying the SOL fees. This mechanism effectively separates transaction authorization from fee payment, enabling accounts with zero SOL balance to interact with the network as long as they possess other valuable assets.

This feature is implemented through minimal protocol modifications, requiring only the addition of the new transaction type and an on-chain program to handle relayer compensation. The system creates an efficient market for transaction relay services while maintaining the security properties of the underlying protocol. Unlike more complex fee abstraction systems, this approach requires no changes to validator payment mechanisms or consensus rules.

7. Conclusion
Fogo represents a novel approach to blockchain architecture that challenges traditional assumptions about the relationship between performance, decentralization, and security. By combining high-performance client implementation with dynamic multi-local consensus and curated validator sets, the protocol achieves unprecedented performance without compromising the fundamental security properties of proof-of-stake systems. The ability to dynamically relocate consensus while maintaining geographic diversity provides both performance optimization and systemic resilience, while the protocol's fallback mechanisms ensure continuous operation under adverse conditions.

Through careful economic design, these mechanisms emerge naturally from validator incentives rather than through protocol enforcement, creating a robust and adaptable system. As blockchain technology continues to evolve, Fogo's innovations demonstrate how thoughtful protocol design can push the boundaries of performance while maintaining the security and decentralization properties that make blockchain networks valuable.
`

// Vietnamese
const VIETNAMESE_TEXT = `
Fogo: Lớp SVM Hiệu suất Cao 1
Phiên bản 1.0

Tóm tắt
Bài báo này giới thiệu Fogo, một giao thức blockchain lớp 1 mới mang lại hiệu suất đột phá
về thông lượng, độ trễ và quản lý tắc nghẽn. Là một phần mở rộng của
giao thức Solana, Fogo duy trì khả năng tương thích hoàn toàn ở lớp thực thi SVM, cho phép
các chương trình, công cụ và cơ sở hạ tầng Solana hiện có di chuyển liền mạch trong khi
đạt được hiệu suất cao hơn đáng kể và độ trễ thấp hơn.

Frog đóng góp ba cải tiến mới:
● Triển khai máy khách thống nhất dựa trên Firedancer thuần túy, mở khóa
mức hiệu suất mà các mạng có máy khách chậm hơn không thể đạt được—bao gồm cả chính Solana.
● Đồng thuận đa địa phương với đồng vị trí động, đạt được thời gian khối và độ trễ
thấp hơn nhiều so với bất kỳ blockchain lớn nào.
● Một bộ xác thực được quản lý khuyến khích hiệu suất cao và ngăn chặn hành vi săn mồi
ở cấp độ xác thực.
Những cải tiến này mang lại hiệu suất tăng đáng kể trong khi vẫn duy trì
tính phi tập trung và tính mạnh mẽ cần thiết cho một blockchain lớp 1.

1. Giới thiệu
Mạng lưới blockchain đang phải đối mặt với một thách thức liên tục trong việc cân bằng hiệu suất với
tính phi tập trung và bảo mật. Các blockchain ngày nay gặp phải những hạn chế nghiêm trọng về thông lượng, khiến chúng không phù hợp với hoạt động tài chính toàn cầu. Ethereum xử lý ít hơn 50
giao dịch mỗi giây (TPS) trên lớp cơ sở. Ngay cả lớp 2 tập trung nhất cũng chỉ xử lý
dưới 1.000 TPS. Mặc dù Solana được thiết kế để đạt hiệu suất cao hơn, nhưng những hạn chế từ
sự đa dạng của khách hàng hiện đang gây ra tình trạng tắc nghẽn ở mức 5.000 TPS. Ngược lại, các hệ thống tài chính truyền thống như NASDAQ, CME và Eurex thường xuyên xử lý hơn 100.000 giao dịch mỗi giây.

Độ trễ là một hạn chế quan trọng khác đối với các giao thức blockchain phi tập trung. Trong
thị trường tài chính—đặc biệt là để phát hiện giá của các tài sản biến động—độ trễ thấp là
thiết yếu cho chất lượng thị trường và tính thanh khoản. Những người tham gia thị trường truyền thống hoạt động với độ trễ từ đầu đến cuối ở mức mili giây hoặc dưới mili giây. Tốc độ này chỉ có thể đạt được khi những người tham gia thị trường có thể đồng bộ với môi trường thực thi do những hạn chế về tốc độ ánh sáng.

Các kiến trúc blockchain truyền thống sử dụng các bộ xác thực phân tán toàn cầu, hoạt động mà không cần nhận thức về địa lý, tạo ra những hạn chế cơ bản về hiệu suất. Bản thân ánh sáng mất hơn 130 mili giây để di chuyển vòng quanh địa cầu tại đường xích đạo, ngay cả khi di chuyển theo một vòng tròn hoàn hảo—và các đường dẫn mạng trong thế giới thực liên quan đến khoảng cách và độ trễ cơ sở hạ tầng bổ sung. Những hạn chế vật lý này càng trầm trọng hơn khi sự đồng thuận yêu cầu nhiều vòng giao tiếp giữa các trình xác thực. Độ trễ liên vùng này càng trầm trọng hơn khi sự đồng thuận yêu cầu nhiều vòng giao tiếp giữa các trình xác thực. Do đó, các mạng phải áp dụng thời gian khối thận trọng và độ trễ kết thúc để duy trì tính ổn định. Ngay cả trong điều kiện tối ưu, một cơ chế đồng thuận phân tán toàn cầu cũng không thể khắc phục được những độ trễ mạng cơ bản này.

Khi các blockchain tích hợp sâu hơn với hệ thống tài chính toàn cầu, người dùng sẽ yêu cầu
hiệu suất tương đương với các hệ thống tập trung hiện nay. Nếu không được thiết kế cẩn thận, việc đáp ứng những yêu cầu này có thể làm giảm đáng kể tính phi tập trung và khả năng phục hồi của mạng blockchain. Để giải quyết thách thức này, chúng tôi đề xuất blockchain lớp một Fogo. Triết lý cốt lõi của Fogo là tối đa hóa thông lượng và giảm thiểu độ trễ thông qua hai phương pháp chính: thứ nhất, sử dụng phần mềm máy khách hiệu suất cao nhất trên một tập hợp xác thực phi tập trung tối ưu; và thứ hai, áp dụng đồng thuận cùng vị trí trong khi vẫn duy trì hầu hết các lợi ích phi tập trung của đồng thuận toàn cầu.

2. Dàn ý
Bài báo được chia thành các phần, bao gồm các quyết định thiết kế chính liên quan đến Fogo.
Phần 3 trình bày mối quan hệ của Fogo với giao thức blockchain Solana và
chiến lược của nó liên quan đến việc tối ưu hóa và đa dạng hóa máy khách. Phần 4 trình bày về đồng thuận đa địa phương, việc triển khai thực tế và những ưu điểm của nó so với đồng thuận toàn cầu hoặc địa phương. Phần 5 trình bày về cách tiếp cận của Fogo trong việc khởi tạo và duy trì tập hợp xác thực. Phần 6 trình bày các phần mở rộng tiềm năng có thể được giới thiệu sau khi khởi tạo.

3. Giao thức và Máy khách
Ở lớp cơ sở, Fogo bắt đầu bằng việc xây dựng trên nền tảng của giao thức blockchain hiệu suất cao nhất được sử dụng rộng rãi cho đến nay, Solana. Mạng lưới Solana đã được trang bị nhiều giải pháp tối ưu hóa, cả về thiết kế giao thức lẫn triển khai máy khách. Fogo hướng đến khả năng tương thích ngược tối đa với Solana, bao gồm khả năng tương thích hoàn toàn ở lớp thực thi SVM và khả năng tương thích chặt chẽ với sự đồng thuận TowerBFT, lan truyền khối Turbine, luân chuyển người dẫn đầu Solana và tất cả các thành phần chính khác của lớp mạng và lớp đồng thuận. Khả năng tương thích này cho phép Fogo dễ dàng tích hợp và triển khai các chương trình, công cụ và cơ sở hạ tầng hiện có từ hệ sinh thái Solana; cũng như được hưởng lợi từ những cải tiến liên tục từ Solana.

Tuy nhiên, không giống như Solana, Fogo sẽ chạy với một máy khách chuẩn duy nhất. Máy khách chuẩn này sẽ là máy khách chính có hiệu suất cao nhất chạy trên Solana. Điều này cho phép Fogo đạt được hiệu suất cao hơn đáng kể vì mạng sẽ luôn chạy ở tốc độ của máy khách nhanh nhất. Trong khi Solana, bị giới hạn bởi tính đa dạng của máy khách, sẽ luôn bị
tắc nghẽn bởi tốc độ của máy khách chậm nhất. Hiện tại và trong tương lai gần, máy khách chính thống này sẽ dựa trên ngăn xếp Firedancer.

3.1 Firedancer
Firedancer là triển khai máy khách tương thích với Solana hiệu suất cao của Jump Crypto,
cho thấy thông lượng xử lý giao dịch cao hơn đáng kể so với các máy khách xác thực hiện tại
thông qua xử lý song song, quản lý bộ nhớ và các lệnh SIMD
được tối ưu hóa.

Có hai phiên bản: "Frankendancer", một phiên bản lai sử dụng công cụ xử lý của Firedancer với
ngăn xếp mạng của trình xác thực Rust, và phiên bản triển khai Firedancer đầy đủ với
việc viết lại ngăn xếp mạng C hoàn chỉnh, hiện đang trong giai đoạn phát triển cuối.

Cả hai phiên bản đều duy trì khả năng tương thích với giao thức Solana đồng thời tối đa hóa hiệu suất.
Sau khi hoàn thành, triển khai Firedancer thuần túy dự kiến sẽ thiết lập các chuẩn mực hiệu suất mới, lý tưởng cho các yêu cầu thông lượng cao của Fogo. Fogo sẽ bắt đầu với
một mạng lưới dựa trên Frankendancer sau đó cuối cùng chuyển sang Firedancer thuần túy.

3.2 Máy khách chuẩn so với Đa dạng Máy khách
Các giao thức blockchain hoạt động thông qua phần mềm máy khách triển khai các quy tắc và
thông số kỹ thuật của chúng. Trong khi các giao thức xác định các quy tắc hoạt động của mạng, máy khách dịch
các thông số kỹ thuật này thành phần mềm thực thi. Mối quan hệ giữa giao thức và
máy khách theo truyền thống đã tuân theo các mô hình khác nhau, với một số mạng tích cực thúc đẩy
tính đa dạng máy khách trong khi những mạng khác tự nhiên hội tụ vào các triển khai chuẩn.
Tính đa dạng máy khách theo truyền thống phục vụ nhiều mục đích: nó cung cấp tính dự phòng triển khai, cho phép xác minh độc lập các quy tắc giao thức và về mặt lý thuyết làm giảm
rủi ro về lỗ hổng phần mềm trên toàn mạng. Mạng Bitcoin thể hiện một
tiền lệ thú vị - trong khi tồn tại nhiều triển khai máy khách, Bitcoin Core đóng vai trò là
máy khách chuẩn trên thực tế, cung cấp triển khai tham chiếu xác định
hành vi thực tế của mạng.
Tuy nhiên, trong các mạng blockchain hiệu suất cao, mối quan hệ giữa giao thức
và triển khai máy khách trở nên hạn chế hơn. Khi một giao thức đạt đến
giới hạn vật lý của phần cứng máy tính và mạng, không gian cho tính đa dạng triển khai tự nhiên bị thu hẹp. Ở những ranh giới hiệu suất này, các triển khai tối ưu phải hội tụ về các giải pháp tương tự vì chúng phải đối mặt với cùng những hạn chế vật lý và yêu cầu về hiệu suất. Bất kỳ sai lệch đáng kể nào so với các mô hình triển khai tối ưu đều sẽ dẫn đến hiệu suất bị suy giảm, khiến máy khách không thể hoạt động được với trình xác thực. Điều này đặc biệt rõ ràng trong các mạng nhắm mục tiêu thời gian khối tối thiểu có thể và thông lượng giao dịch tối đa. Trong các hệ thống như vậy, lợi ích lý thuyết của tính đa dạng máy khách trở nên ít quan trọng hơn, vì chi phí duy trì khả năng tương thích giữa các triển khai máy khách khác nhau có thể tự nó trở thành một nút thắt cổ chai về hiệu suất. Khi đẩy hiệu suất blockchain đến giới hạn vật lý, các triển khai máy khách nhất thiết sẽ phải chia sẻ các quyết định kiến trúc cốt lõi, khiến lợi ích bảo mật của tính đa dạng máy khách phần lớn chỉ mang tính lý thuyết.

3.3 Ưu đãi Giao thức cho Máy khách Hiệu suất Cao
Mặc dù Fogo cho phép bất kỳ triển khai máy khách nào tuân thủ, nhưng kiến trúc của nó tự nhiên khuyến khích việc sử dụng máy khách hiệu suất cao nhất hiện có, được thúc đẩy bởi nhu cầu thực tế của các hoạt động đồng đặt hiệu suất cao.
Không giống như các mạng lưới truyền thống, nơi khoảng cách địa lý tạo ra các nút thắt chính,
thiết kế đồng đặt của Fogo đồng nghĩa với việc hiệu suất triển khai của máy khách quyết định trực tiếp hiệu suất của trình xác thực. Trong môi trường này, độ trễ mạng là tối thiểu, khiến tốc độ máy khách trở thành yếu tố quan trọng.
Các tham số về thời gian khối và kích thước khối động của mạng tạo ra áp lực kinh tế để
tối đa hóa thông lượng. Trình xác thực phải lựa chọn giữa việc sử dụng máy khách nhanh nhất hoặc chấp nhận rủi ro
bị phạt và giảm doanh thu. Những máy khách chạy chậm hơn có nguy cơ bỏ lỡ khối bằng cách
bỏ phiếu cho các tham số tích cực hoặc mất doanh thu bằng cách bỏ phiếu cho các tham số thận trọng.
Điều này tạo ra sự lựa chọn tự nhiên cho việc triển khai máy khách hiệu quả nhất. Trong môi trường đồng đặt của Fogo, ngay cả những khác biệt nhỏ về hiệu suất cũng trở nên đáng kể - một máy khách chậm hơn một chút sẽ luôn hoạt động kém hiệu quả, dẫn đến việc bỏ lỡ khối và
bị phạt. Việc tối ưu hóa này diễn ra thông qua lợi ích cá nhân của người xác thực, chứ không phải thông qua các quy tắc giao thức.
Mặc dù lựa chọn của khách hàng không thể được thực thi trực tiếp bởi giao thức, nhưng áp lực kinh tế tự nhiên thúc đẩy mạng lưới hướng tới việc triển khai hiệu quả nhất trong khi vẫn duy trì sự phát triển cạnh tranh của khách hàng.

4. Đồng thuận Đa Địa phương
Đồng thuận Đa Địa phương đại diện cho một phương pháp tiếp cận mới đối với đồng thuận blockchain, cân bằng động giữa lợi ích hiệu suất của việc đặt chung máy xác thực với lợi thế bảo mật của việc phân bổ địa lý. Hệ thống cho phép các máy xác thực phối hợp các vị trí vật lý của họ trên các kỷ nguyên trong khi vẫn duy trì các danh tính mật mã riêng biệt cho các khu vực khác nhau, cho phép mạng đạt được sự đồng thuận với độ trễ cực thấp trong quá trình hoạt động bình thường, đồng thời vẫn duy trì khả năng chuyển sang đồng thuận toàn cầu khi cần.
Mô hình đồng thuận đa địa phương của Fogo lấy cảm hứng từ các thông lệ đã được thiết lập trên các thị trường tài chính truyền thống, đặc biệt là mô hình giao dịch "theo mặt trời" được sử dụng trong thị trường ngoại hối và các thị trường toàn cầu khác. Trong tài chính truyền thống, việc tạo lập thị trường và cung cấp thanh khoản tự nhiên di chuyển giữa các trung tâm tài chính lớn khi ngày giao dịch diễn ra
– từ Châu Á sang Châu Âu đến Bắc Mỹ – cho phép hoạt động thị trường liên tục trong khi
duy trì thanh khoản tập trung ở các khu vực địa lý cụ thể. Mô hình này đã chứng minh được tính hiệu quả trong tài chính truyền thống vì nó nhận ra rằng mặc dù thị trường mang tính toàn cầu, nhưng những hạn chế về mặt vật lý của mạng lưới và thời gian phản ứng của con người khiến một mức độ tập trung địa lý nhất định là cần thiết để khám phá giá và đạt hiệu quả thị trường tối ưu.

4.1 Vùng và Luân chuyển Vùng
Một vùng đại diện cho một khu vực địa lý nơi các bên xác thực cùng đặt trụ sở để đạt được hiệu suất đồng thuận tối ưu. Lý tưởng nhất, một vùng là một trung tâm dữ liệu duy nhất, nơi độ trễ mạng giữa các bên xác thực đạt đến giới hạn phần cứng. Tuy nhiên, các vùng có thể mở rộng để bao gồm các vùng lớn hơn khi cần thiết, đánh đổi một số hiệu suất để lấy những cân nhắc thực tế. Định nghĩa chính xác về một vùng xuất hiện thông qua sự đồng thuận xã hội giữa các bên xác thực thay vì được định nghĩa chặt chẽ trong giao thức. Tính linh hoạt này cho phép mạng lưới thích ứng với các hạn chế về cơ sở hạ tầng trong thế giới thực trong khi vẫn duy trì các mục tiêu về hiệu suất.

Khả năng luân chuyển giữa các vùng của mạng lưới phục vụ nhiều mục đích quan trọng:
1. Phân cấp thẩm quyền: Việc luân chuyển vùng thường xuyên ngăn chặn việc đạt được sự đồng thuận của bất kỳ thẩm quyền đơn lẻ nào. Điều này duy trì khả năng chống chịu của mạng trước áp lực pháp lý và đảm bảo không một chính phủ hay cơ quan nào có thể kiểm soát lâu dài hoạt động của mạng.
2. Khả năng phục hồi của cơ sở hạ tầng: Các trung tâm dữ liệu và cơ sở hạ tầng khu vực có thể bị lỗi vì nhiều lý do - thiên tai, mất điện, sự cố mạng, lỗi phần cứng hoặc yêu cầu bảo trì. Việc luân chuyển vùng đảm bảo mạng không phụ thuộc vĩnh viễn vào bất kỳ điểm lỗi nào. Các ví dụ lịch sử về các sự cố ngừng hoạt động lớn của trung tâm dữ liệu, chẳng hạn như do thời tiết khắc nghiệt hoặc sự cố lưới điện, chứng minh tầm quan trọng của tính linh hoạt này.
3. Tối ưu hóa hiệu suất chiến lược: Các vùng có thể được chọn để tối ưu hóa cho các hoạt động mạng cụ thể. Ví dụ: trong các giai đoạn có các sự kiện tài chính quan trọng (chẳng hạn như thông báo của Cục Dự trữ Liên bang, báo cáo kinh tế lớn hoặc mở cửa thị trường), các bên xác thực có thể chọn đặt sự đồng thuận gần nguồn thông tin nhạy cảm về giá này. Khả năng này cho phép mạng giảm thiểu độ trễ cho các hoạt động quan trọng đồng thời duy trì tính linh hoạt cho các trường hợp sử dụng khác nhau giữa các giai đoạn.

4.2 Quản lý Khóa
Giao thức triển khai hệ thống quản lý khóa hai tầng, tách biệt danh tính người xác thực dài hạn khỏi sự tham gia đồng thuận cụ thể theo vùng. Mỗi người xác thực duy trì một cặp khóa toàn cầu đóng vai trò là danh tính gốc của họ trong mạng. Khóa toàn cầu này được sử dụng cho các hoạt động cấp cao như ủy quyền cổ phần, đăng ký vùng và tham gia vào sự đồng thuận toàn cầu. Khóa toàn cầu cần được bảo mật bằng các biện pháp bảo mật cao nhất có thể, vì nó đại diện cho thẩm quyền tối cao của người xác thực trong mạng. Sau đó, người xác thực có thể ủy quyền cho các khóa phụ cụ thể theo vùng thông qua một chương trình đăng ký trên chuỗi. Các khóa phụ này được ủy quyền cụ thể cho sự tham gia đồng thuận trong các vùng đồng vị trí được chỉ định. Sự tách biệt này phục vụ nhiều mục đích bảo mật: nó cho phép người xác thực duy trì các mô hình bảo mật khác nhau cho các loại khóa khác nhau, nó giảm thiểu việc lộ khóa toàn cầu bằng cách giữ chúng trực tuyến trong quá trình hoạt động bình thường và nó giảm thiểu nguy cơ xâm phạm khóa trong quá trình chuyển đổi cơ sở hạ tầng vật lý giữa các vùng. Việc ủy quyền các khóa cụ thể cho từng vùng được quản lý thông qua một chương trình trên chuỗi, duy trì sổ đăng ký các khóa vùng được ủy quyền cho mỗi trình xác thực. Mặc dù trình xác thực có thể đăng ký các khóa vùng mới bất kỳ lúc nào bằng khóa toàn cục của mình, nhưng việc đăng ký này chỉ có hiệu lực tại các ranh giới kỷ nguyên. Sự chậm trễ này đảm bảo rằng tất cả các bên tham gia mạng có thời gian để xác minh và ghi lại các ủy quyền khóa mới trước khi chúng được kích hoạt trong cơ chế đồng thuận.

4.3 Đề xuất và Kích hoạt Vùng
Các vùng mới có thể được đề xuất thông qua cơ chế quản trị trên chuỗi bằng khóa toàn cục. Tuy nhiên, để đảm bảo tính ổn định của mạng và cho phép trình xác thực có đủ thời gian chuẩn bị cơ sở hạ tầng an toàn, các vùng được đề xuất có một khoảng thời gian trì hoãn bắt buộc trước khi đủ điều kiện để được lựa chọn. Độ trễ này, được thiết lập như một tham số giao thức, phải đủ dài để
cho phép các trình xác thực:
● Bảo mật cơ sở hạ tầng vật lý phù hợp trong vùng mới
● Thiết lập hệ thống quản lý khóa bảo mật cho địa điểm mới
● Thiết lập và kiểm tra cơ sở hạ tầng mạng
● Thực hiện các cuộc kiểm tra bảo mật cần thiết cho cơ sở mới
● Thiết lập các quy trình sao lưu và phục hồi
Thời gian trì hoãn cũng đóng vai trò là một biện pháp bảo mật chống lại các cuộc tấn công tiềm ẩn, trong đó
kẻ xấu có thể cố gắng ép buộc sự đồng thuận vào vùng mà chúng có
lợi thế về cơ sở hạ tầng. Bằng cách yêu cầu thông báo trước cho các vùng mới, giao thức
đảm bảo rằng tất cả các trình xác thực đều có cơ hội công bằng để thiết lập sự hiện diện trong bất kỳ vùng nào
có thể được chọn để đồng thuận.
Chỉ sau khi một vùng hoàn tất thời gian chờ này, nó mới có thể được chọn thông qua quy trình bỏ phiếu vùng thông thường cho các kỷ nguyên trong tương lai. Cách tiếp cận cẩn thận này đối với việc kích hoạt vùng giúp
duy trì an ninh và tính ổn định của mạng đồng thời vẫn cho phép bổ sung các địa điểm chiến lược mới
khi các yêu cầu mạng thay đổi.

4.4 Quy trình Biểu quyết Lựa chọn Vùng
Việc lựa chọn các vùng đồng thuận diễn ra thông qua cơ chế biểu quyết trên chuỗi, cân bằng giữa nhu cầu di chuyển của người xác thực được phối hợp với bảo mật mạng. Người xác thực phải đạt được số lượng tối thiểu cần thiết cho vùng đồng vị trí của mỗi kỷ nguyên tương lai trong khoảng thời gian tối thiểu có thể cấu hình trước khi chuyển đổi kỷ nguyên. Trên thực tế, lịch trình kỷ nguyên có thể được xác định trước một khoảng thời gian nhất định, sao cho việc bỏ phiếu trong kỷ nguyên n sẽ chọn vùng cho kỷ nguyên n + k. Việc bỏ phiếu được thực hiện thông qua một chương trình đăng ký trên chuỗi bằng cách sử dụng các khóa toàn cục của người xác thực, với quyền biểu quyết được tính theo cổ phần. Quy trình này sử dụng khóa toàn cục thay vì khóa vùng vì nó không nhạy cảm với độ trễ và yêu cầu bảo mật tối đa. Quy trình bỏ phiếu yêu cầu siêu đa số cổ phần để thiết lập số lượng tối thiểu, đảm bảo rằng một nhóm nhỏ người xác thực không thể đơn phương ép buộc thay đổi vùng. Nếu người xác thực không đạt được số lượng tối thiểu trong khung thời gian được chỉ định, mạng sẽ tự động mặc định chuyển sang chế độ đồng thuận toàn cục cho kỷ nguyên tiếp theo. Cơ chế dự phòng này đảm bảo tính liên tục của mạng ngay cả khi các bên xác thực không thể thống nhất về một vùng đồng vị trí. Trong giai đoạn bỏ phiếu, các bên xác thực sẽ báo hiệu cả vùng ưu tiên của họ cho kỷ nguyên tiếp theo và thời gian chặn mục tiêu của họ cho vùng đó. Việc lựa chọn chung các thông số về vị trí và hiệu suất này cho phép mạng tối ưu hóa cả các ràng buộc vật lý và khả năng hiệu suất của từng vùng. Quan trọng là, giai đoạn bỏ phiếu cung cấp thời gian để các bên xác thực chuẩn bị cơ sở hạ tầng trong vùng đã chọn, bao gồm việc khởi động các khóa cụ thể của vùng và kiểm tra kết nối mạng. Giai đoạn chuẩn bị này rất quan trọng để duy trì sự ổn định của mạng trong quá trình chuyển đổi vùng.

4.5 Chế độ Đồng thuận Toàn cầu
Chế độ đồng thuận toàn cầu vừa đóng vai trò là cơ chế dự phòng vừa là tính năng an toàn nền tảng của giao thức. Mặc dù Fogo đạt được hiệu suất cao nhất thông qua đồng thuận theo vùng, khả năng dự phòng trở lại đồng thuận toàn cầu đảm bảo mạng lưới tiếp tục hoạt động trong các điều kiện bất lợi. Ở chế độ đồng thuận toàn cầu, mạng lưới hoạt động với các tham số bảo thủ được tối ưu hóa cho việc xác thực phân tán toàn cầu: thời gian khối cố định 400ms và kích thước khối được giảm bớt để phù hợp với độ trễ mạng cao hơn giữa các trình xác thực phân tán về mặt địa lý.
Giao thức chuyển sang chế độ đồng thuận toàn cầu thông qua hai đường dẫn chính:
● Lựa chọn Vùng Thất bại: Nếu các trình xác thực không đạt được số lượng tối thiểu cần thiết trên vùng đồng thuận của kỷ nguyên tiếp theo trong khoảng thời gian bỏ phiếu được chỉ định, mạng lưới sẽ tự động mặc định chuyển sang đồng thuận toàn cầu cho kỷ nguyên đó.
● Lỗi Đồng thuận Thời gian Chạy: Nếu vùng hiện tại không đạt được trạng thái cuối cùng của khối trong khoảng thời gian chờ được chỉ định trong một kỷ nguyên, giao thức sẽ ngay lập tức chuyển sang chế độ đồng thuận toàn cầu trong phần còn lại của kỷ nguyên đó. Phương án dự phòng này mang tính "cố định" – một khi được kích hoạt giữa kỷ nguyên, mạng vẫn duy trì đồng thuận toàn cầu cho đến lần chuyển đổi kỷ nguyên tiếp theo, ưu tiên tính ổn định hơn là phục hồi hiệu suất.
Trong chế độ đồng thuận toàn cầu, các trình xác thực tham gia bằng cách sử dụng một khóa được chỉ định cho hoạt động toàn cầu, có thể là một trong các khóa cụ thể của vùng hoặc không, và mạng duy trì các quy tắc lựa chọn nhánh giống như đồng thuận dựa trên vùng. Mặc dù chế độ này hy sinh độ trễ cực thấp có thể đạt được trong các vùng cùng vị trí, nhưng nó cung cấp một nền tảng vững chắc cho tính liên tục của mạng và chứng minh cách Fogo duy trì tính an toàn mà không ảnh hưởng đến tính hoạt động trong điều kiện suy giảm.

5. Bộ Xác thực
Để đạt được hiệu suất cao và giảm thiểu các hoạt động lạm dụng MEV, Fogo sẽ sử dụng một bộ xác thực được quản lý. Điều này là cần thiết vì ngay cả một phần nhỏ các nút xác thực được cung cấp không đầy đủ cũng có thể ngăn mạng đạt đến giới hạn hiệu suất vật lý.
Ban đầu, việc quản lý sẽ hoạt động thông qua bằng chứng ủy quyền trước khi chuyển sang cấp phép trực tiếp bởi bộ xác thực. Bằng cách đặt quyền quản lý với bộ xác thực,
Fogo có thể thực thi hình phạt ở tầng xã hội đối với hành vi lạm dụng giống như hệ thống bằng chứng thẩm quyền truyền thống, nhưng theo cách không tập trung hơn quyền phân nhánh mà
2/3 cổ phần đã nắm giữ trong các mạng PoS truyền thống như Solana.

5.1 Kích thước và Cấu hình Ban đầu
Fogo duy trì một bộ xác thực được cấp phép với số lượng xác thực tối thiểu và
tối đa được thực thi bởi giao thức để đảm bảo tính phi tập trung phù hợp đồng thời tối ưu hóa hiệu suất mạng. Kích thước mục tiêu ban đầu sẽ vào khoảng 20-50 xác thực, mặc dù
giới hạn này được triển khai như một tham số giao thức có thể được điều chỉnh khi mạng trưởng thành. Ở giai đoạn khởi tạo, bộ xác thực ban đầu sẽ được chọn bởi một cơ quan genesis, cơ quan này
sẽ giữ các quyền tạm thời để quản lý việc thành lập bộ xác thực trong
giai đoạn đầu của mạng.

5.2 Quản trị và Chuyển đổi
Quyền kiểm soát của cơ quan genesis đối với tư cách thành viên bộ xác thực được thiết kế là
tạm thời. Sau giai đoạn ổn định mạng ban đầu, quyền này sẽ chuyển sang
chính bộ xác thực. Sau quá trình chuyển đổi này, các thay đổi đối với tư cách thành viên bộ xác thực sẽ
yêu cầu hai phần ba đại đa số token đã đặt cược, phù hợp với cùng ngưỡng
cần thiết cho các thay đổi ở cấp độ giao thức trong các mạng bằng chứng cổ phần.
Để ngăn chặn những thay đổi đột ngột có thể gây mất ổn định mạng, các tham số giao thức giới hạn
tốc độ luân chuyển của bộ xác thực. Không thể thay thế hoặc loại bỏ quá một tỷ lệ phần trăm cố định của bộ xác thực trong một khoảng thời gian nhất định, trong đó tỷ lệ phần trăm này là một tham số giao thức có thể điều chỉnh. Điều này đảm bảo sự phát triển dần dần của bộ xác thực trong khi vẫn duy trì tính ổn định của mạng.

5.3 Yêu cầu Tham gia
Các bộ xác thực phải đáp ứng các yêu cầu cổ phần được ủy quyền tối thiểu để đủ điều kiện tham gia
bộ xác thực, duy trì khả năng tương thích với mô hình kinh tế của Solana đồng thời bổ sung
thành phần được cấp phép. Yêu cầu kép này – cổ phần đầy đủ và phê duyệt bộ –
đảm bảo rằng các bộ xác thực vừa có lợi ích kinh tế vừa có khả năng vận hành để duy trì hiệu suất mạng.

5.4 Cơ sở lý luận và Quản trị Mạng
Bộ xác thực được cấp phép không ảnh hưởng đáng kể đến tính phi tập trung của mạng, vì trong
bất kỳ mạng lưới bằng chứng cổ phần nào, hai phần ba cổ phần đại đa số đã có thể tạo ra
những thay đổi tùy ý đối với giao thức thông qua phân nhánh. Thay vào đó, cơ chế này cung cấp một
khuôn khổ chính thức cho bộ xác thực để thực thi các hành vi mạng có lợi mà nếu không có nó,
sẽ khó mã hóa trong các quy tắc giao thức.
Ví dụ: khả năng loại bỏ các trình xác thực cho phép mạng phản hồi với:
● Các vấn đề hiệu suất dai dẳng làm giảm khả năng của mạng
● Khai thác MEV lạm dụng làm giảm khả năng sử dụng mạng
● Hành vi gây mất ổn định mạng không thể được thực thi trực tiếp trong giao thức, chẳng hạn như
lọc nhưng không chuyển tiếp các khối Turbine
● Các hành vi khác, mặc dù có khả năng mang lại lợi nhuận cho từng trình xác thực, nhưng lại gây hại cho
giá trị lâu dài của mạng
Cơ chế quản trị này nhận ra rằng mặc dù một số hành vi có thể mang lại lợi nhuận trong
ngắn hạn, nhưng chúng có thể gây tổn hại đến khả năng tồn tại lâu dài của mạng. Bằng cách cho phép bộ xác thực có trọng số cổ phần kiểm soát các hành vi như vậy thông qua kiểm soát thành viên, Fogo điều chỉnh các ưu đãi của bộ xác thực phù hợp với sức khỏe lâu dài của mạng lưới mà không ảnh hưởng đến các đặc tính phi tập trung cơ bản vốn có của các hệ thống bằng chứng cổ phần.

6. Các mở rộng tiềm năng
Trong khi các cải tiến cốt lõi của Fogo tập trung vào sự đồng thuận đa địa phương, hiệu suất máy khách và
quản lý bộ xác thực, một số mở rộng giao thức bổ sung đang được xem xét
cho việc triển khai ban đầu hoặc sau khi ra mắt. Các tính năng này sẽ nâng cao hơn nữa
chức năng mạng lưới trong khi vẫn duy trì khả năng tương thích ngược với
hệ sinh thái Solana.

6.1 Thanh toán Phí Token SPL
Để cho phép truy cập mạng rộng hơn và cải thiện trải nghiệm người dùng, Fogo có khả năng
giới thiệu loại giao dịch fee_payer_unsigned cho phép thực hiện các giao dịch
mà không cần SOL trong tài khoản khởi tạo. Tính năng này, kết hợp với chương trình thanh toán phí trên chuỗi,
cho phép người dùng thanh toán phí giao dịch bằng token SPL trong khi
duy trì bảo mật giao thức và bồi thường cho bộ xác thực.
Hệ thống hoạt động thông qua một thị trường chuyển tiếp không cần cấp phép ngoài giao thức. Người dùng
xây dựng các giao dịch bao gồm cả hoạt động dự định của họ và khoản thanh toán token SPL
để bồi thường cho người trả phí cuối cùng. Các giao dịch này có thể được ký hợp lệ
mà không cần chỉ định người trả phí, cho phép bất kỳ bên nào hoàn tất chúng bằng cách thêm
chữ ký của họ và thanh toán phí SOL. Cơ chế này tách biệt hiệu quả việc ủy quyền giao dịch khỏi việc thanh toán phí, cho phép các tài khoản có số dư SOL bằng 0 tương tác với
mạng miễn là họ sở hữu các tài sản có giá trị khác.
Tính năng này được triển khai thông qua các sửa đổi giao thức tối thiểu, chỉ cần
thêm loại giao dịch mới và một chương trình trên chuỗi để xử lý việc bồi thường cho người chuyển tiếp. Hệ thống tạo ra một thị trường hiệu quả cho các dịch vụ chuyển tiếp giao dịch trong khi
duy trì các thuộc tính bảo mật của giao thức cơ bản. Không giống như các hệ thống trừu tượng hóa phí phức tạp hơn, phương pháp này không yêu cầu thay đổi cơ chế thanh toán xác thực
hoặc các quy tắc đồng thuận.

7. Kết luận
Fogo đại diện cho một cách tiếp cận mới đối với kiến trúc blockchain, thách thức các giả định truyền thống
về mối quan hệ giữa hiệu suất, phi tập trung và bảo mật.
Bằng cách kết hợp triển khai máy khách hiệu suất cao với sự đồng thuận đa địa phương động và các bộ xác thực được quản lý, giao thức đạt được hiệu suất chưa từng có mà không ảnh hưởng đến các thuộc tính bảo mật cơ bản của hệ thống bằng chứng cổ phần. Khả năng di dời sự đồng thuận một cách linh hoạt trong khi vẫn duy trì tính đa dạng về mặt địa lý mang lại khả năng tối ưu hóa hiệu suất và khả năng phục hồi hệ thống, trong khi các cơ chế dự phòng của giao thức đảm bảo hoạt động liên tục trong các điều kiện bất lợi. Thông qua thiết kế kinh tế cẩn thận, các cơ chế này xuất hiện một cách tự nhiên từ các ưu đãi của trình xác thực thay vì thông qua việc thực thi giao thức, tạo ra một hệ thống mạnh mẽ và thích ứng. Khi công nghệ blockchain tiếp tục phát triển, những đổi mới của Fogo chứng minh cách thiết kế giao thức chu đáo có thể vượt qua ranh giới hiệu suất đồng thời duy trì các thuộc tính bảo mật và phi tập trung làm nên giá trị của mạng lưới blockchain.
`

// Indonesian
const INDONESIAN_TEXT = `
Fogo: SVM Berkinerja Tinggi Lapisan 1
Versi 1.0

Abstrak
Makalah ini memperkenalkan Fogo, sebuah protokol blockchain lapisan 1 baru yang menghadirkan terobosan
kinerja dalam manajemen throughput, latensi, dan kongesti. Sebagai perluasan dari protokol
Solana, Fogo mempertahankan kompatibilitas penuh pada lapisan eksekusi SVM, yang memungkinkan
program, perkakas, dan infrastruktur Solana yang ada untuk bermigrasi dengan lancar sekaligus
mencapai kinerja yang jauh lebih tinggi dan latensi yang lebih rendah.

Fogo menyumbangkan tiga inovasi baru:
● Implementasi klien terpadu berdasarkan Firedancer murni, membuka tingkat kinerja
yang tidak dapat dicapai oleh jaringan dengan klien yang lebih lambat—termasuk Solana itu sendiri.
● Konsensus multi-lokal dengan kolokasi dinamis, mencapai waktu blok dan latensi
jauh di bawah blockchain utama mana pun.
● Set validator terkurasi yang memberikan insentif kinerja tinggi dan mencegah perilaku predator
di tingkat validator. Inovasi-inovasi ini memberikan peningkatan kinerja yang substansial sekaligus mempertahankan
desentralisasi dan ketahanan yang esensial bagi blockchain lapisan 1.

1. Pendahuluan
Jaringan blockchain menghadapi tantangan berkelanjutan dalam menyeimbangkan kinerja dengan
desentralisasi dan keamanan. Blockchain saat ini menghadapi keterbatasan throughput yang parah
yang membuatnya tidak cocok untuk aktivitas keuangan global. Ethereum memproses kurang dari 50
transaksi per detik (TPS) pada lapisan dasarnya. Bahkan lapisan 2 yang paling tersentralisasi pun menangani
kurang dari 1.000 TPS. Meskipun Solana dirancang untuk kinerja yang lebih tinggi, keterbatasan dari
keragaman klien saat ini menyebabkan kemacetan pada 5.000 TPS. Sebaliknya, sistem keuangan tradisional
seperti NASDAQ, CME, dan Eurex secara teratur memproses lebih dari 100.000 operasi per
detik.
Latensi menghadirkan batasan kritis lainnya untuk protokol blockchain terdesentralisasi. Di
pasar keuangan—terutama untuk penemuan harga pada aset yang volatil—latensi rendah sangat
penting untuk kualitas dan likuiditas pasar. Pelaku pasar tradisional beroperasi dengan latensi ujung ke ujung pada skala milidetik atau sub-milidetik. Kecepatan ini hanya dapat dicapai ketika pelaku pasar dapat berada bersama lingkungan eksekusi karena adanya batasan kecepatan cahaya. Arsitektur blockchain tradisional menggunakan set validator yang terdistribusi secara global yang beroperasi tanpa kesadaran geografis, sehingga menciptakan keterbatasan kinerja yang mendasar. Cahaya sendiri membutuhkan waktu lebih dari 130 milidetik untuk mengelilingi dunia di ekuator, bahkan bergerak dalam lingkaran sempurna—dan jalur jaringan dunia nyata melibatkan jarak tambahan dan penundaan infrastruktur. Keterbatasan fisik ini bertambah ketika konsensus membutuhkan beberapa putaran komunikasi antar validator. Latensi antarwilayah ini bertambah ketika konsensus membutuhkan beberapa putaran komunikasi antar validator. Akibatnya, jaringan harus menerapkan waktu blok yang konservatif dan penundaan finalitas untuk menjaga stabilitas. Bahkan dalam kondisi optimal, mekanisme konsensus yang terdistribusi secara global tidak dapat mengatasi penundaan jaringan dasar ini. Seiring blockchain semakin terintegrasi dengan sistem keuangan global, pengguna akan menuntut kinerja yang sebanding dengan sistem terpusat saat ini. Tanpa desain yang cermat, memenuhi
tuntutan ini dapat secara signifikan membahayakan desentralisasi dan
ketahanan jaringan blockchain. Untuk mengatasi tantangan ini, kami mengusulkan blockchain lapis pertama Fogo. Filosofi inti
Fogo adalah memaksimalkan throughput dan meminimalkan latensi melalui dua pendekatan utama: pertama, menggunakan perangkat lunak klien dengan performa terbaik pada set validator yang terdesentralisasi secara optimal; dan kedua, menerapkan konsensus yang berlokasi bersama sambil mempertahankan sebagian besar
manfaat desentralisasi dari konsensus global.

2. Garis Besar
Makalah ini dibagi menjadi beberapa bagian yang mencakup keputusan desain utama seputar Fogo.
Bagian 3 membahas hubungan Fogo dengan protokol blockchain Solana dan
strateginya terkait optimasi dan diversitas klien. Bagian 4 membahas konsensus
multi-lokal, implementasi praktisnya, dan tradeos yang dibuatnya relatif terhadap konsensus global atau
lokal. Bagian 5 membahas pendekatan Fogo untuk menginisialisasi dan memelihara set
validator. Bagian 6 membahas ekstensi prospektif yang mungkin diperkenalkan setelah
genesis.

3. Protokol dan Klien
Pada lapisan dasar, Fogo memulai dengan membangun di atas protokol blockchain yang paling berkinerja dan paling banyak digunakan hingga saat ini, Solana. Jaringan Solana telah dilengkapi dengan berbagai solusi optimasi, baik dari segi desain protokol maupun implementasi klien. Fogo menargetkan kompatibilitas mundur semaksimal mungkin dengan Solana, termasuk kompatibilitas penuh pada lapisan eksekusi SVM dan kompatibilitas erat dengan konsensus TowerBFT, propagasi blok Turbin, rotasi pemimpin Solana, dan semua komponen utama lainnya dari lapisan jaringan dan konsensus. Kompatibilitas ini memungkinkan Fogo untuk dengan mudah mengintegrasikan dan menerapkan program, perkakas, dan infrastruktur yang ada dari ekosistem Solana; serta mendapatkan manfaat dari peningkatan hulu yang berkelanjutan di Solana.
Namun, tidak seperti Solana, Fogo akan berjalan dengan satu klien kanonik. Klien kanonik ini akan menjadi klien utama dengan kinerja tertinggi yang berjalan di Solana. Hal ini memungkinkan Fogo untuk mencapai kinerja yang jauh lebih tinggi karena jaringan akan selalu berjalan pada kecepatan klien tercepat. Sementara Solana, yang dibatasi oleh keragaman klien, akan selalu
terhambat oleh kecepatan klien yang paling lambat. Untuk saat ini dan di masa mendatang,
klien kanonik ini akan berbasis pada tumpukan Firedancer.

3.1 Firedancer
Firedancer adalah implementasi klien berkinerja tinggi yang kompatibel dengan Solana dari Jump Crypto,
yang menunjukkan throughput pemrosesan transaksi yang jauh lebih tinggi daripada klien validator
saat ini melalui pemrosesan paralel yang dioptimalkan, manajemen memori, dan instruksi SIMD.
Ada dua versi: "Frankendancer," sebuah hibrida yang menggunakan mesin pemrosesan Firedancer dengan
tumpukan jaringan validator rust, dan implementasi Firedancer lengkap dengan
penulisan ulang tumpukan jaringan C yang lengkap, yang saat ini sedang dalam tahap pengembangan akhir.
Kedua versi mempertahankan kompatibilitas protokol Solana sekaligus memaksimalkan kinerja.
Setelah selesai, implementasi Firedancer murni diharapkan dapat menetapkan tolok ukur kinerja
baru, sehingga ideal untuk persyaratan throughput tinggi Fogo. Fogo akan memulai dengan
jaringan berbasis Frankendancer, kemudian pada akhirnya beralih ke Firedancer murni.

3.2 Klien Kanonik vs. Keragaman Klien
Protokol Blockchain beroperasi melalui perangkat lunak klien yang mengimplementasikan aturan dan
spesifikasinya. Sementara protokol mendefinisikan aturan operasi jaringan, klien menerjemahkan
spesifikasi ini ke dalam perangkat lunak yang dapat dieksekusi. Hubungan antara protokol dan
klien secara historis mengikuti model yang berbeda, dengan beberapa jaringan secara aktif mempromosikan
keragaman klien sementara yang lain secara alami menyatu pada implementasi kanonik.
Keragaman klien secara tradisional memiliki beberapa tujuan: menyediakan redundansi implementasi, memungkinkan verifikasi independen terhadap aturan protokol, dan secara teoritis mengurangi
risiko kerentanan perangkat lunak di seluruh jaringan. Jaringan Bitcoin menunjukkan
preseden yang menarik - meskipun terdapat beberapa implementasi klien, Bitcoin Core berfungsi sebagai
klien kanonik de facto, menyediakan implementasi referensi yang mendefinisikan
perilaku jaringan praktis.
Namun, dalam jaringan blockchain berkinerja tinggi, hubungan antara protokol
dan implementasi klien menjadi lebih terbatas. Ketika sebuah protokol mendekati
batas fisik perangkat keras komputasi dan jaringan, ruang untuk keragaman implementasi
secara alami menyempit. Pada batas kinerja ini, implementasi optimal
harus konvergen pada solusi yang serupa karena menghadapi batasan fisik dan
persyaratan kinerja yang sama. Setiap penyimpangan signifikan dari pola implementasi optimal
akan mengakibatkan penurunan kinerja yang membuat klien tidak layak untuk
operasi validator.
Dinamika ini khususnya terlihat dalam jaringan yang menargetkan waktu blok seminimal mungkin
dan throughput transaksi maksimum. Dalam sistem seperti itu, manfaat teoretis dari keragaman
klien menjadi kurang relevan, karena beban untuk mempertahankan kompatibilitas antara
implementasi klien yang berbeda dapat menjadi hambatan kinerja. Ketika
mendorong kinerja blockchain ke batas fisik, implementasi klien tentu akan
berbagi keputusan arsitektur inti, sehingga manfaat keamanan dari keragaman
implementasi sebagian besar bersifat teoretis.

3.3 Insentif Protokol untuk Klien Berkinerja Tinggi
Meskipun Fogo memungkinkan implementasi klien yang sesuai, arsitekturnya secara alami
memberikan insentif untuk menggunakan klien berkinerja tertinggi yang tersedia, didorong oleh tuntutan praktis
dari operasi kolokasi berkinerja tinggi.
Tidak seperti jaringan tradisional di mana jarak geografis menciptakan hambatan utama,
desain kolokasi Fogo berarti efisiensi implementasi klien secara langsung menentukan
kinerja validator. Dalam lingkungan ini, latensi jaringan minimal, menjadikan
kecepatan klien sebagai faktor penting.
Parameter waktu dan ukuran blok dinamis jaringan menciptakan tekanan ekonomi untuk
memaksimalkan throughput. Validator harus memilih antara menggunakan klien tercepat atau menghadapi risiko
penalti dan penurunan pendapatan. Mereka yang menjalankan klien yang lebih lambat berisiko kehilangan blok dengan
memilih parameter agresif atau kehilangan pendapatan dengan memilih parameter konservatif.
Hal ini menciptakan seleksi alami untuk implementasi klien yang paling efisien. Dalam lingkungan kolokasi Fogo, bahkan perbedaan kinerja yang kecil pun menjadi signifikan - klien yang sedikit lebih lambat akan secara konsisten berkinerja buruk, yang menyebabkan blok yang terlewat dan penalti. Optimalisasi ini terjadi melalui kepentingan validator, bukan aturan protokol.
Meskipun pilihan klien tidak dapat secara langsung ditegakkan oleh protokol, tekanan ekonomi secara alami mendorong jaringan menuju implementasi yang paling efisien sambil mempertahankan pengembangan klien yang kompetitif.

4. Konsensus Multi-Lokal
Konsensus multi-lokal merupakan pendekatan baru untuk konsensus blockchain yang secara dinamis menyeimbangkan manfaat kinerja kolokasi validator dengan keunggulan keamanan dari distribusi geografis. Sistem ini memungkinkan validator untuk mengoordinasikan lokasi fisik mereka di seluruh epoch sambil mempertahankan identitas kriptografi yang berbeda untuk zona yang berbeda, memungkinkan jaringan untuk mencapai konsensus latensi yang sangat rendah selama operasi normal sambil mempertahankan kemampuan untuk kembali ke konsensus global saat dibutuhkan. Model konsensus multilokal Fogo terinspirasi dari praktik-praktik mapan di
pasar keuangan tradisional, khususnya model perdagangan "ikuti matahari" yang digunakan dalam valuta asing
dan pasar global lainnya. Dalam keuangan tradisional, pembentukan pasar dan penyediaan likuiditas
secara alami berpindah antar pusat keuangan utama seiring berjalannya hari perdagangan
– dari Asia ke Eropa hingga Amerika Utara – memungkinkan operasi pasar yang berkelanjutan sekaligus
mempertahankan likuiditas yang terkonsentrasi di wilayah geografis tertentu. Model ini telah terbukti
efektif dalam keuangan tradisional karena mengakui bahwa meskipun pasar bersifat global,
keterbatasan fisik jaringan dan waktu reaksi manusia membuat beberapa tingkat
konsentrasi geografis diperlukan untuk penemuan harga dan efisiensi pasar yang optimal.

4.1 Zona dan Rotasi Zona
Sebuah zona merepresentasikan wilayah geografis tempat validator ditempatkan bersama untuk mencapai kinerja
konsensus yang optimal. Idealnya, sebuah zona adalah pusat data tunggal di mana latensi jaringan
antarvalidator mendekati batas perangkat keras. Namun, zona dapat diperluas hingga
mencakup wilayah yang lebih luas bila diperlukan, dengan mengorbankan sebagian kinerja demi pertimbangan
praktis. Definisi zona yang tepat muncul melalui konsensus sosial di antara
validator, alih-alih didefinisikan secara ketat dalam protokol. Fleksibilitas ini memungkinkan
jaringan untuk beradaptasi dengan kendala infrastruktur dunia nyata sambil tetap mempertahankan tujuan
kinerja.
Kemampuan jaringan untuk berotasi antar zona memiliki beberapa tujuan penting:
1. Desentralisasi Yurisdiksi: Rotasi zona yang teratur mencegah tercapainya
konsensus oleh satu yurisdiksi saja. Hal ini menjaga ketahanan jaringan terhadap
tekanan regulasi dan memastikan tidak ada satu pemerintah atau otoritas pun yang dapat melakukan
kendali jangka panjang atas operasi jaringan.
2. Ketahanan Infrastruktur: Pusat data dan infrastruktur regional dapat gagal karena
berbagai alasan - bencana alam, pemadaman listrik, masalah jaringan, kegagalan
perangkat keras, atau persyaratan pemeliharaan. Rotasi zona memastikan jaringan tidak
bergantung secara permanen pada satu titik kegagalan. Contoh historis pemadaman
pusat data yang besar, seperti yang disebabkan oleh cuaca buruk atau kegagalan
jaringan listrik, menunjukkan pentingnya fleksibilitas ini. 3. Optimalisasi Kinerja Strategis: Zona dapat dipilih untuk mengoptimalkan
aktivitas jaringan tertentu. Misalnya, selama periode yang berisi peristiwa keuangan
penting (seperti pengumuman Federal Reserve, laporan ekonomi utama,
atau pembukaan pasar), validator dapat memilih untuk menempatkan konsensus di dekat
sumber informasi sensitif harga ini. Kemampuan ini memungkinkan jaringan untuk
meminimalkan latensi untuk operasi kritis sekaligus mempertahankan fleksibilitas untuk berbagai kasus penggunaan
di seluruh periode.

4.2 Manajemen Kunci
Protokol ini menerapkan sistem manajemen kunci dua tingkat yang memisahkan identitas validator jangka panjang dari partisipasi konsensus khusus zona. Setiap validator memelihara
pasangan kunci global yang berfungsi sebagai identitas akar mereka dalam jaringan. Kunci global ini digunakan untuk
operasi tingkat tinggi seperti pendelegasian stake, pendaftaran zona, dan partisipasi dalam
konsensus global. Kunci global harus diamankan dengan langkah-langkah keamanan setinggi mungkin,
karena kunci tersebut mewakili otoritas tertinggi validator dalam jaringan.
Validator kemudian dapat mendelegasikan otoritas kepada sub-kunci khusus zona melalui program registri on-chain. Sub-kunci ini secara khusus diotorisasi untuk partisipasi konsensus
dalam zona kolokasi yang telah ditentukan. Pemisahan ini memiliki beberapa tujuan keamanan:
memungkinkan validator untuk memelihara model keamanan yang berbeda untuk jenis kunci yang berbeda, meminimalkan
eksposur kunci global dengan menjaganya tetap online selama operasi normal, dan
mengurangi risiko kompromi kunci selama transisi infrastruktur fisik antar
zona. Pendelegasian kunci khusus zona dikelola melalui program on-chain yang
menyimpan registri kunci zona resmi untuk setiap validator. Meskipun validator dapat
mendaftarkan kunci zona baru kapan saja menggunakan kunci global mereka, pendaftaran ini hanya
berlaku pada batas epoch. Penundaan ini memastikan bahwa semua peserta jaringan memiliki waktu untuk
memverifikasi dan mencatat pendelegasian kunci baru sebelum mereka aktif dalam konsensus.

4.3 Proposal dan Aktivasi Zona
Zona baru dapat diusulkan melalui mekanisme tata kelola on-chain menggunakan kunci
global. Namun, untuk memastikan stabilitas jaringan dan memberi validator waktu yang cukup untuk mempersiapkan infrastruktur
yang aman, zona yang diusulkan memiliki periode penundaan wajib sebelum
memenuhi syarat untuk dipilih. Penundaan ini, yang ditetapkan sebagai parameter protokol, harus cukup lama agar
validator dapat:
● Mengamankan infrastruktur fisik yang sesuai di zona baru
● Menetapkan sistem manajemen kunci yang aman untuk lokasi baru
● Menyiapkan dan menguji infrastruktur jaringan
● Melakukan audit keamanan yang diperlukan untuk fasilitas baru
● Menetapkan prosedur pencadangan dan pemulihan
Periode penundaan juga berfungsi sebagai langkah keamanan terhadap potensi serangan di mana
aktor jahat mungkin mencoba memaksakan konsensus ke zona tempat mereka memiliki
keunggulan infrastruktur. Dengan mewajibkan pemberitahuan sebelumnya untuk zona baru, protokol
memastikan bahwa semua validator memiliki kesempatan yang adil untuk membangun kehadiran di zona mana pun yang
mungkin dipilih untuk konsensus.
Hanya setelah suatu zona menyelesaikan masa tunggu ini, zona tersebut dapat dipilih melalui proses pemungutan suara
zona reguler untuk periode mendatang. Pendekatan yang cermat terhadap aktivasi zona ini membantu
menjaga keamanan dan stabilitas jaringan sekaligus memungkinkan penambahan lokasi strategis
baru seiring perkembangan kebutuhan jaringan.

4.4 Proses Pemungutan Suara Pemilihan Zona
Pemilihan zona konsensus dilakukan melalui mekanisme pemungutan suara on-chain yang
menyeimbangkan kebutuhan pergerakan validator yang terkoordinasi dengan keamanan jaringan. Validator
harus mencapai kuorum pada setiap zona kolokasi epoch mendatang dalam waktu kuorum
yang dapat dikonfigurasi sebelum transisi epoch. Dalam praktiknya, jadwal epoch dapat
ditentukan dengan beberapa waktu tunggu, sehingga pemungutan suara selama epoch n memilih zona untuk
epoch n + k. Pemungutan suara dilakukan melalui program registri on-chain menggunakan kunci
global validator, dengan kekuatan pemungutan suara yang dibobot berdasarkan jumlah taruhan. Proses ini menggunakan kunci global, bukan kunci
zona karena tidak sensitif terhadap latensi dan membutuhkan keamanan maksimum.
Proses pemungutan suara membutuhkan bobot jumlah taruhan mayoritas super untuk membentuk kuorum, memastikan
bahwa sekelompok kecil validator tidak dapat secara sepihak memaksakan perubahan zona. Jika validator gagal
mencapai kuorum dalam jangka waktu yang ditentukan, jaringan secara otomatis beralih ke
mode konsensus global untuk epoch berikutnya. Mekanisme fallback ini memastikan kontinuitas jaringan
bahkan ketika validator tidak dapat menyetujui zona kolokasi.
Selama periode pemungutan suara, validator memberi sinyal zona pilihan mereka untuk epoch berikutnya
dan target waktu blok mereka untuk zona tersebut. Pemilihan lokasi dan parameter kinerja
ini bersama-sama memungkinkan jaringan untuk mengoptimalkan kendala fisik dan kemampuan kinerja
setiap zona. Yang terpenting, periode pemungutan suara menyediakan waktu bagi validator untuk
mempersiapkan infrastruktur di zona yang dipilih, termasuk pemanasan kunci khusus zona dan
menguji konektivitas jaringan. Periode persiapan ini krusial untuk menjaga stabilitas
jaringan selama transisi zona.

4.5 Mode Konsensus Global
Mode konsensus global berfungsi sebagai mekanisme fallback dan fitur keamanan mendasar
dari protokol. Meskipun Fogo mencapai kinerja tertingginya melalui konsensus berbasis zona,
kemampuan untuk kembali ke konsensus global memastikan keberlanjutan
operasi jaringan dalam kondisi yang sulit. Dalam mode konsensus global, jaringan beroperasi dengan parameter konservatif yang dioptimalkan untuk validasi terdistribusi global: waktu blok tetap 400 ms dan ukuran blok yang diperkecil untuk mengakomodasi latensi jaringan yang lebih tinggi antar validator yang tersebar secara geografis.
Protokol memasuki mode konsensus global melalui dua jalur utama:
● Pemilihan Zona yang Gagal: Jika validator gagal mencapai kuorum pada zona konsensus epoch berikutnya
dalam periode pemungutan suara yang ditentukan, jaringan secara otomatis akan
menggunakan konsensus global untuk epoch tersebut. ● Kegagalan Konsensus Runtime: Jika zona saat ini gagal mencapai finalitas blok dalam
periode waktu tunggu yang ditentukan selama suatu epoch, protokol segera beralih
ke mode konsensus global untuk sisa epoch tersebut. Fallback ini bersifat "lengket" –
setelah dipicu di tengah epoch, jaringan tetap berada dalam konsensus global hingga transisi
epoch berikutnya, memprioritaskan stabilitas daripada pemulihan kinerja.
Dalam mode konsensus global, validator berpartisipasi menggunakan kunci yang ditentukan untuk operasi global
, yang mungkin merupakan salah satu kunci spesifik zona mereka atau bukan, dan jaringan
mempertahankan aturan pilihan fork yang sama seperti konsensus berbasis zona. Meskipun mode ini mengorbankan
latensi ultra-rendah yang dapat dicapai di zona-zona yang berlokasi bersama, mode ini memberikan fondasi yang kuat untuk
kontinuitas jaringan dan menunjukkan bagaimana Fogo menjaga keamanan tanpa mengorbankan
kelangsungan dalam kondisi yang menurun.

5. Set Validator
Untuk mencapai kinerja tinggi dan memitigasi praktik MEV yang tidak semestinya, Fogo akan menggunakan
set validator yang dikurasi. Hal ini diperlukan karena bahkan sebagian kecil node validasi yang kurang terprovisi dapat mencegah jaringan mencapai batas kinerja fisiknya.
Awalnya, kurasi akan beroperasi melalui bukti otoritas sebelum beralih ke pemberian izin langsung oleh set validator. Dengan menempatkan otoritas kurasi pada set validator,
Fogo dapat menerapkan hukuman lapisan sosial atas perilaku penyalahgunaan seperti sistem bukti otoritas tradisional, tetapi dengan cara yang tidak lebih terpusat daripada kekuatan fork yang sudah dimiliki oleh 2/3 stake dalam jaringan PoS tradisional seperti Solana.

5.1 Ukuran dan Konfigurasi Awal
Fogo mempertahankan set validator berizin dengan jumlah validator minimum dan maksimum yang diberlakukan oleh protokol untuk memastikan desentralisasi yang memadai sekaligus mengoptimalkan kinerja jaringan. Ukuran target awal akan menjadi sekitar 20-50 validator, meskipun batas ini diimplementasikan sebagai parameter protokol yang dapat disesuaikan seiring perkembangan jaringan. Pada tahap genesis, set validator awal akan dipilih oleh otoritas genesis, yang
akan mempertahankan izin sementara untuk mengelola komposisi set validator selama
tahap awal jaringan.

5.2 Tata Kelola dan Transisi
Kontrol otoritas genesis atas keanggotaan set validator dirancang untuk bersifat
sementara. Setelah periode awal stabilisasi jaringan, otoritas ini akan beralih ke
set validator itu sendiri. Setelah transisi ini, perubahan pada keanggotaan set validator akan
memerlukan dua pertiga supermayoritas token yang dipertaruhkan, sesuai dengan ambang batas yang sama
yang diperlukan untuk perubahan tingkat protokol dalam jaringan proof-of-stake.
Untuk mencegah perubahan mendadak yang dapat mengganggu stabilitas jaringan, parameter protokol membatasi
tingkat pergantian validator. Tidak lebih dari persentase tetap dari set validator yang dapat
diganti atau dikeluarkan dalam jangka waktu tertentu, di mana persentase ini merupakan parameter protokol yang dapat disetel.
Hal ini memastikan evolusi bertahap dari set validator sambil menjaga
stabilitas jaringan. 5.3 Persyaratan Partisipasi
Validator harus memenuhi persyaratan minimum delegated stake agar memenuhi syarat untuk
set validator, menjaga kompatibilitas dengan model ekonomi Solana sekaligus menambahkan
komponen yang diizinkan. Persyaratan ganda ini – stake yang memadai dan persetujuan set –
memastikan bahwa validator memiliki kepentingan ekonomi dan kemampuan operasional
untuk mempertahankan kinerja jaringan.

5.4 Rasional dan Tata Kelola Jaringan
Set validator berizin tidak berdampak signifikan terhadap desentralisasi jaringan, karena dalam
jaringan proof-of-stake mana pun, mayoritas super dua pertiga saham sudah dapat memengaruhi
perubahan sewenang-wenang pada protokol melalui forking. Sebaliknya, mekanisme ini menyediakan
kerangka kerja formal bagi set validator untuk menegakkan perilaku jaringan yang bermanfaat yang mungkin
sulit dikodekan dalam aturan protokol. Misalnya, kemampuan untuk mengeluarkan validator memungkinkan jaringan untuk merespons:
● Masalah kinerja persisten yang menurunkan kapabilitas jaringan
● Ekstraksi MEV yang bersifat abusif dan merusak kegunaan jaringan
● Perilaku destabilisasi jaringan yang tidak dapat diterapkan secara langsung dalam protokol, seperti
melepaskan blok Turbin tetapi tidak meneruskannya
● Perilaku lain yang, meskipun berpotensi menguntungkan bagi masing-masing validator, merugikan
nilai jangka panjang jaringan
Mekanisme tata kelola ini mengakui bahwa meskipun perilaku tertentu mungkin menguntungkan
dalam jangka pendek, perilaku tersebut dapat merusak kelangsungan jaringan dalam jangka panjang. Dengan mengaktifkan
set validator berbobot saham untuk mengawasi perilaku tersebut melalui kontrol keanggotaan, Fogo
menyelaraskan insentif validator dengan kesehatan jangka panjang jaringan tanpa mengorbankan
properti desentralisasi fundamental yang melekat pada sistem proof-of-stake.

6. Ekstensi Prospektif
Meskipun inovasi inti Fogo berfokus pada konsensus multi-lokal, kinerja klien, dan
manajemen set validator, beberapa ekstensi protokol tambahan sedang dipertimbangkan
untuk implementasi genesis atau pasca-peluncuran. Fitur-fitur ini akan semakin meningkatkan
fungsionalitas jaringan sekaligus mempertahankan kompatibilitas mundur dengan ekosistem Solana.

6.1 Pembayaran Biaya Token SPL
Untuk memungkinkan akses jaringan yang lebih luas dan meningkatkan pengalaman pengguna, Fogo berpotensi
memperkenalkan jenis transaksi fee_payer_unsigned yang memungkinkan transaksi dieksekusi
tanpa SOL di akun asal. Fitur ini, dikombinasikan dengan program pembayaran biaya on-chain,
memungkinkan pengguna membayar biaya transaksi menggunakan token SPL sekaligus
menjaga keamanan protokol dan kompensasi validator.
Sistem ini bekerja melalui marketplace relayer tanpa izin di luar protokol. Pengguna
membuat transaksi yang mencakup operasi yang mereka inginkan dan pembayaran token SPL
untuk memberikan kompensasi kepada pembayar biaya di kemudian hari. Transaksi-transaksi ini dapat ditandatangani secara sah
tanpa menentukan pembayar biaya, sehingga memungkinkan pihak mana pun untuk menyelesaikannya dengan menambahkan
tanda tangan mereka dan membayar biaya SOL. Mekanisme ini secara efektif memisahkan otorisasi transaksi
dari pembayaran biaya, sehingga akun dengan saldo SOL nol dapat berinteraksi dengan
jaringan selama mereka memiliki aset berharga lainnya.
Fitur ini diimplementasikan melalui modifikasi protokol minimal, hanya memerlukan
penambahan jenis transaksi baru dan program on-chain untuk menangani kompensasi relayer. Sistem ini menciptakan pasar yang efisien untuk layanan relay transaksi sekaligus
mempertahankan properti keamanan protokol yang mendasarinya. Tidak seperti sistem abstraksi biaya yang lebih kompleks, pendekatan ini tidak memerlukan perubahan pada mekanisme pembayaran validator
atau aturan konsensus.

7. Kesimpulan
Fogo merupakan pendekatan baru terhadap arsitektur blockchain yang menantang asumsi tradisional
tentang hubungan antara kinerja, desentralisasi, dan keamanan. Dengan menggabungkan implementasi klien berkinerja tinggi dengan konsensus multi-lokal yang dinamis dan set validator yang terkurasi, protokol ini mencapai kinerja yang belum pernah terjadi sebelumnya, tanpa mengorbankan sifat keamanan fundamental sistem proof-of-stake. Kemampuan untuk merelokasi konsensus secara dinamis sambil mempertahankan keragaman geografis memberikan optimalisasi kinerja dan ketahanan sistemik, sementara mekanisme fallback protokol memastikan operasi berkelanjutan dalam kondisi yang sulit. Melalui desain ekonomi yang cermat, mekanisme ini muncul secara alami dari insentif validator, alih-alih melalui penegakan protokol, sehingga menciptakan sistem yang tangguh dan adaptif. Seiring dengan terus berkembangnya teknologi blockchain, inovasi Fogo menunjukkan bagaimana desain protokol yang cermat dapat mendorong batasan kinerja sekaligus mempertahankan sifat keamanan dan desentralisasi yang menjadikan jaringan blockchain berharga.
`

// Malaysian (Malay)
const MALAYSIAN_TEXT = `
Fogo: Lapisan SVM Berprestasi Tinggi 1
Versi 1.0

Abstrak
Makalah ini memperkenalkan Fogo, protokol blok blok lapisan 1 novel yang memberikan kejayaan
prestasi dalam pemprosesan, kependaman dan pengurusan kesesakan. Sebagai lanjutan daripada
Protokol Solana, Fogo mengekalkan keserasian penuh pada lapisan pelaksanaan SVM, membenarkan
program, peralatan dan infrastruktur Solana sedia ada untuk berhijrah dengan lancar semasa
mencapai prestasi yang jauh lebih tinggi dan kependaman yang lebih rendah.

Fogo menyumbang tiga inovasi baru:
● Pelaksanaan pelanggan bersatu berdasarkan Firedancer tulen, membuka kunci prestasi
tahap yang tidak boleh dicapai oleh rangkaian dengan pelanggan yang lebih perlahan—termasuk Solana sendiri.
● Konsensus berbilang tempatan dengan kolokasi dinamik, mencapai masa blok dan kependaman
jauh di bawah mana-mana rantaian utama.
● Set pengesah pilih susun yang memberi insentif kepada prestasi tinggi dan menghalang pemangsa
tingkah laku di peringkat pengesah.
Inovasi ini memberikan keuntungan prestasi yang besar sambil mengekalkan
desentralisasi dan keteguhan penting untuk rantaian blok lapisan 1.

1. Pengenalan
Rangkaian rantaian blok menghadapi cabaran berterusan dalam mengimbangi prestasi dengan
desentralisasi dan keselamatan. Blockchain hari ini menghadapi had daya pengeluaran yang teruk
yang menjadikan mereka tidak sesuai untuk aktiviti kewangan global. Ethereum memproses kurang daripada 50
transaksi sesaat (TPS) pada lapisan asasnya. Malah pemegang lapisan 2 yang paling terpusat
kurang daripada 1,000 TPS. Walaupun Solana direka untuk prestasi yang lebih tinggi, had daripada
kepelbagaian pelanggan pada masa ini menyebabkan kesesakan pada 5,000 TPS. Sebaliknya, kewangan tradisional
sistem seperti NASDAQ, CME dan Eurex kerap memproses lebih 100,000 operasi setiap
kedua.
Kependaman membentangkan satu lagi had kritikal untuk protokol blockchain terdesentralisasi. Dalam
pasaran kewangan—terutamanya untuk penemuan harga pada aset yang tidak menentu—pendaman rendah ialah
penting untuk kualiti dan kecairan pasaran. Peserta pasaran tradisional beroperasi dengan
latensi hujung ke hujung pada skala milisaat atau submilisaat. Kelajuan ini sahaja
boleh dicapai apabila peserta pasaran boleh lokasi bersama dengan persekitaran pelaksanaan disebabkan oleh
kelajuan kekangan cahaya.
Seni bina blockchain tradisional menggunakan set pengesah yang diedarkan secara global yang beroperasi
tanpa kesedaran geografi, mewujudkan had prestasi asas. Cahaya itu sendiri
mengambil masa lebih 130 milisaat untuk mengelilingi dunia di khatulistiwa, malah mengembara dalam
bulatan sempurna—dan laluan rangkaian dunia sebenar melibatkan jarak dan infrastruktur tambahan
kelewatan. Batasan fizikal ini terkumpul apabila konsensus memerlukan berbilang
pusingan komunikasi antara pengesah. Kompaun latensi antara wilayah ini
apabila konsensus memerlukan berbilang pusingan komunikasi antara pengesah. Akibatnya,
rangkaian mesti melaksanakan masa blok konservatif dan kelewatan akhir untuk dikekalkan
kestabilan. Walaupun dalam keadaan optimum, mekanisme konsensus yang diedarkan secara global
tidak dapat mengatasi kelewatan rangkaian asas ini.
Apabila blokchain disepadukan lagi dengan sistem kewangan global, pengguna akan menuntut
prestasi yang setanding dengan sistem berpusat hari ini. Tanpa reka bentuk yang teliti, pertemuan
tuntutan ini boleh menjejaskan desentralisasi rangkaian blockchain dengan ketara dan
daya tahan. Untuk menangani cabaran ini, kami mencadangkan blok Fogo lapisan satu. Fogo's
falsafah teras adalah untuk memaksimumkan daya pengeluaran dan meminimumkan kependaman melalui dua kunci
pendekatan: pertama, menggunakan perisian klien yang paling berprestasi pada terdesentralisasi secara optimum
set pengesah; dan kedua, menerima konsensus yang terletak bersama sambil mengekalkan sebahagian besar
faedah desentralisasi konsensus global.

2. Rangka
Kertas itu dipecahkan kepada bahagian yang meliputi keputusan reka bentuk utama di sekitar Fogo.
Bahagian 3 merangkumi hubungan Fogo dengan protokol rantaian Solana dannya
strategi berkenaan dengan pengoptimuman dan kepelbagaian pelanggan. Bahagian 4 merangkumi pelbagai tempatan
konsensus, pelaksanaan praktikalnya, dan tradeos yang dibuatnya relatif kepada global atau
konsensus tempatan. Bahagian 5 merangkumi pendekatan Fogo untuk memulakan dan mengekalkan
set pengesah. Seksyen 6 meliputi sambungan prospektif yang mungkin diperkenalkan selepas
genesis.

3. Protokol dan Pelanggan
Pada lapisan asas Fogo bermula dengan membina di atas yang paling berprestasi digunakan secara meluas
protokol blockchain setakat ini, Solana. Rangkaian Solana sudah datang dengan banyak
penyelesaian pengoptimuman, baik dari segi reka bentuk protokol dan pelaksanaan pelanggan. Fogo
menyasarkan keserasian ke belakang maksimum yang mungkin dengan Solana, termasuk penuh
keserasian pada lapisan pelaksanaan SVM dan keserasian rapat dengan TowerBFT
konsensus, perambatan blok turbin, putaran pemimpin Solana dan semua major lain
komponen rangkaian dan lapisan konsensus. Keserasian ini membolehkan Fogo untuk
menyepadukan dan menggunakan program, perkakas dan infrastruktur sedia ada dengan mudah daripada Solana
ekosistem; serta mendapat manfaat daripada penambahbaikan huluan berterusan di Solana.
Walau bagaimanapun, tidak seperti Solana, Fogo akan dijalankan dengan pelanggan kanonik tunggal. Pelanggan kanonik ini
akan menjadi pelanggan utama prestasi tertinggi yang dijalankan di Solana. Ini membolehkan Fogo untuk
mencapai prestasi yang jauh lebih tinggi kerana rangkaian akan sentiasa berjalan di
kelajuan pelanggan terpantas. Manakala Solana, terhad oleh kepelbagaian pelanggan akan sentiasa
tersekat oleh kelajuan pelanggan yang paling perlahan. Buat masa ini dan masa hadapan ini
pelanggan kanonik akan berdasarkan timbunan Firedancer.

3.1 Penari Api
Firedancer ialah pelaksanaan pelanggan serasi Solana berprestasi tinggi Jump Crypto,
menunjukkan daya pemprosesan transaksi yang jauh lebih tinggi daripada pengesah semasa
pelanggan melalui pemprosesan selari yang dioptimumkan, pengurusan memori dan SIMD
arahan.
Dua versi wujud: "Frankendancer," hibrid menggunakan enjin pemprosesan Firedancer dengan
timbunan rangkaian pengesah karat, dan pelaksanaan Firedancer penuh dengan a
menulis semula susunan rangkaian C lengkap, kini dalam pembangunan peringkat akhir.
Kedua-dua versi mengekalkan keserasian protokol Solana sambil memaksimumkan prestasi.
Setelah selesai, pelaksanaan Firedancer tulen dijangka akan menetapkan prestasi baharu
penanda aras, menjadikannya sesuai untuk keperluan pemprosesan tinggi Fogo. Fogo akan bermula dengan
rangkaian berasaskan Frankendancer kemudian akhirnya beralih kepada Firedancer tulen.

3.2 Pelanggan Kanonik lwn Kepelbagaian Pelanggan
Protokol Blockchain beroperasi melalui perisian pelanggan yang melaksanakan peraturan mereka dan
spesifikasi. Walaupun protokol mentakrifkan peraturan operasi rangkaian, pelanggan menterjemah
spesifikasi ini ke dalam perisian boleh laku. Hubungan antara protokol dan
pelanggan mengikut sejarah mengikut model yang berbeza, dengan beberapa rangkaian giat mempromosikan
kepelbagaian pelanggan manakala yang lain secara semula jadi menumpu pada pelaksanaan kanonik.
Kepelbagaian pelanggan secara tradisinya mempunyai pelbagai tujuan: ia menyediakan pelaksanaan
redundansi, membolehkan pengesahan bebas peraturan protokol, dan secara teorinya mengurangkan
risiko kelemahan perisian seluruh rangkaian. Rangkaian Bitcoin menunjukkan satu
duluan yang menarik - sementara pelbagai pelaksanaan pelanggan wujud, Bitcoin Core berfungsi sebagai
pelanggan kanonik de facto, menyediakan pelaksanaan rujukan yang mentakrifkan
tingkah laku rangkaian praktikal.
Walau bagaimanapun, dalam rangkaian blockchain berprestasi tinggi, hubungan antara protokol
dan pelaksanaan klien menjadi lebih terkekang. Apabila protokol menghampiri
had fizikal perkakasan pengkomputeran dan rangkaian, ruang untuk pelaksanaan
kepelbagaian secara semula jadi menguncup. Pada sempadan prestasi ini, pelaksanaan yang optimum
mesti menumpu pada penyelesaian yang serupa kerana mereka menghadapi had fizikal yang sama dan
keperluan prestasi. Sebarang penyelewengan yang ketara daripada pelaksanaan optimum
corak akan mengakibatkan prestasi merosot yang menjadikan pelanggan tidak berdaya maju untuk
operasi pengesah.
Dinamik ini kelihatan terutamanya dalam rangkaian yang menyasarkan masa sekatan minimum yang mungkin
dan pemprosesan transaksi maksimum. Dalam sistem sedemikian, faedah teori pelanggan
kepelbagaian menjadi kurang relevan, kerana overhed mengekalkan keserasian antara
pelaksanaan pelanggan yang berbeza itu sendiri boleh menjadi hambatan prestasi. bila
menolak prestasi blockchain kepada had fizikal, pelaksanaan pelanggan semestinya akan
berkongsi keputusan seni bina teras, menjadikan manfaat keselamatan pelaksanaan
kepelbagaian sebahagian besarnya secara teori.

3.3 Insentif Protokol untuk Pelanggan Berprestasi
Walaupun Fogo membenarkan mana-mana pelaksanaan pelanggan yang mematuhi, seni binanya secara semula jadi
memberi insentif menggunakan pelanggan berprestasi tinggi yang ada, didorong oleh tuntutan praktikal
operasi lokasi bersama berprestasi tinggi.
Tidak seperti rangkaian tradisional di mana jarak geografi mewujudkan kesesakan utama,
Reka bentuk lokasi bersama Fogo bermakna kecekapan pelaksanaan pelanggan menentukan secara langsung
prestasi pengesah. Dalam persekitaran ini, kependaman rangkaian adalah minimum, menjadikan pelanggan
mempercepatkan faktor kritikal.
Parameter masa dan saiz blok dinamik rangkaian mewujudkan tekanan ekonomi kepada
memaksimumkan daya pengeluaran. Pengesah mesti memilih antara menggunakan pelanggan terpantas atau mempertaruhkan
penalti dan pengurangan pendapatan. Mereka yang menjalankan pelanggan yang lebih perlahan sama ada berisiko kehilangan sekatan
mengundi untuk parameter agresif atau kehilangan hasil dengan mengundi untuk parameter konservatif.
Ini mewujudkan pemilihan semula jadi untuk pelaksanaan pelanggan yang paling cekap. Di Fogo's
persekitaran yang terletak bersama, walaupun perbezaan prestasi yang kecil menjadi ketara - a
pelanggan yang sedikit perlahan akan berprestasi rendah secara konsisten, membawa kepada blok yang terlepas dan
penalti. Pengoptimuman ini berlaku melalui kepentingan diri pengesah, bukan peraturan protokol.
Walaupun pilihan pelanggan tidak boleh dikuatkuasakan secara langsung oleh protokol, tekanan ekonomi secara semula jadi
memacu rangkaian ke arah pelaksanaan yang paling cekap sambil mengekalkan daya saing
perkembangan klien.

4. Permuafakatan Pelbagai Tempatan
Konsensus berbilang tempatan mewakili pendekatan baru untuk konsensus blockchain itu
secara dinamik mengimbangi faedah prestasi lokasi bersama pengesah dengan keselamatan
kelebihan taburan geografi. Sistem ini membenarkan pengesah untuk menyelaraskan mereka
lokasi fizikal merentas zaman sambil mengekalkan identiti kriptografi yang berbeza untuk
zon berbeza, membolehkan rangkaian mencapai konsensus latensi ultra rendah semasa
operasi biasa sambil mengekalkan keupayaan untuk kembali kepada konsensus global apabila
diperlukan.
Model konsensus berbilang tempatan Fogo mendapat inspirasi daripada amalan mantap dalam
pasaran kewangan tradisional, terutamanya model dagangan "ikut matahari" yang digunakan dalam asing
pertukaran dan pasaran global yang lain. Dalam kewangan tradisional, pembuatan pasaran dan kecairan
peruntukan secara semula jadi berhijrah antara pusat kewangan utama apabila hari dagangan berlangsung
– dari Asia ke Eropah ke Amerika Utara – membolehkan operasi pasaran berterusan sementara
mengekalkan kecairan tertumpu di kawasan geografi tertentu. Model ini telah terbukti
berkesan dalam kewangan tradisional kerana ia menyedari bahawa walaupun pasaran adalah global, namun
had fizikal rangkaian dan masa tindak balas manusia membuat beberapa tahap
penumpuan geografi yang diperlukan untuk penemuan harga optimum dan kecekapan pasaran.

4.1 Zon dan Putaran Zon
Zon mewakili kawasan geografi di mana pengesah lokasi bersama untuk mencapai optimum
prestasi konsensus. Sebaik-baiknya, zon ialah pusat data tunggal di mana kependaman rangkaian
antara pengesah menghampiri had perkakasan. Walau bagaimanapun, zon boleh berkembang ke
merangkumi kawasan yang lebih besar apabila perlu, memperdagangkan beberapa prestasi untuk praktikal
pertimbangan. Takrifan tepat zon muncul melalui konsensus sosial di kalangan
pengesah dan bukannya ditakrifkan secara ketat dalam protokol. Fleksibiliti ini membolehkan
rangkaian untuk menyesuaikan diri dengan kekangan infrastruktur dunia sebenar sambil mengekalkan prestasi
objektif.
Keupayaan rangkaian untuk berputar antara zon menyediakan pelbagai tujuan kritikal:
1. Desentralisasi Bidang Kuasa: Putaran zon tetap menghalang penangkapan
konsensus oleh mana-mana bidang kuasa tunggal. Ini mengekalkan rintangan rangkaian terhadap
tekanan kawal selia dan memastikan tiada satu kerajaan atau pihak berkuasa boleh melaksanakannya
kawalan jangka panjang ke atas operasi rangkaian.
2. Ketahanan Infrastruktur: Pusat data dan infrastruktur serantau boleh gagal
pelbagai sebab - bencana alam, gangguan bekalan elektrik, isu rangkaian, perkakasan
kegagalan, atau keperluan penyelenggaraan. Putaran zon memastikan rangkaian tidak
bergantung secara kekal pada mana-mana titik kegagalan. Contoh sejarah major
gangguan pusat data, seperti yang disebabkan oleh peristiwa cuaca buruk atau grid kuasa
kegagalan, tunjukkan kepentingan fleksibiliti ini.
3. Pengoptimuman Prestasi Strategik: Zon boleh dipilih untuk dioptimumkan
aktiviti rangkaian tertentu. Sebagai contoh, semasa zaman yang mengandungi signifikan
peristiwa kewangan (seperti pengumuman Rizab Persekutuan, ekonomi utama
laporan, atau pasaran dibuka), pengesah mungkin memilih untuk mencari konsensus berhampiran
sumber maklumat sensitif harga ini. Keupayaan ini membolehkan rangkaian untuk
meminimumkan kependaman untuk operasi kritikal sambil mengekalkan fleksibiliti untuk kegunaan berbeza
kes merentasi zaman.

4.2 Pengurusan Utama
Protokol ini melaksanakan sistem pengurusan utama dua peringkat yang memisahkan jangka panjang
identiti pengesah daripada penyertaan konsensus khusus zon. Setiap pengesah mengekalkan a
pasangan kunci global yang berfungsi sebagai identiti akar mereka dalam rangkaian. Kunci global ini digunakan untuk
operasi peringkat tinggi seperti delegasi kepentingan, pendaftaran zon, dan penyertaan dalam
konsensus global. Kunci global harus dilindungi dengan keselamatan setinggi mungkin
langkah, kerana ia mewakili kuasa muktamad pengesah dalam rangkaian.
Pengesah kemudiannya boleh mewakilkan kuasa kepada subkunci khusus zon melalui rantaian
program pendaftaran. Subkunci ini diberi kuasa khusus untuk penyertaan konsensus
dalam zon lokasi bersama yang ditetapkan. Pemisahan ini menyediakan pelbagai tujuan keselamatan: ia
membenarkan pengesah mengekalkan model keselamatan yang berbeza untuk jenis kunci yang berbeza, ia meminimumkan
pendedahan kunci global dengan memastikannya dalam talian semasa operasi biasa, dan ia
mengurangkan risiko kompromi utama semasa peralihan infrastruktur fizikal antara
zon.
Delegasi kunci khusus zon diuruskan melalui program dalam rantaian yang
mengekalkan pendaftaran kunci zon yang dibenarkan untuk setiap pengesah. Manakala pengesah boleh
daftar kunci zon baharu pada bila-bila masa menggunakan kunci global mereka, pendaftaran ini hanya mengambil masa
berlaku di sempadan zaman. Kelewatan ini memastikan semua peserta rangkaian mempunyai masa untuk
mengesahkan dan merekodkan delegasi utama baharu sebelum mereka menjadi aktif dalam konsensus.
4.3 Cadangan dan Pengaktifan Zon
Zon baharu boleh dicadangkan melalui mekanisme tadbir urus rantaian menggunakan global
kunci. Walau bagaimanapun, untuk memastikan kestabilan rangkaian dan memberi pengesah masa yang mencukupi untuk membuat persediaan
infrastruktur selamat, zon yang dicadangkan mempunyai tempoh kelewatan mandatori sebelum ia menjadi
layak untuk dipilih. Kelewatan ini, ditetapkan sebagai parameter protokol, mestilah cukup lama
membenarkan pengesah untuk:
● Lindungi infrastruktur fizikal yang sesuai di zon baharu
● Wujudkan sistem pengurusan kunci selamat untuk lokasi baharu
● Sediakan dan uji infrastruktur rangkaian
● Lakukan audit keselamatan yang diperlukan bagi kemudahan baharu
● Wujudkan prosedur sandaran dan pemulihan
Tempoh kelewatan juga berfungsi sebagai langkah keselamatan terhadap kemungkinan serangan di mana a
pelakon yang berniat jahat mungkin cuba memaksa konsensus ke zon yang mereka ada
kelebihan infrastruktur. Dengan memerlukan notis awal untuk zon baharu, protokol
memastikan bahawa semua pengesah mempunyai peluang yang adil untuk mewujudkan kehadiran di mana-mana zon yang
mungkin dipilih untuk konsensus.
Hanya selepas zon telah menyelesaikan tempoh menunggu ini boleh dipilih melalui biasa
proses pengundian zon untuk zaman akan datang. Pendekatan berhati-hati untuk pengaktifan zon ini membantu
mengekalkan keselamatan dan kestabilan rangkaian sementara masih membenarkan penambahan strategik baharu
lokasi apabila keperluan rangkaian berkembang.

4.4 Proses Pengundian Pemilihan Zon
Pemilihan zon konsensus berlaku melalui mekanisme pengundian dalam rantaian yang
mengimbangi keperluan untuk pergerakan pengesah yang diselaraskan dengan keselamatan rangkaian. Pengesah
mesti mencapai kuorum pada setiap zon lokasi bersama zaman hadapan dalam satu boleh dikonfigurasikan
masa kuorum sebelum peralihan zaman. Dalam amalan, jadual zaman mungkin
ditentukan dengan beberapa masa utama, supaya pengundian semasa zaman n memilih zon untuk
zaman n + k. Undian dibuang melalui program pendaftaran rantaian menggunakan global pengesah
kunci, dengan kuasa mengundi ditimbang mengikut kepentingan. Proses ini menggunakan kunci global dan bukannya zon
kunci kerana ia tidak sensitif kependaman dan memerlukan keselamatan maksimum.
Proses pengundian memerlukan majoriti besar berat kepentingan untuk mewujudkan kuorum, memastikan
bahawa sekumpulan kecil pengesah tidak boleh memaksa perubahan zon secara unilateral. Jika pengesah gagal
mencapai kuorum dalam jangka masa yang ditetapkan, rangkaian lalai secara automatik
mod konsensus global untuk zaman seterusnya. Mekanisme sandaran ini memastikan rangkaian
kesinambungan walaupun pengesah tidak boleh bersetuju dengan zon lokasi bersama.
Semasa tempoh pengundian, pengesah memberi isyarat kepada kedua-dua zon pilihan mereka untuk zaman seterusnya
dan masa blok sasaran mereka untuk zon itu. Pemilihan lokasi dan prestasi bersama ini
parameter membolehkan rangkaian mengoptimumkan kedua-dua kekangan fizikal dan prestasi
keupayaan setiap zon. Yang penting, tempoh pengundian menyediakan masa untuk pengesah
menyediakan infrastruktur di zon yang dipilih, termasuk memanaskan kekunci khusus zon dan
menguji ketersambungan rangkaian. Tempoh penyediaan ini adalah penting untuk mengekalkan rangkaian
kestabilan semasa peralihan zon.

4.5 Mod Konsensus Global
Mod konsensus global berfungsi sebagai mekanisme sandaran dan keselamatan asas
ciri protokol. Manakala Fogo mencapai prestasi tertingginya melalui berasaskan zon
konsensus, keupayaan untuk kembali kepada konsensus global memastikan rangkaian diteruskan
operasi di bawah keadaan buruk. Dalam mod konsensus global, rangkaian beroperasi dengan
parameter konservatif dioptimumkan untuk pengesahan diedarkan secara global: blok 400ms tetap
masa dan saiz blok yang dikurangkan untuk menampung kependaman rangkaian yang lebih tinggi antara
pengesah yang tersebar secara geografi.
Protokol memasuki mod konsensus global melalui dua laluan utama:
● Pemilihan Zon Gagal: Jika pengesah gagal mencapai kuorum pada zaman berikutnya
zon konsensus dalam tempoh pengundian yang ditetapkan, rangkaian secara automatik
lalai kepada konsensus global untuk zaman itu.
● Kegagalan Konsensus Masa Jalan: Jika zon semasa gagal mencapai kemuktamadan blok dalam
tempoh tamat masa yang ditetapkan semasa suatu zaman, protokol segera bertukar
kepada mod konsensus global untuk baki zaman itu. Sandaran ini "melekit" -
apabila dicetuskan pada pertengahan zaman, rangkaian kekal dalam konsensus global sehingga seterusnya
peralihan zaman, mengutamakan kestabilan berbanding pemulihan prestasi.
Dalam mod konsensus global, pengesah mengambil bahagian menggunakan kunci yang ditetapkan untuk global
operasi, yang mungkin atau mungkin bukan salah satu kunci khusus zon mereka, dan rangkaian
mengekalkan peraturan pilihan garpu yang sama seperti konsensus berasaskan zon. Walaupun mod ini berkorban
kependaman ultra rendah yang boleh dicapai dalam zon yang terletak bersama, ia menyediakan asas yang kukuh untuk
kesinambungan rangkaian dan menunjukkan cara Fogo mengekalkan keselamatan tanpa berkorban
hidup dalam keadaan terdegradasi.

5. Set Pengesah
Untuk mencapai prestasi tinggi dan mengurangkan amalan MEV yang kesat, Fogo akan menggunakan a
set pengesah yang dipilih susun. Ini adalah perlu kerana walaupun sebahagian kecil daripada kekurangan peruntukan
mengesahkan nod boleh menghalang rangkaian daripada mencapai had prestasi fizikalnya.
Pada mulanya, susun atur akan beroperasi melalui bukti kuasa sebelum beralih kepada langsung
kebenaran oleh set pengesah. Dengan meletakkan kuasa penyusunan dengan set pengesah,
Fogo boleh menguatkuasakan hukuman lapisan sosial ke atas tingkah laku kesat seperti tradisi
sistem bukti kuasa, tetapi dengan cara yang tidak lebih terpusat daripada kuasa garpu itu
2/3 daripada pegangan sudah dipegang dalam rangkaian PoS tradisional seperti Solana.

5.1 Saiz dan Konfigurasi Awal
Fogo mengekalkan set pengesah yang dibenarkan dengan minimum yang dikuatkuasakan protokol dan
bilangan maksimum pengesah untuk memastikan desentralisasi yang sesuai sambil mengoptimumkan
prestasi rangkaian. Saiz sasaran awal ialah kira-kira 20-50 pengesah, walaupun
topi ini dilaksanakan sebagai parameter protokol yang boleh dilaraskan sebagai rangkaian
matang. Pada genesis, set pengesah awal akan dipilih oleh pihak berkuasa genesis, yang
akan mengekalkan kebenaran sementara untuk mengurus komposisi set pengesah semasa
peringkat awal rangkaian.

5.2 Tadbir Urus dan Peralihan
Kawalan pihak berkuasa genesis ke atas keahlian set pengesah direka bentuk untuk menjadi
sementara. Selepas tempoh awal penstabilan rangkaian, kuasa ini akan beralih kepada
set pengesah itu sendiri. Berikutan peralihan ini, perubahan kepada keahlian set validator akan
memerlukan dua pertiga supermajoriti token yang dipertaruhkan, sepadan dengan ambang yang sama
diperlukan untuk perubahan tahap protokol dalam rangkaian bukti kepentingan.
Untuk mengelakkan perubahan mendadak yang boleh menjejaskan kestabilan rangkaian, hadkan parameter protokol
kadar pusing ganti pengesah. Tidak lebih daripada peratusan tetap set pengesah boleh
digantikan atau dikeluarkan dalam tempoh masa tertentu, di mana peratusan ini adalah protokol yang boleh disesuaikan
parameter. Ini memastikan evolusi beransur-ansur set pengesah sambil mengekalkan rangkaian
kestabilan.

5.3 Keperluan Penyertaan
Pengesah mesti memenuhi keperluan pegangan minimum yang diwakilkan untuk layak untuk
set pengesah, mengekalkan keserasian dengan model ekonomi Solana sambil menambah
komponen yang dibenarkan. Keperluan dwi ini - kepentingan yang mencukupi dan kelulusan yang ditetapkan -
memastikan bahawa pengesah mempunyai kulit ekonomi dalam permainan dan operasi
keupayaan untuk mengekalkan prestasi rangkaian.

5.4 Rasional dan Tadbir Urus Rangkaian
Set pengesah yang dibenarkan tidak memberi kesan material kepada desentralisasi rangkaian, seperti dalam
mana-mana rangkaian bukti pegangan, dua pertiga majoriti besar pegangan sudah boleh berlaku
perubahan sewenang-wenangnya kepada protokol melalui forking. Sebaliknya, mekanisme ini menyediakan a
rangka kerja rasmi untuk set pengesah untuk menguatkuasakan gelagat rangkaian berfaedah yang mungkin
jika tidak, sukar untuk mengekod dalam peraturan protokol.
Sebagai contoh, keupayaan untuk mengeluarkan pengesah membolehkan rangkaian bertindak balas kepada:
● Isu prestasi berterusan yang merendahkan keupayaan rangkaian
● Pengekstrakan MEV kesat yang merosakkan kebolehgunaan rangkaian
● Tingkah laku tidak stabil rangkaian yang tidak boleh dikuatkuasakan secara langsung dalam protokol, seperti
larut lesap tetapi tidak memajukan blok Turbin
● Tingkah laku lain yang, walaupun berpotensi menguntungkan bagi pengesah individu, membahayakan
nilai jangka panjang rangkaian
Mekanisme tadbir urus ini menyedari bahawa walaupun tingkah laku tertentu mungkin menguntungkan dalam
jangka pendek, mereka boleh merosakkan daya maju jangka panjang rangkaian. Dengan membolehkan
pengesah berwajaran kepentingan menetapkan untuk mengawal tingkah laku sedemikian melalui kawalan keahlian, Fogo
menyelaraskan insentif pengesah dengan kesihatan jangka panjang rangkaian tanpa menjejaskan
sifat desentralisasi asas yang wujud pada sistem bukti kepentingan.

6. Bakal Sambungan
Sementara inovasi teras Fogo memfokuskan pada konsensus berbilang tempatan, prestasi pelanggan dan
pengurusan set validator, beberapa sambungan protokol tambahan sedang dipertimbangkan
sama ada untuk pelaksanaan genesis atau selepas pelancaran. Ciri-ciri ini akan dipertingkatkan lagi
fungsi rangkaian sambil mengekalkan keserasian ke belakang dengan Solana
ekosistem.

6.1 Pembayaran Yuran Token SPL
Untuk mendayakan akses rangkaian yang lebih luas dan meningkatkan pengalaman pengguna, Fogo berpotensi
memperkenalkan jenis urus niaga tidak ditandatangani_pembayar_yuran yang membolehkan urus niaga dilaksanakan
tanpa SOL dalam akaun asal. Ciri ini, digabungkan dengan yuran rantaian
program pembayaran, membolehkan pengguna membayar yuran transaksi menggunakan token SPL sambil
mengekalkan keselamatan protokol dan pampasan pengesah.
Sistem ini berfungsi melalui pasaran penyampai tanpa kebenaran protokol. Pengguna
bina urus niaga yang merangkumi kedua-dua operasi yang dimaksudkan dan token SPL
pembayaran untuk membayar pampasan kepada pembayar yuran akhirnya. Urus niaga ini boleh ditandatangani dengan sah
tanpa menyatakan pembayar yuran, membenarkan mana-mana pihak untuk melengkapkannya dengan menambah mereka
tandatangan dan membayar yuran SOL. Mekanisme ini secara efektif memisahkan transaksi
kebenaran daripada pembayaran yuran, membolehkan akaun dengan baki SOL sifar berinteraksi
rangkaian selagi mereka memiliki aset berharga lain.
Ciri ini dilaksanakan melalui pengubahsuaian protokol yang minimum, hanya memerlukan
penambahan jenis transaksi baharu dan program dalam rantaian untuk mengendalikan penyampai
pampasan. Sistem ini mewujudkan pasaran yang cekap untuk perkhidmatan penyampaian transaksi manakala
mengekalkan sifat keselamatan protokol asas. Tidak seperti bayaran yang lebih kompleks
sistem abstraksi, pendekatan ini tidak memerlukan perubahan pada mekanisme pembayaran pengesah
atau peraturan konsensus.

7. Kesimpulan
Fogo mewakili pendekatan baru untuk seni bina blockchain yang mencabar tradisional
andaian tentang hubungan antara prestasi, desentralisasi dan keselamatan.
Dengan menggabungkan pelaksanaan pelanggan berprestasi tinggi dengan berbilang tempatan dinamik
konsensus dan set pengesah terpilih, protokol mencapai prestasi yang tidak pernah berlaku sebelum ini
tanpa menjejaskan sifat keselamatan asas sistem bukti kepentingan. The
keupayaan untuk memindahkan konsensus secara dinamik sambil mengekalkan kepelbagaian geografi menyediakan
kedua-dua pengoptimuman prestasi dan daya tahan sistemik, manakala sandaran protokol
mekanisme memastikan operasi berterusan dalam keadaan buruk.
Melalui reka bentuk ekonomi yang teliti, mekanisme ini muncul secara semula jadi daripada pengesah
insentif dan bukannya melalui penguatkuasaan protokol, mewujudkan yang teguh dan boleh disesuaikan
sistem. Memandangkan teknologi blockchain terus berkembang, inovasi Fogo menunjukkan
bagaimana reka bentuk protokol yang bertimbang rasa boleh menolak sempadan prestasi manakala
mengekalkan sifat keselamatan dan desentralisasi yang membuat rangkaian blockchain
berharga.
`

// Chinese (Simplified)
const CHINESE_TEXT = `
Fogo：高性能 SVM Layer 1
版本 1.0
摘要
本文介绍了 Fogo，这是一种创新的 Layer 1 区块链协议，在吞吐量、延迟和拥塞管理方面实现了突破性的性能。作为 Solana 协议的扩展，Fogo 在 SVM 执行层保持完全兼容，允许现有的 Solana 程序、工具和基础设施无缝迁移，同时显著提高性能并降低延迟。
Fogo 贡献了三项创新：
● 基于纯 Firedancer 的统一客户端实现，解锁了速度较慢的网络（包括 Solana 本身）无法达到的性能水平。
● 具有动态托管的多本地共识，实现远低于任何主流区块链的出块时间和延迟。
● 精心策划的验证者集，激励高性能并在验证者层面阻止掠夺性行为。
这些创新在保持 Layer 1 区块链必不可少的去中心化和稳健性的同时，带来了显著的性能提升。

1. 引言
区块链网络在平衡性能、去中心化和安全性方面面临着持续的挑战。当今的区块链遭受着严重的吞吐量限制，这使得它们不适合全球金融活动。以太坊在其基础层上每秒处理的交易量 (TPS) 不足 50 笔。即使是最中心化的 Layer 2 也处理不到 1,000 TPS。虽然 Solana 的设计目标是实现更高的性能，但由于客户端多样性的限制，目前在 5,000 TPS 时就会出现拥堵。相比之下，像纳斯达克、芝加哥商品交易所和欧洲期货交易所这样的传统金融系统通常每秒处理超过 100,000 次操作。延迟是去中心化区块链协议的另一个关键限制因素。在金融市场中，尤其是在波动性资产的价格发现方面，低延迟对于市场质量和流动性至关重要。传统市场参与者的端到端延迟通常以毫秒或亚毫秒级为单位。由于光速的限制，只有当市场参与者能够与执行环境共处一地时，才能实现这些速度。

传统的区块链架构使用全球分布的验证器集，这些验证器集运行时缺乏地理感知，从而造成了根本的性能限制。光本身需要超过 130 毫秒才能绕赤道一圈，即使是绕一个完美的圆圈——而现实世界的网络路径还涉及额外的距离和基础设施延迟。当共识需要验证器之间进行多轮通信时，这些物理限制会加剧。当共识需要验证器之间进行多轮通信时，这些跨区域延迟会加剧。因此，网络必须实现保守的出块时间和最终确定性延迟才能保持稳定性。即使在最佳条件下，全球分布式共识机制也无法克服这些基本的网络延迟。
随着区块链与全球金融体系的进一步融合，用户将要求其性能与当今的中心化系统相当。如果没有精心设计，满足这些需求可能会严重损害区块链网络的去中心化和弹性。为了应对这一挑战，我们提出了 Fogo 第一层区块链。Fogo 的核心理念是通过两种关键方法最大化吞吐量并最小化延迟：首先，在最佳去中心化验证器集上使用性能最高的客户端软件；其次，在保留全局共识的大部分去中心化优势的同时，采用共置共识。

2. 概述
本文分为几个部分，涵盖了 Fogo 的主要设计决策。
第 3 部分介绍了 Fogo 与 Solana 区块链协议的关系及其在客户端优化和多样性方面的策略。第 4 部分介绍了多本地共识、其实际实现以及它相对于全局或本地共识所做的权衡。第 5 部分介绍了 Fogo 初始化和维护验证器集的方法。第 6 部分介绍了创世之后可能引入的未来扩展。

3. 协议和客户端
Fogo 的底层构建于迄今为止性能最高、应用最广泛的区块链协议 Solana 之上。Solana 网络已在协议设计和客户端实现方面提供了众多优化解决方案。Fogo 的目标是最大限度地向后兼容 Solana，包括 SVM 执行层的完全兼容，以及与 TowerBFT 共识、Turbine 区块传播、Solana 领导者轮换以及网络和共识层的所有其他主要组件的紧密兼容。这种兼容性使 Fogo 能够轻松集成和部署 Solana 生态系统中现有的程序、工具和基础设施，并受益于 Solana 持续的上游改进。
然而，与 Solana 不同的是，Fogo 将运行单个规范客户端。该规范客户端将是 Solana 上运行的性能最高的主客户端。这使得 Fogo 能够实现显著更高的性能，因为网络将始终以最快的客户端速度运行。而 Solana 则受客户端多样性限制，
其速度始终受限于最慢客户端的速度。目前以及可预见的未来，这款标准客户端将基于 Firedancer 堆栈。

3.1 Firedancer
Firedancer 是 Jump Crypto 的高性能 Solana 兼容客户端实现，
通过优化的并行处理、内存管理和 SIMD 指令，
其交易处理吞吐量显著高于当前的验证器客户端。
目前有两个版本：“Frankendancer”，一款使用 Firedancer 处理引擎和 Rust 验证器网络堆栈的混合版本；以及完整的 Firedancer 实现，
其完全重写了 C 网络堆栈，目前正处于后期开发阶段。
这两个版本都保持了 Solana 协议的兼容性，同时最大限度地提高了性能。
一旦完成，纯 Firedancer 实现预计将设定新的性能基准，使其成为 Fogo 高吞吐量需求的理想选择。Fogo 将首先使用基于 Frankendancer 的网络，然后最终过渡到纯 Firedancer。

3.2 规范客户端与客户端多样性
区块链协议通过实现其规则和规范的客户端软件运行。协议定义了网络运行规则，而客户端则将这些规范转换为可执行软件。协议与客户端之间的关系历来遵循不同的模式，一些网络积极推动客户端多样性，而另一些网络则自然而然地趋向于规范实现。
客户端多样性传统上具有多种用途：它提供实现冗余，支持对协议规则进行独立验证，并在理论上降低全网软件漏洞的风险。比特币网络展示了一个有趣的先例——虽然存在多种客户端实现，但比特币核心（Bitcoin Core）作为事实上的规范客户端，提供了定义实际网络行为的参考实现。
然而，在高性能区块链网络中，协议与客户端实现之间的关系变得更加受限。当协议接近计算和网络硬件的物理极限时，实现多样性的空间自然会缩小。在这些性能边界上，最佳实现必须趋同于类似的解决方案，因为它们面临着相同的物理限制和性能要求。任何与最佳实现模式的显著偏差都会导致性能下降，使客户端无法进行验证器操作。这种动态在以尽可能短的出块时间和最大的交易吞吐量为目标的网络中尤为明显。在这样的系统中，客户端多样性的理论优势变得不那么重要，因为维护不同客户端实现之间兼容性的开销本身就可能成为性能瓶颈。当区块链性能达到物理极限时，客户端实现必然会共享核心架构决策，这使得实现多样性的安全优势在很大程度上停留在理论上。

3.3 高性能客户端的协议激励
虽然 Fogo 允许任何符合标准的客户端实现，但其架构自然地激励使用性能最高的客户端，这是由高性能同地运行的实际需求驱动的。
与传统网络不同，传统网络的地理距离是主要瓶颈，
Fogo 的同地设计意味着客户端实现的效率直接决定了验证者的性能。在这种环境下，网络延迟极低，因此客户端速度成为关键因素。
网络的动态出块时间和大小参数会产生最大化吞吐量的经济压力。验证者必须在使用最快的客户端和面临惩罚和收入减少的风险之间做出选择。运行速度较慢的客户端要么冒着丢失区块的风险投票支持激进的参数，要么冒着收入损失的投票支持保守的参数。
这为最高效的客户端实现创造了自然选择。在 Fogo 的同地环境中，即使是微小的性能差异也会变得显著——速度稍慢的客户端将持续表现不佳，导致丢失区块和受到惩罚。这种优化是通过验证者的自身利益而非协议规则来实现的。
虽然协议无法直接强制客户端的选择，但经济压力自然会推动网络朝着最高效的实施方向发展，同时保持客户端开发的竞争力。

4. 多本地共识
多本地共识代表了一种新颖的区块链共识方法，它动态地平衡了验证者共置的性能优势与地理分布的安全优势。该系统允许验证者在不同时段协调其物理位置，同时为不同区域维护不同的加密身份，从而使网络能够在正常运行期间实现超低延迟共识，同时保留在需要时回退到全局共识的能力。
Fogo 的多本地共识模型借鉴了传统金融市场的既定做法，尤其是外汇和其他全球市场中使用的“追日”交易模式。在传统金融中，随着交易日的推进，做市和流动性供应会自然地在主要金融中心之间迁移——从亚洲到欧洲再到北美——从而实现持续的市场运作，同时保持特定地理区域的流动性集中。这种模式已被证明在传统金融中是有效的，因为它认识到，尽管市场是全球性的，但网络的物理限制和人类的反应时间使得一定程度的地理集中对于实现最佳价格发现和市场效率至关重要。

4.1 区域和区域轮换
区域代表验证者共处一地以实现最佳共识性能的地理区域。理想情况下，区域是一个单一的数据中心，验证者之间的网络延迟接近硬件极限。然而，区域可以在必要时扩展以覆盖更大的区域，以牺牲一些性能为代价来满足实际需求。区域的确切定义是通过验证者之间的社会共识而产生的，而不是在协议中严格定义。这种灵活性使网络能够适应现实世界的基础设施限制，同时保持性能目标。网络在区域之间轮换的能力有多个关键用途：
1. 管辖权去中心化：定期进行区域轮换可防止任何单一管辖区控制共识。这保持了网络对监管压力的抵御能力，并确保没有任何单一政府或机构能够对网络运营施加长期控制。
2. 基础设施弹性：数据中心和区域基础设施可能因多种原因发生故障——自然灾害、断电、网络问题、硬件故障或维护需求。区域轮换可确保网络不会永久依赖于任何单点故障。历史上重大数据中心中断的案例，例如由恶劣天气事件或电网故障引起的中断，证明了这种灵活性的重要性。
3. 战略性能优化：可以选择区域来针对特定的网络活动进行优化。例如，在包含重大金融事件（例如美联储公告、重要经济报告或市场开盘）的时段，验证者可能会选择将共识机制定位在这些价格敏感信息来源附近。此功能使网络能够最大限度地减少关键操作的延迟，同时保持跨时段不同用例的灵活性。

4.2 密钥管理
该协议实现了双层密钥管理系统，将长期验证者身份与特定区域的共识参与分离。每个验证者维护一个全局密钥对，作为其在网络中的根身份。该全局密钥用于高级操作，例如权益委托、区域注册和参与全局共识。全局密钥应采用最高级别的安全措施进行保护，因为它代表了验证者在网络中的最终权限。验证者可以通过链上注册程序将权限委托给特定区域的子密钥。这些子密钥专门授权用于在指定的共置区域内参与共识。这种分离具有多种安全目的：它允许验证者为不同类型的密钥维护不同的安全模型；通过在正常运行期间保持全局密钥在线，最大限度地减少密钥的暴露；并降低了在区域之间物理基础设施转换期间密钥泄露的风险。
特定区域密钥的委托通过链上程序进行管理，该程序维护每个验证者已授权区域密钥的注册表。虽然验证者可以随时使用其全局密钥注册新的区域密钥，但这些注册仅在周期边界生效。这种延迟确保所有网络参与者都有时间在新的密钥委托生效之前验证并记录它们。

4.3 区域提议与激活
新的区域可以通过链上治理机制使用全局密钥进行提议。但是，为了确保网络稳定性并让验证者有足够的时间准备安全的基础设施，提议的区域在符合被选中的条件之前必须经过一段延迟期。此延迟时间作为协议参数设置，必须足够长，以允许验证者：
● 在新区域中确保适当的物理基础设施安全
● 为新位置建立安全的密钥管理系统
● 设置并测试网络基础设施
● 对新设施进行必要的安全审核
● 建立备份和恢复程序
延迟时间也可作为一项安全措施，以防止恶意行为者试图在其拥有基础设施优势的区域强行达成共识。通过要求提前通知新区域，该协议确保所有验证者都有公平的机会在任何可能被选中进行共识的区域中建立存在。
只有区域完成此等待期后，才能通过常规区域投票流程在未来的周期中被选中。这种谨慎的区域激活方法有助于维护网络安全性和稳定性，同时仍允许随着网络需求的发展而添加新的战略位置。

4.4 区域选择投票流程
共识区域的选择通过链上投票机制进行，该机制在协调验证者移动的需求和网络安全之间取得平衡。验证者必须在每个未来周期 (epoch) 转换前的可配置法定人数时间内，在每个未来周期的共置区域 (co-location zone) 上达到法定人数。实际上，周期调度可以提前一些时间确定，例如在周期 n 期间的投票将选择周期 n + k 的区域。投票通过链上注册程序使用验证者的全局密钥进行，投票权按权益加权。此过程使用全局密钥而非区域密钥，因为它对延迟不敏感，并且需要最高的安全性。投票过程需要绝对多数的权益权重才能建立法定人数，以确保少数验证者无法单方面强制更改区域。如果验证者未能在指定时间内达到法定人数，则网络将自动默认在下一个周期使用全局共识模式。即使验证者无法就共置区域达成一致，此回退机制也能确保网络的连续性。
在投票期间，验证者会发出信号，告知下一个周期的首选区域以及该区域的目标出块时间。这种位置和性能参数的联合选择，使网络能够针对每个区域的物理限制和性能能力进行优化。重要的是，投票期间为验证者提供了时间，让他们有时间在所选区域中准备基础设施，包括预热特定于区域的密钥和测试网络连接。这段准备期对于在区域转换期间维持网络稳定性至关重要。

4.5 全局共识模式
全局共识模式既是协议的回退机制，也是其基本安全特性。虽然 Fogo 通过基于分区的共识实现其最高性能，但回退到全局共识的能力确保了网络在不利条件下的持续运行。在全局共识模式下，网络采用针对全局分布式验证优化的保守参数运行：固定的 400 毫秒出块时间和减小的区块大小，以适应地理位置分散的验证者之间更高的网络延迟。
该协议通过两种主要途径进入全局共识模式：
● 分区选择失败：如果验证者未能在指定的投票期限内达成下一个周期共识分区的法定人数，则网络将自动默认在该周期内采用全局共识。
● 运行时共识失败：如果当前分区未能在某个周期内指定的超时期限内达成区块最终确定性，则协议将立即切换到全局共识模式，并持续该周期的剩余时间。这种回退机制具有“粘性”——一旦在 epoch 中期触发，网络将保持全局共识，直到下一个 epoch 转换，并将稳定性置于性能恢复之上。
在全局共识模式下，验证者使用指定的密钥参与全局操作，该密钥可能是也可能不是其特定于区域的密钥之一，并且网络保持与基于区域的共识相同的分叉选择规则。虽然此模式牺牲了同地区域可实现的超低延迟，但它为网络连续性提供了坚实的基础，并展示了 Fogo 如何在不牺牲活跃度的情况下在性能下降的情况下保持安全性。

5. 验证者集
为了实现高性能并减少 MEV 的滥用，Fogo 将使用一个精心策划的验证者集。这是必要的，因为即使是一小部分配置不足的验证节点也可能阻止网络达到其物理性能极限。
最初，策展将通过权威证明 (PoA) 进行，然后过渡到由验证者集直接授权。通过将策展权限置于验证者集合中，
Fogo 可以像传统的权威证明系统一样，在社交层面对滥用行为实施惩罚，但其中心化程度不会超过 Solana 等传统 PoS 网络中 2/3 权益持有者的分叉算力。

5.1 规模和初始配置
Fogo 维护一个经过许可的验证者集合，并由协议强制执行最小和最大验证者数量，以确保充分的去中心化，同时优化网络性能。初始目标规模约为 20-50 个验证者，但此上限作为协议参数实现，可随着网络的成熟进行调整。在创世阶段，初始验证者集合将由创世权威机构选出，该权威机构将保留在网络早期阶段管理验证者集合组成的临时权限。

5.2 治理和过渡
创世权威机构对验证者集合成员资格的控制权旨在作为临时控制。在网络稳定初期后，此权限将移交给验证者集本身。在此移交之后，验证者集成员资格的变更将需要三分之二的质押代币的绝对多数，这与权益证明网络中协议级变更所需的阈值相同。
为了防止可能破坏网络稳定的突发变化，协议参数限制了验证者的更替率。在给定时间段内，最多只能替换或移除验证者集的固定百分比，该百分比是一个可调的协议参数。这确保了验证者集的逐步演进，同时保持了网络的稳定性。

5.3 参与要求
验证者必须满足最低委托质押要求才能有资格加入验证者集，并在添加许可组件的同时保持与 Solana 经济模型的兼容性。这双重要求——足够的质押和验证者集批准——确保验证者既拥有经济利益，又具备维护网络性能的运营能力。

5.4 基本原理和网络治理
许可验证者集不会对网络去中心化产生实质性影响，因为在任何权益证明网络中，三分之二的绝对多数权益已经可以通过分叉对协议进行任意更改。相反，该机制为验证者集提供了一个正式的框架，以强制执行有益的网络行为，而这些行为原本可能难以在协议规则中实现。
例如，移除验证者的能力使网络能够应对：
● 持续的性能问题会降低网络能力
● 滥用 MEV 提取会损害网络可用性
● 无法在协议中直接强制执行的网络不稳定行为，例如
提取但不转发 Turbine 区块
● 其他可能对单个验证者有利，但会损害网络长期价值的行为
该治理机制认识到，虽然某些行为可能在短期内有利可图，但它们可能会损害网络的长期生存能力。通过启用权益加权验证者集，并通过成员控制来监管此类行为，Fogo 将验证者的激励机制与网络的长期健康发展相结合，同时又不损害权益证明系统固有的去中心化特性。

6. 未来扩展
Fogo 的核心创新重点在于多本地共识、客户端性能和验证者集管理，同时正在考虑在创世版或上线后实现其他一些协议扩展。这些功能将进一步增强网络功能，同时保持与 Solana 生态系统的向后兼容性。

6.1 SPL 代币费用支付
为了扩大网络覆盖范围并提升用户体验，Fogo 可能会引入 fee_payer_unsigned 交易类型，允许在发起账户中无需 SOL 即可执行交易。此功能与链上费用支付程序相结合，使用户能够使用 SPL 代币支付交易费用，同时确保协议安全性和验证者报酬。
该系统通过一个协议外的、无需许可的中继器市场运作。用户构建交易，其中包含预期操作和 SPL 代币支付，用于支付最终的费用支付者。这些交易无需指定费用支付者即可进行有效签名，任何一方只需添加签名并支付 SOL 费用即可完成交易。该机制有效地将交易授权与费用支付分离，即使 SOL 余额为零的账户，只要拥有其他有价值的资产，也可以与网络交互。
此功能通过最少的协议修改实现，只需添加新的交易类型和一个链上程序来处理中继器补偿。该系统为交易中继服务创建了一个高效的市场，同时保持了底层协议的安全性。与更复杂的费用抽象系统不同，这种方法不需要更改验证器支付机制或共识规则。

7. 结论
Fogo 代表了一种新颖的区块链架构方法，它挑战了关于性能、去中心化和安全性之间关系的传统假设。
通过将高性能客户端实现与动态多本地共识机制和精心挑选的验证者集相结合，该协议实现了前所未有的性能，同时又不损害权益证明系统的基本安全属性。
在保持地理多样性的同时动态迁移共识的能力，
既优化了性能，又增强了系统弹性，而协议的回退机制则确保了在不利条件下的持续运行。
通过精心的经济设计，这些机制自然而然地源于验证者激励，而非协议强制执行，从而构建了一个健壮且适应性强的系统。随着区块链技术的不断发展，Fogo 的创新证明了，
经过深思熟虑的协议设计如何能够突破性能界限，同时
保持区块链网络所珍视的安全性和去中心化特性。
`

// Thai
const THAI_TEXT = `
Fogo: SVM ประสิทธิภาพสูง เลเยอร์ 1
เวอร์ชัน 1.0

บทคัดย่อ
บทความนี้จะแนะนำ Fogo ซึ่งเป็นโปรโตคอลบล็อกเชนเลเยอร์ 1 ใหม่ที่มอบประสิทธิภาพที่ก้าวล้ำในด้านการจัดการปริมาณงาน ความหน่วง และความแออัด ในฐานะส่วนขยายของโปรโตคอล Solana Fogo ยังคงรักษาความเข้ากันได้อย่างสมบูรณ์ในเลเยอร์การดำเนินการ SVM ช่วยให้โปรแกรม เครื่องมือ และโครงสร้างพื้นฐานของ Solana ที่มีอยู่สามารถย้ายข้อมูลได้อย่างราบรื่น ในขณะเดียวกันก็ให้ประสิทธิภาพที่สูงขึ้นและความหน่วงที่ต่ำลงอย่างมาก
Fogo นำเสนอนวัตกรรมใหม่สามประการ ได้แก่
● การใช้งานไคลเอนต์แบบครบวงจรโดยอาศัย Firedancer เพียงอย่างเดียว ปลดล็อกระดับประสิทธิภาพที่เครือข่ายที่มีไคลเอนต์ที่ช้ากว่าไม่สามารถทำได้ รวมถึง Solana เอง
● ข้อตกลงแบบหลายโลคอลพร้อมการวางตำแหน่งแบบไดนามิก ทำให้ได้เวลาบล็อกและเวลาหน่วงที่ต่ำกว่าบล็อกเชนหลักๆ อย่างมาก
● ชุดตรวจสอบความถูกต้องที่คัดสรรมาอย่างดีซึ่งส่งเสริมประสิทธิภาพสูงและป้องกันพฤติกรรมการฉ้อโกงในระดับผู้ตรวจสอบความถูกต้อง
นวัตกรรมเหล่านี้มอบประสิทธิภาพที่เพิ่มขึ้นอย่างมาก ในขณะเดียวกันก็ยังคงรักษาการกระจายอำนาจและความแข็งแกร่งที่จำเป็นต่อบล็อกเชนเลเยอร์ 1

1. บทนำ
เครือข่ายบล็อกเชนกำลังเผชิญกับความท้าทายอย่างต่อเนื่องในการสร้างสมดุลระหว่างประสิทธิภาพกับการกระจายอำนาจและความปลอดภัย บล็อกเชนในปัจจุบันมีข้อจำกัดด้านปริมาณงานที่รุนแรงซึ่งทำให้ไม่เหมาะสำหรับกิจกรรมทางการเงินทั่วโลก Ethereum ประมวลผลธุรกรรมต่อวินาที (TPS) น้อยกว่า 50 รายการต่อวินาทีในเลเยอร์พื้นฐาน แม้แต่เลเยอร์ 2 ที่มีการรวมศูนย์มากที่สุดก็ยังสามารถประมวลผลได้น้อยกว่า 1,000 TPS แม้ว่า Solana จะถูกออกแบบมาเพื่อประสิทธิภาพที่สูงขึ้น แต่ข้อจำกัดจากความหลากหลายของไคลเอนต์ในปัจจุบันทำให้เกิดความแออัดที่ 5,000 TPS ในทางตรงกันข้าม ระบบการเงินแบบดั้งเดิมอย่าง NASDAQ, CME และ Eurex มักจะประมวลผลมากกว่า 100,000 การดำเนินการต่อวินาที
ความหน่วงแฝงเป็นข้อจำกัดสำคัญอีกประการหนึ่งสำหรับโปรโตคอลบล็อกเชนแบบกระจายศูนย์ ในตลาดการเงิน โดยเฉพาะอย่างยิ่งสำหรับการค้นพบราคาของสินทรัพย์ที่มีความผันผวน ความหน่วงเวลาต่ำเป็นสิ่งจำเป็นต่อคุณภาพและสภาพคล่องของตลาด ผู้เข้าร่วมตลาดแบบดั้งเดิมทำงานด้วยความล่าช้าแบบ end-to-end ที่ระดับมิลลิวินาทีหรือต่ำกว่ามิลลิวินาที ความเร็วเหล่านี้จะเกิดขึ้นได้ก็ต่อเมื่อผู้เข้าร่วมตลาดสามารถอยู่ร่วมกับสภาพแวดล้อมการดำเนินการได้ เนื่องจากข้อจำกัดด้านความเร็วแสง สถาปัตยกรรมบล็อกเชนแบบดั้งเดิมใช้ชุดตัวตรวจสอบที่กระจายอยู่ทั่วโลก ซึ่งทำงานโดยปราศจากการรับรู้ทางภูมิศาสตร์ ทำให้เกิดข้อจำกัดด้านประสิทธิภาพพื้นฐาน แสงเองใช้เวลามากกว่า 130 มิลลิวินาทีในการเคลื่อนที่รอบโลกที่เส้นศูนย์สูตร แม้จะเดินทางเป็นวงกลมที่สมบูรณ์แบบก็ตาม และเส้นทางเครือข่ายในโลกแห่งความเป็นจริงเกี่ยวข้องกับระยะทางและความล่าช้าของโครงสร้างพื้นฐานเพิ่มเติม ข้อจำกัดทางกายภาพเหล่านี้ทวีคูณขึ้นเมื่อฉันทามติต้องการรอบการสื่อสารหลายรอบระหว่างผู้ตรวจสอบ ความหน่วงเวลาระหว่างภูมิภาคเหล่านี้ทวีคูณขึ้นเมื่อฉันทามติต้องการรอบการสื่อสารหลายรอบระหว่างผู้ตรวจสอบ ด้วยเหตุนี้ เครือข่ายจึงต้องใช้ระยะเวลาบล็อกและความล่าช้าขั้นสุดท้ายที่ระมัดระวังเพื่อรักษาเสถียรภาพ แม้ภายใต้สภาวะที่เหมาะสมที่สุด กลไกฉันทามติแบบกระจายศูนย์ทั่วโลกก็ไม่สามารถเอาชนะความล่าช้าของเครือข่ายพื้นฐานเหล่านี้ได้
เมื่อบล็อกเชนผสานรวมกับระบบการเงินโลกมากขึ้น ผู้ใช้จะต้องการประสิทธิภาพที่เทียบเท่ากับระบบรวมศูนย์ในปัจจุบัน หากปราศจากการออกแบบอย่างรอบคอบ การตอบสนองความต้องการเหล่านี้อาจส่งผลกระทบต่อการกระจายอำนาจและความยืดหยุ่นของเครือข่ายบล็อกเชนอย่างมีนัยสำคัญ เพื่อรับมือกับความท้าทายนี้ เราจึงเสนอบล็อกเชนเลเยอร์ 1 ของ Fogo ปรัชญาหลักของ Fogo คือการเพิ่มปริมาณงานสูงสุดและลดเวลาแฝงให้น้อยที่สุดผ่านสองแนวทางหลัก: ประการแรกคือการใช้ซอฟต์แวร์ไคลเอ็นต์ที่มีประสิทธิภาพสูงสุดบนชุดตรวจสอบแบบกระจายศูนย์ที่เหมาะสมที่สุด และประการที่สองคือการยอมรับฉันทามติที่ตั้งอยู่ในสถานที่เดียวกัน ในขณะที่ยังคงรักษาประโยชน์จากการกระจายอำนาจส่วนใหญ่ของฉันทามติทั่วโลกไว้

2. โครงร่าง
บทความนี้แบ่งออกเป็นส่วนต่างๆ ที่ครอบคลุมการตัดสินใจด้านการออกแบบที่สำคัญเกี่ยวกับ Fogo
ส่วนที่ 3 ครอบคลุมความสัมพันธ์ของ Fogo กับโปรโตคอลบล็อกเชน Solana และกลยุทธ์ที่เกี่ยวข้องกับการเพิ่มประสิทธิภาพและความหลากหลายของไคลเอ็นต์ ส่วนที่ 4 ครอบคลุมถึงฉันทามติแบบหลายท้องถิ่น การนำไปปฏิบัติจริง และการแลกเปลี่ยนที่เกิดขึ้นเมื่อเทียบกับฉันทามติระดับโลกหรือระดับท้องถิ่น ส่วนที่ 5 ครอบคลุมแนวทางของ Fogo ในการเริ่มต้นและการบำรุงรักษาชุดตรวจสอบ ส่วนที่ 6 ครอบคลุมถึงส่วนขยายที่อาจเกิดขึ้นหลังจากการเริ่มต้น

3. โปรโตคอลและไคลเอนต์
ที่เลเยอร์พื้นฐาน Fogo เริ่มต้นด้วยการสร้างบนโปรโตคอลบล็อกเชนที่มีประสิทธิภาพสูงสุดและใช้งานกันอย่างแพร่หลายในปัจจุบัน นั่นคือ Solana เครือข่าย Solana มาพร้อมกับโซลูชันการเพิ่มประสิทธิภาพมากมาย ทั้งในแง่ของการออกแบบโปรโตคอลและการใช้งานไคลเอนต์ Fogo มุ่งเป้าไปที่ความเข้ากันได้ย้อนหลังสูงสุดที่เป็นไปได้กับ Solana รวมถึงความเข้ากันได้อย่างสมบูรณ์ที่เลเยอร์การดำเนินการ SVM และความเข้ากันได้อย่างใกล้ชิดกับฉันทามติ TowerBFT การแพร่กระจายบล็อก Turbine การหมุนผู้นำ Solana และส่วนประกอบหลักอื่นๆ ทั้งหมดของเลเยอร์เครือข่ายและฉันทามติ ความเข้ากันได้นี้ช่วยให้ Fogo สามารถผสานรวมและปรับใช้โปรแกรม เครื่องมือ และโครงสร้างพื้นฐานที่มีอยู่จากระบบนิเวศ Solana ได้อย่างง่ายดาย รวมถึงได้รับประโยชน์จากการปรับปรุงต้นทางอย่างต่อเนื่องใน Solana
อย่างไรก็ตาม Fogo จะทำงานกับไคลเอนต์มาตรฐานเพียงตัวเดียว ซึ่งไคลเอนต์มาตรฐานนี้จะเป็นไคลเอนต์หลักที่มีประสิทธิภาพสูงสุดที่ทำงานบน Solana ซึ่งทำให้ Fogo สามารถบรรลุประสิทธิภาพที่สูงขึ้นอย่างมาก เนื่องจากเครือข่ายจะทำงานด้วยความเร็วเท่ากับไคลเอนต์ที่เร็วที่สุดเสมอ ในขณะที่ Solana ซึ่งถูกจำกัดด้วยความหลากหลายของไคลเอนต์ จะต้องเผชิญกับปัญหาคอขวดจากความเร็วของไคลเอนต์ที่ช้าที่สุดอยู่เสมอ ในปัจจุบันและอนาคตอันใกล้นี้ ไคลเอนต์มาตรฐานนี้จะใช้สแต็ก Firedancer

3.1 Firedancer
Firedancer คือการใช้งานไคลเอนต์ที่เข้ากันได้กับ Solana ประสิทธิภาพสูงของ Jump Crypto ซึ่งแสดงปริมาณการประมวลผลธุรกรรมที่สูงกว่าไคลเอนต์ตัวตรวจสอบความถูกต้องในปัจจุบันอย่างมาก ผ่านการประมวลผลแบบขนาน การจัดการหน่วยความจำ และคำสั่ง SIMD ที่ได้รับการปรับแต่งให้เหมาะสมที่สุด
มีสองเวอร์ชัน ได้แก่ "Frankendancer" ซึ่งเป็นเวอร์ชันไฮบริดที่ใช้เอนจินประมวลผลของ Firedancer ร่วมกับสแต็กเครือข่ายของ Rust Validator และการใช้งาน Firedancer เต็มรูปแบบพร้อมการเขียนสแต็กเครือข่าย C ใหม่ทั้งหมด ซึ่งขณะนี้อยู่ในขั้นตอนการพัฒนาขั้นสุดท้าย
ทั้งสองเวอร์ชันยังคงรักษาความเข้ากันได้ของโปรโตคอล Solana ไว้พร้อมกับการเพิ่มประสิทธิภาพสูงสุด
เมื่อเสร็จสมบูรณ์ การใช้งาน Firedancer เพียงอย่างเดียวคาดว่าจะสร้างมาตรฐานประสิทธิภาพใหม่ ทำให้เหมาะอย่างยิ่งสำหรับความต้องการปริมาณงานสูงของ Fogo Fogo จะเริ่มต้นด้วยเครือข่ายแบบ Frankendancer จากนั้นจึงเปลี่ยนมาใช้ Firedancer อย่างแท้จริงในที่สุด

3.2 ไคลเอ็นต์แบบมาตรฐานเทียบกับความหลากหลายของไคลเอ็นต์
โปรโตคอลบล็อกเชนทำงานผ่านซอฟต์แวร์ไคลเอ็นต์ที่ใช้กฎและข้อกำหนด แม้ว่าโปรโตคอลจะกำหนดกฎการทำงานของเครือข่าย แต่ไคลเอ็นต์จะแปลงข้อกำหนดเหล่านี้ให้เป็นซอฟต์แวร์ที่ปฏิบัติการได้ ความสัมพันธ์ระหว่างโปรโตคอลและไคลเอ็นต์มักจะเป็นไปตามรูปแบบที่แตกต่างกัน โดยบางเครือข่ายส่งเสริมความหลากหลายของไคลเอ็นต์อย่างจริงจัง ในขณะที่บางเครือข่ายจะบรรจบกันที่การใช้งานแบบมาตรฐาน
โดยทั่วไปแล้ว ความหลากหลายของไคลเอ็นต์มีวัตถุประสงค์หลายประการ ได้แก่ ให้ความซ้ำซ้อนในการใช้งาน ช่วยให้สามารถตรวจสอบกฎโปรโตคอลได้อย่างอิสระ และลดความเสี่ยงของช่องโหว่ของซอฟต์แวร์ทั่วทั้งเครือข่ายในทางทฤษฎี เครือข่าย Bitcoin แสดงให้เห็นถึงแบบอย่างที่น่าสนใจ แม้ว่าจะมีการใช้งานไคลเอ็นต์หลายตัว แต่ Bitcoin Core ทำหน้าที่เป็นไคลเอ็นต์แบบมาตรฐานโดยพฤตินัย ซึ่งเป็นการใช้งานอ้างอิงที่กำหนดพฤติกรรมของเครือข่ายในทางปฏิบัติ
อย่างไรก็ตาม ในเครือข่ายบล็อกเชนประสิทธิภาพสูง ความสัมพันธ์ระหว่างโปรโตคอลและการใช้งานไคลเอ็นต์กลับมีข้อจำกัดมากขึ้น เมื่อโปรโตคอลเข้าใกล้ขีดจำกัดทางกายภาพของฮาร์ดแวร์การประมวลผลและเครือข่าย พื้นที่สำหรับความหลากหลายของการใช้งานจะลดลงตามธรรมชาติ ที่ขอบเขตประสิทธิภาพเหล่านี้ การใช้งานที่เหมาะสมที่สุดจะต้องบรรจบกันที่โซลูชันที่คล้ายคลึงกัน เนื่องจากต้องเผชิญกับข้อจำกัดทางกายภาพและข้อกำหนดด้านประสิทธิภาพที่เหมือนกัน การเบี่ยงเบนอย่างมีนัยสำคัญใดๆ จากรูปแบบการใช้งานที่เหมาะสมที่สุดจะส่งผลให้ประสิทธิภาพลดลง ซึ่งทำให้ไคลเอ็นต์ไม่สามารถใช้งานกับการทำงานของตัวตรวจสอบได้ พลวัตนี้เห็นได้ชัดเจนเป็นพิเศษในเครือข่ายที่กำหนดเป้าหมายเวลาบล็อกที่น้อยที่สุดเท่าที่จะเป็นไปได้และปริมาณงานธุรกรรมสูงสุด ในระบบดังกล่าว ประโยชน์เชิงทฤษฎีของความหลากหลายของไคลเอ็นต์จะมีความสำคัญน้อยลง เนื่องจากค่าใช้จ่ายในการรักษาความเข้ากันได้ระหว่างการใช้งานไคลเอ็นต์ที่แตกต่างกันอาจกลายเป็นคอขวดด้านประสิทธิภาพได้ เมื่อผลักดันประสิทธิภาพของบล็อกเชนให้ถึงขีดจำกัดทางกายภาพ การใช้งานไคลเอ็นต์จะต้องแบ่งปันการตัดสินใจทางสถาปัตยกรรมหลัก ทำให้ประโยชน์ด้านความปลอดภัยของความหลากหลายของแอปพลิเคชันส่วนใหญ่เป็นเพียงทฤษฎี

3.3 แรงจูงใจด้านโปรโตคอลสำหรับลูกค้าที่มีประสิทธิภาพ
แม้ว่า Fogo จะอนุญาตให้มีการใช้งานไคลเอนต์ที่สอดคล้องตามมาตรฐานใดๆ แต่สถาปัตยกรรมของ Fogo มักจะสร้างแรงจูงใจในการใช้ไคลเอนต์ที่มีประสิทธิภาพสูงสุดที่มีอยู่ ซึ่งขับเคลื่อนโดยความต้องการในทางปฏิบัติของการดำเนินงานแบบ co-location ที่มีประสิทธิภาพสูง
ซึ่งแตกต่างจากเครือข่ายแบบดั้งเดิมที่ระยะทางทางภูมิศาสตร์ก่อให้เกิดปัญหาคอขวดหลัก
การออกแบบ co-location ของ Fogo หมายความว่าประสิทธิภาพการใช้งานไคลเอนต์จะกำหนดประสิทธิภาพของตัวตรวจสอบโดยตรง ในสภาพแวดล้อมเช่นนี้ ความหน่วงของเครือข่ายจะน้อยที่สุด ทำให้ความเร็วของไคลเอนต์เป็นปัจจัยสำคัญ
พารามิเตอร์เวลาและขนาดของบล็อกแบบไดนามิกของเครือข่ายสร้างแรงกดดันทางเศรษฐกิจในการเพิ่มปริมาณงานสูงสุด ผู้ตรวจสอบต้องเลือกระหว่างการใช้ไคลเอนต์ที่เร็วที่สุดหรือเสี่ยงต่อการถูกปรับและรายได้ที่ลดลง ผู้ที่ใช้ไคลเอนต์ที่ช้ากว่าอาจเสี่ยงต่อการพลาดบล็อกจากการลงคะแนนเสียงให้กับพารามิเตอร์ที่ก้าวร้าว หรือสูญเสียรายได้จากการลงคะแนนเสียงให้กับพารามิเตอร์ที่อนุรักษ์นิยม
สิ่งนี้สร้างการคัดเลือกตามธรรมชาติสำหรับการติดตั้งไคลเอนต์ที่มีประสิทธิภาพสูงสุด ในสภาพแวดล้อมที่ตั้งอยู่ร่วมกันของ Fogo แม้แต่ความแตกต่างด้านประสิทธิภาพเพียงเล็กน้อยก็มีความสำคัญ ไคลเอนต์ที่ช้ากว่าเล็กน้อยก็จะมีประสิทธิภาพต่ำกว่ามาตรฐานอย่างต่อเนื่อง นำไปสู่การพลาดบล็อกและถูกลงโทษ การเพิ่มประสิทธิภาพนี้เกิดขึ้นผ่านผลประโยชน์ส่วนตัวของผู้ตรวจสอบ ไม่ใช่กฎของโปรโตคอล
แม้ว่าโปรโตคอลจะไม่สามารถบังคับใช้ตัวเลือกของไคลเอนต์ได้โดยตรง แต่แรงกดดันทางเศรษฐกิจย่อมผลักดันเครือข่ายไปสู่การใช้งานที่มีประสิทธิภาพสูงสุด ในขณะเดียวกันก็รักษาการพัฒนาไคลเอนต์ให้แข่งขันได้

4. ฉันทามติหลายพื้นที่
ฉันทามติหลายพื้นที่เป็นแนวทางใหม่ของฉันทามติบล็อกเชนที่สร้างสมดุลระหว่างประโยชน์ด้านประสิทธิภาพจากการวางตำแหน่งร่วมกันของผู้ตรวจสอบกับข้อได้เปรียบด้านความปลอดภัยของการกระจายทางภูมิศาสตร์อย่างมีพลวัต ระบบนี้ช่วยให้ผู้ตรวจสอบสามารถประสานตำแหน่งทางกายภาพของตนข้ามยุคสมัยต่างๆ ในขณะที่ยังคงรักษาอัตลักษณ์ทางการเข้ารหัสที่แตกต่างกันสำหรับโซนที่แตกต่างกัน ทำให้เครือข่ายสามารถบรรลุฉันทามติที่มีความล่าช้าต่ำเป็นพิเศษในระหว่างการทำงานปกติ ในขณะที่ยังคงรักษาความสามารถในการกลับไปใช้ฉันทามติทั่วโลกเมื่อจำเป็น
แบบจำลองฉันทามติหลายพื้นที่ของ Fogo ได้รับแรงบันดาลใจจากแนวปฏิบัติที่เป็นที่ยอมรับในตลาดการเงินแบบดั้งเดิม โดยเฉพาะอย่างยิ่งแบบจำลองการซื้อขายแบบ "ตามตะวัน" ที่ใช้ในตลาดแลกเปลี่ยนเงินตราต่างประเทศและตลาดโลกอื่นๆ ในระบบการเงินแบบดั้งเดิม การสร้างตลาดและการจัดหาสภาพคล่องจะเคลื่อนย้ายระหว่างศูนย์กลางทางการเงินหลักๆ ตามธรรมชาติเมื่อวันซื้อขายดำเนินไป ตั้งแต่เอเชีย ยุโรป และอเมริกาเหนือ ทำให้ตลาดสามารถดำเนินงานได้อย่างต่อเนื่อง ในขณะเดียวกันก็รักษาสภาพคล่องที่กระจุกตัวอยู่ในภูมิภาคทางภูมิศาสตร์ที่เฉพาะเจาะจง แบบจำลองนี้ได้รับการพิสูจน์แล้วว่ามีประสิทธิภาพในระบบการเงินแบบดั้งเดิม เนื่องจากตระหนักดีว่าแม้ตลาดจะมีขนาดใหญ่ทั่วโลก แต่ข้อจำกัดทางกายภาพของเครือข่ายและเวลาตอบสนองของมนุษย์ทำให้จำเป็นต้องมีการรวมศูนย์ทางภูมิศาสตร์ในระดับหนึ่งเพื่อการค้นพบราคาและประสิทธิภาพของตลาดที่เหมาะสมที่สุด

4.1 โซนและการหมุนเวียนโซน
โซนหมายถึงพื้นที่ทางภูมิศาสตร์ที่ผู้ตรวจสอบตั้งอยู่ร่วมกันเพื่อให้ได้ประสิทธิภาพฉันทามติที่ดีที่สุด ในอุดมคติ โซนคือศูนย์ข้อมูลเดียวที่ความหน่วงของเครือข่ายระหว่างผู้ตรวจสอบเข้าใกล้ขีดจำกัดของฮาร์ดแวร์ อย่างไรก็ตาม โซนสามารถขยายออกไปครอบคลุมภูมิภาคที่ใหญ่ขึ้นได้เมื่อจำเป็น โดยแลกประสิทธิภาพบางส่วนเพื่อการพิจารณาในทางปฏิบัติ คำจำกัดความที่แน่นอนของโซนเกิดขึ้นจากความเห็นพ้องต้องกันทางสังคมระหว่างผู้ตรวจสอบความถูกต้อง แทนที่จะถูกกำหนดอย่างเคร่งครัดในโปรโตคอล ความยืดหยุ่นนี้ช่วยให้เครือข่ายสามารถปรับตัวให้เข้ากับข้อจำกัดของโครงสร้างพื้นฐานในโลกแห่งความเป็นจริงได้ ในขณะที่ยังคงรักษาเป้าหมายด้านประสิทธิภาพไว้ได้ ความสามารถของเครือข่ายในการหมุนเวียนระหว่างโซนมีวัตถุประสงค์สำคัญหลายประการ ได้แก่:
1. การกระจายอำนาจตามเขตอำนาจศาล: การหมุนเวียนโซนอย่างสม่ำเสมอจะป้องกันไม่ให้เขตอำนาจศาลใดเขตอำนาจหนึ่งได้มาซึ่งฉันทามติ สิ่งนี้ช่วยรักษาความต้านทานของเครือข่ายต่อแรงกดดันด้านกฎระเบียบ และรับประกันว่าไม่มีรัฐบาลหรือหน่วยงานใดหน่วยงานหนึ่งสามารถควบคุมการดำเนินงานของเครือข่ายในระยะยาวได้
2. ความยืดหยุ่นของโครงสร้างพื้นฐาน: ศูนย์ข้อมูลและโครงสร้างพื้นฐานระดับภูมิภาคอาจล้มเหลวได้ด้วยเหตุผลหลายประการ เช่น ภัยพิบัติทางธรรมชาติ ไฟฟ้าดับ ปัญหาเครือข่าย ความล้มเหลวของฮาร์ดแวร์ หรือข้อกำหนดในการบำรุงรักษา การหมุนเวียนโซนช่วยให้มั่นใจได้ว่าเครือข่ายจะไม่ขึ้นอยู่กับจุดล้มเหลวเพียงจุดเดียวอย่างถาวร ตัวอย่างในอดีตของเหตุขัดข้องของศูนย์ข้อมูลครั้งใหญ่ เช่น เหตุขัดข้องที่เกิดจากสภาพอากาศเลวร้ายหรือไฟฟ้าดับ แสดงให้เห็นถึงความสำคัญของความยืดหยุ่นนี้
3. การเพิ่มประสิทธิภาพเชิงกลยุทธ์: สามารถเลือกโซนเพื่อเพิ่มประสิทธิภาพสำหรับกิจกรรมเครือข่ายเฉพาะได้ ตัวอย่างเช่น ในช่วงยุคที่มีเหตุการณ์ทางการเงินที่สำคัญ (เช่น ประกาศของธนาคารกลางสหรัฐฯ รายงานเศรษฐกิจที่สำคัญ หรือการเปิดตลาด) ผู้ตรวจสอบอาจเลือกค้นหาฉันทามติใกล้กับแหล่งที่มาของข้อมูลที่มีความอ่อนไหวต่อราคานี้ ความสามารถนี้ช่วยให้เครือข่ายสามารถลดความหน่วงสำหรับการดำเนินงานที่สำคัญ ในขณะที่ยังคงความยืดหยุ่นสำหรับกรณีการใช้งานที่แตกต่างกันในแต่ละยุค

4.2 การจัดการคีย์
โปรโตคอลนี้ใช้ระบบการจัดการคีย์แบบสองชั้น ซึ่งแยกการระบุตัวตนของผู้ตรวจสอบความถูกต้องระยะยาวออกจากการเข้าร่วมฉันทามติเฉพาะโซน ผู้ตรวจสอบความถูกต้องแต่ละรายจะรักษาคู่คีย์ส่วนกลาง (global key pair) ซึ่งทำหน้าที่เป็นตัวตนรากในเครือข่าย คีย์ส่วนกลางนี้ใช้สำหรับการดำเนินงานระดับสูง เช่น การมอบหมายสเตค การลงทะเบียนโซน และการเข้าร่วมฉันทามติส่วนกลาง คีย์ส่วนกลางควรได้รับการรักษาความปลอดภัยด้วยมาตรการรักษาความปลอดภัยสูงสุดเท่าที่จะเป็นไปได้ เนื่องจากแสดงถึงอำนาจสูงสุดของผู้ตรวจสอบความถูกต้องในเครือข่าย
จากนั้นผู้ตรวจสอบความถูกต้องสามารถมอบหมายอำนาจให้กับคีย์ย่อยเฉพาะโซนผ่านโปรแกรมรีจิสทรีแบบออนเชน คีย์ย่อยเหล่านี้ได้รับอนุญาตเฉพาะสำหรับการเข้าร่วมฉันทามติภายในโซนที่ตั้งร่วมที่กำหนด การแยกนี้มีวัตถุประสงค์ด้านความปลอดภัยหลายประการ ได้แก่ ช่วยให้ผู้ตรวจสอบสามารถรักษารูปแบบความปลอดภัยที่แตกต่างกันสำหรับประเภทคีย์ที่แตกต่างกัน ลดการเปิดเผยคีย์ส่วนกลางโดยการเก็บรักษาไว้แบบออนไลน์ในระหว่างการทำงานปกติ และลดความเสี่ยงของการถูกบุกรุกคีย์ระหว่างการเปลี่ยนผ่านโครงสร้างพื้นฐานทางกายภาพระหว่างโซนต่างๆ การมอบหมายคีย์เฉพาะโซนได้รับการจัดการผ่านโปรแกรมแบบออนเชนที่เก็บรักษาทะเบียนคีย์โซนที่ได้รับอนุญาตสำหรับผู้ตรวจสอบแต่ละราย แม้ว่าผู้ตรวจสอบจะสามารถลงทะเบียนคีย์โซนใหม่ได้ตลอดเวลาโดยใช้คีย์ส่วนกลาง แต่การลงทะเบียนเหล่านี้จะมีผลเฉพาะที่ขอบเขตยุคเท่านั้น ความล่าช้านี้ช่วยให้มั่นใจได้ว่าผู้เข้าร่วมเครือข่ายทุกคนมีเวลาในการตรวจสอบและบันทึกการมอบหมายคีย์ใหม่ก่อนที่จะเปิดใช้งานตามฉันทามติ

4.3 การเสนอและการเปิดใช้งานโซน
โซนใหม่สามารถเสนอได้ผ่านกลไกการกำกับดูแลแบบออนเชนโดยใช้คีย์ส่วนกลาง อย่างไรก็ตาม เพื่อให้มั่นใจถึงความเสถียรของเครือข่ายและให้ผู้ตรวจสอบมีเวลาเพียงพอในการเตรียมโครงสร้างพื้นฐานที่ปลอดภัย โซนที่เสนอมีระยะเวลาหน่วงเวลาบังคับก่อนที่จะมีสิทธิ์ได้รับการคัดเลือก ความล่าช้านี้ ซึ่งกำหนดเป็นพารามิเตอร์ของโปรโตคอล จะต้องมีความยาวเพียงพอเพื่อให้ผู้ตรวจสอบสามารถ:
● รักษาความปลอดภัยโครงสร้างพื้นฐานทางกายภาพที่เหมาะสมในโซนใหม่
● สร้างระบบการจัดการคีย์ที่ปลอดภัยสำหรับสถานที่ใหม่
● ตั้งค่าและทดสอบโครงสร้างพื้นฐานเครือข่าย
● ดำเนินการตรวจสอบความปลอดภัยที่จำเป็นสำหรับสถานที่ใหม่
● กำหนดขั้นตอนการสำรองข้อมูลและกู้คืนข้อมูล
ระยะเวลาการหน่วงเวลานี้ยังทำหน้าที่เป็นมาตรการรักษาความปลอดภัยเพื่อป้องกันการโจมตีที่อาจเกิดขึ้น ซึ่งผู้ประสงค์ร้ายอาจพยายามบังคับให้เกิดฉันทามติในโซนที่ตนมีข้อได้เปรียบด้านโครงสร้างพื้นฐาน โปรโตคอลนี้กำหนดให้มีการแจ้งล่วงหน้าสำหรับโซนใหม่ จึงทำให้มั่นใจได้ว่าผู้ตรวจสอบทุกคนมีโอกาสที่เท่าเทียมกันในการสร้างสถานะในโซนใดๆ ที่อาจได้รับเลือกให้สร้างฉันทามติ
โซนนั้นจึงจะสามารถเลือกผ่านกระบวนการลงคะแนนโซนปกติสำหรับยุคในอนาคตได้หลังจากผ่านระยะเวลาการรอคอยนี้ไปแล้ว วิธีการเปิดใช้งานโซนอย่างรอบคอบนี้ช่วยรักษาความปลอดภัยและเสถียรภาพของเครือข่าย ในขณะเดียวกันก็ช่วยให้สามารถเพิ่มตำแหน่งเชิงกลยุทธ์ใหม่ๆ ได้ตามความต้องการเครือข่ายที่เปลี่ยนแปลงไป

4.4 กระบวนการลงคะแนนเลือกโซน
การเลือกโซนที่เป็นฉันทามติเกิดขึ้นผ่านกลไกการลงคะแนนแบบออนเชน ซึ่งสร้างสมดุลระหว่างความจำเป็นในการเคลื่อนย้ายตัวตรวจสอบที่ประสานงานกับความปลอดภัยของเครือข่าย ตัวตรวจสอบต้องบรรลุโควรัมในโซนที่ตั้งร่วมกันของแต่ละยุคในอนาคตภายในระยะเวลาโควรัมที่กำหนดค่าได้ก่อนการเปลี่ยนยุค ในทางปฏิบัติ กำหนดการของยุคอาจถูกกำหนดด้วยระยะเวลานำ เช่น การลงคะแนนในช่วงยุค n จะเลือกโซนสำหรับยุค n + k การลงคะแนนจะดำเนินการผ่านโปรแกรมลงทะเบียนแบบออนเชนโดยใช้คีย์ส่วนกลางของตัวตรวจสอบ โดยอำนาจการลงคะแนนจะถ่วงน้ำหนักตามสัดส่วนการถือหุ้น กระบวนการนี้ใช้คีย์ส่วนกลางแทนคีย์โซน เนื่องจากไม่ไวต่อความล่าช้าและต้องการความปลอดภัยสูงสุด
กระบวนการลงคะแนนต้องการน้ำหนักส่วนเดิมพันที่มากกว่าเสียงข้างมากเพื่อสร้างโควรัม เพื่อให้แน่ใจว่ากลุ่มตัวตรวจสอบขนาดเล็กไม่สามารถบังคับให้เปลี่ยนโซนโดยฝ่ายเดียวได้ หากผู้ตรวจสอบไม่สามารถบรรลุโควรัมภายในกรอบเวลาที่กำหนด เครือข่ายจะตั้งค่าเริ่มต้นเป็นโหมดฉันทามติทั่วโลกโดยอัตโนมัติสำหรับยุคถัดไป กลไกสำรองนี้ช่วยให้มั่นใจได้ว่าเครือข่ายจะมีความต่อเนื่อง แม้ว่าผู้ตรวจสอบจะไม่สามารถตกลงกันเกี่ยวกับโซนที่ตั้งร่วมกันได้ก็ตาม
ในช่วงการลงคะแนน ผู้ตรวจสอบจะส่งสัญญาณทั้งโซนที่ต้องการสำหรับยุคถัดไปและเวลาบล็อกเป้าหมายสำหรับโซนนั้น การเลือกพารามิเตอร์ตำแหน่งและประสิทธิภาพร่วมกันนี้ช่วยให้เครือข่ายสามารถปรับให้เหมาะสมกับทั้งข้อจำกัดทางกายภาพและความสามารถด้านประสิทธิภาพของแต่ละโซน ที่สำคัญคือ ช่วงเวลาการลงคะแนนจะให้เวลาแก่ผู้ตรวจสอบในการเตรียมโครงสร้างพื้นฐานในโซนที่เลือก รวมถึงการวอร์มอัพคีย์เฉพาะโซนและการทดสอบการเชื่อมต่อเครือข่าย ช่วงเวลาการเตรียมการนี้มีความสำคัญอย่างยิ่งต่อการรักษาเสถียรภาพของเครือข่ายในระหว่างการเปลี่ยนผ่านโซน

4.5 โหมดฉันทามติทั่วโลก
โหมดฉันทามติทั่วโลกทำหน้าที่เป็นทั้งกลไกสำรองและคุณลักษณะด้านความปลอดภัยพื้นฐานของโปรโตคอล แม้ว่า Fogo จะบรรลุประสิทธิภาพสูงสุดผ่านฉันทามติตามโซน แต่ความสามารถในการกลับไปสู่ฉันทามติทั่วโลกช่วยให้มั่นใจได้ว่าเครือข่ายจะทำงานได้อย่างต่อเนื่องภายใต้สภาวะที่ไม่เอื้ออำนวย ในโหมดฉันทามติทั่วโลก เครือข่ายจะทำงานด้วยพารามิเตอร์แบบอนุรักษ์นิยมที่ปรับให้เหมาะสมสำหรับการตรวจสอบแบบกระจายทั่วโลก ได้แก่ เวลาบล็อกคงที่ 400 มิลลิวินาทีและขนาดบล็อกที่ลดลงเพื่อรองรับเวลาแฝงของเครือข่ายที่สูงขึ้นระหว่างผู้ตรวจสอบที่กระจายตัวทางภูมิศาสตร์
โปรโตคอลจะเข้าสู่โหมดฉันทามติทั่วโลกผ่านสองเส้นทางหลัก:
● การเลือกโซนล้มเหลว: หากผู้ตรวจสอบไม่สามารถบรรลุโควรัมในโซนฉันทามติของยุคถัดไปภายในระยะเวลาการลงคะแนนที่กำหนด เครือข่ายจะตั้งค่าเริ่มต้นเป็นฉันทามติทั่วโลกสำหรับยุคนั้นโดยอัตโนมัติ
● ความล้มเหลวของ Runtime Consensus: หากโซนปัจจุบันไม่สามารถบรรลุผลสำเร็จของบล็อกภายในระยะเวลาหมดเวลาที่กำหนดในระหว่างยุค โปรโตคอลจะเปลี่ยนไปใช้โหมด Global Consensus ทันทีในช่วงเวลาที่เหลือของยุคนั้น การสำรองนี้มีลักษณะ "เหนียว" – เมื่อถูกเรียกใช้งานในช่วงกลางยุค เครือข่ายจะยังคงอยู่ใน Global Consensus จนกว่าจะถึงการเปลี่ยนผ่านยุคถัดไป โดยให้ความสำคัญกับความเสถียรมากกว่าการฟื้นตัวของประสิทธิภาพ
ในโหมด Global Consensus ผู้ตรวจสอบความถูกต้องจะเข้าร่วมโดยใช้คีย์ที่กำหนดไว้สำหรับการดำเนินงานทั่วโลก ซึ่งอาจเป็นหรือไม่เป็นคีย์เฉพาะโซนก็ได้ และเครือข่ายจะยังคงใช้กฎการเลือก fork เช่นเดียวกับ Zone-based Consensus แม้ว่าโหมดนี้จะยอมเสียสละความหน่วงที่ต่ำมากซึ่งสามารถทำได้ในโซนที่อยู่ร่วมกัน แต่มันก็เป็นรากฐานที่แข็งแกร่งสำหรับความต่อเนื่องของเครือข่าย และแสดงให้เห็นว่า Fogo รักษาความปลอดภัยได้อย่างไรโดยไม่สูญเสียความต่อเนื่องภายใต้สภาวะที่เสื่อมโทรม

5. ชุดตัวตรวจสอบ
เพื่อให้ได้ประสิทธิภาพสูงและลดการใช้ MEV ในทางที่ผิด Fogo จะใช้ชุดตัวตรวจสอบที่คัดสรรมาอย่างดี ซึ่งเป็นสิ่งจำเป็นเนื่องจากแม้แต่โหนดตรวจสอบที่จัดเตรียมไม่เพียงพอเพียงเล็กน้อยก็สามารถป้องกันไม่ให้เครือข่ายถึงขีดจำกัดประสิทธิภาพทางกายภาพได้
ในขั้นต้น การคัดเลือกจะดำเนินการผ่าน Proof-of-authority ก่อนที่จะเปลี่ยนไปใช้การอนุญาตโดยตรงโดยชุดตัวตรวจสอบ การกำหนดสิทธิ์การคัดเลือกให้กับชุดตัวตรวจสอบทำให้ Fogo สามารถบังคับใช้การลงโทษพฤติกรรมที่ไม่เหมาะสมในระดับชั้นทางสังคมได้เช่นเดียวกับระบบ Proof-of-authority แบบดั้งเดิม แต่ในลักษณะที่ไม่รวมศูนย์มากกว่าอำนาจการ fork ที่ 2 ใน 3 ของ Stake มีอยู่แล้วในเครือข่าย PoS แบบดั้งเดิมอย่าง Solana

5.1 ขนาดและการกำหนดค่าเริ่มต้น
Fogo บำรุงรักษาชุดตัวตรวจสอบที่ได้รับอนุญาตพร้อมจำนวนตัวตรวจสอบขั้นต่ำและสูงสุดที่บังคับใช้ตามโปรโตคอล เพื่อให้มั่นใจว่าการกระจายอำนาจจะเพียงพอในขณะที่เพิ่มประสิทธิภาพของเครือข่าย ขนาดเป้าหมายเริ่มต้นจะอยู่ที่ประมาณ 20-50 ตัวตรวจสอบความถูกต้อง แม้ว่าขีดจำกัดนี้จะถูกนำมาใช้เป็นพารามิเตอร์โปรโตคอลที่สามารถปรับเปลี่ยนได้เมื่อเครือข่ายมีความสมบูรณ์มากขึ้น ณ ยุค Genesis ชุดตรวจสอบความถูกต้องเริ่มต้นจะถูกเลือกโดยผู้มีอำนาจของ Genesis ซึ่งจะยังคงมีสิทธิ์ชั่วคราวในการจัดการองค์ประกอบของชุดตรวจสอบความถูกต้องในช่วงเริ่มต้นของเครือข่าย

5.2 การกำกับดูแลและการเปลี่ยนผ่าน
การควบคุมการเป็นสมาชิกชุดตรวจสอบความถูกต้องของผู้มีอำนาจของ Genesis ได้รับการออกแบบมาให้เป็นแบบชั่วคราว หลังจากช่วงเริ่มต้นของการรักษาเสถียรภาพของเครือข่าย ผู้มีอำนาจนี้จะย้ายไปยังชุดตรวจสอบความถูกต้องเอง หลังจากการเปลี่ยนผ่านนี้ การเปลี่ยนแปลงการเป็นสมาชิกชุดตรวจสอบความถูกต้องจะต้องใช้โทเค็นที่ Stake อย่างน้อยสองในสาม ซึ่งต้องเป็นไปตามเกณฑ์เดียวกันกับที่กำหนดสำหรับการเปลี่ยนแปลงระดับโปรโตคอลในเครือข่าย Proof-of-Stake
เพื่อป้องกันการเปลี่ยนแปลงอย่างกะทันหันที่อาจทำให้เครือข่ายไม่เสถียร พารามิเตอร์โปรโตคอลจะจำกัดอัตราการหมุนเวียนของผู้ตรวจสอบความถูกต้อง ไม่สามารถแทนที่หรือนำชุดตัวตรวจสอบออกได้เกินกว่าเปอร์เซ็นต์คงที่ภายในระยะเวลาที่กำหนด โดยเปอร์เซ็นต์นี้เป็นพารามิเตอร์โปรโตคอลที่ปรับแต่งได้ วิธีนี้ช่วยให้มั่นใจได้ว่าชุดตัวตรวจสอบจะค่อยๆ พัฒนาขึ้น พร้อมกับรักษาเสถียรภาพของเครือข่าย

5.3 ข้อกำหนดการเข้าร่วม
ผู้ตรวจสอบต้องปฏิบัติตามข้อกำหนดขั้นต่ำของการเดิมพันที่ได้รับมอบหมายจึงจะมีสิทธิ์ได้รับชุดตัวตรวจสอบ โดยยังคงความเข้ากันได้กับแบบจำลองทางเศรษฐกิจของ Solana และเพิ่มองค์ประกอบที่ได้รับอนุญาต ข้อกำหนดสองประการนี้ – การเดิมพันที่เพียงพอและการอนุมัติชุด – ช่วยให้มั่นใจได้ว่าผู้ตรวจสอบจะมีทั้งส่วนได้ส่วนเสียทางเศรษฐกิจและความสามารถในการดำเนินงานเพื่อรักษาประสิทธิภาพของเครือข่าย

5.4 เหตุผลและการกำกับดูแลเครือข่าย
ชุดผู้ตรวจสอบที่ได้รับอนุญาตไม่ส่งผลกระทบอย่างมีนัยสำคัญต่อการกระจายอำนาจของเครือข่าย เช่นเดียวกับในเครือข่าย Proof-of-Stake ใดๆ ที่มีสัดส่วนการถือหุ้นเกินสองในสามสามารถทำให้เกิดการเปลี่ยนแปลงโปรโตคอลตามอำเภอใจได้ผ่านการฟอร์ก กลไกนี้จึงให้กรอบการทำงานอย่างเป็นทางการสำหรับชุดผู้ตรวจสอบเพื่อบังคับใช้พฤติกรรมเครือข่ายที่เป็นประโยชน์ ซึ่งมิฉะนั้นอาจเข้ารหัสในกฎโปรโตคอลได้ยาก
ตัวอย่างเช่น ความสามารถในการดีดตัวตรวจสอบออกทำให้เครือข่ายสามารถตอบสนองต่อ:
● ปัญหาประสิทธิภาพการทำงานที่ต่อเนื่องซึ่งลดประสิทธิภาพของเครือข่าย
● การสกัด MEV ในทางที่ผิดซึ่งสร้างความเสียหายต่อการใช้งานเครือข่าย
● พฤติกรรมที่ทำให้เครือข่ายไม่เสถียรซึ่งไม่สามารถบังคับใช้ได้โดยตรงในโปรโตคอล เช่น การลีชแต่ไม่ส่งต่อบล็อก Turbine
● พฤติกรรมอื่นๆ ที่แม้ว่าอาจสร้างผลกำไรให้กับตัวตรวจสอบแต่ละราย แต่กลับส่งผลเสียต่อมูลค่าในระยะยาวของเครือข่าย
กลไกการกำกับดูแลนี้ตระหนักว่าแม้พฤติกรรมบางอย่างอาจสร้างผลกำไรในระยะสั้น แต่อาจส่งผลเสียต่อความอยู่รอดในระยะยาวของเครือข่าย ด้วยการเปิดใช้งานชุดตัวตรวจสอบที่ถ่วงน้ำหนักด้วยสัดส่วนการถือหุ้น (stake-weighted validator) เพื่อควบคุมพฤติกรรมดังกล่าวผ่านการควบคุมสมาชิก Fogo จึงปรับแรงจูงใจของผู้ตรวจสอบให้สอดคล้องกับสุขภาพในระยะยาวของเครือข่ายโดยไม่กระทบต่อคุณสมบัติการกระจายอำนาจขั้นพื้นฐานที่มีอยู่ในระบบ proof-of-stake

6. ส่วนขยายที่คาดหวัง
แม้ว่านวัตกรรมหลักของ Fogo จะมุ่งเน้นไปที่ฉันทามติแบบหลายท้องถิ่น ประสิทธิภาพของลูกค้า และการจัดการชุดตัวตรวจสอบความถูกต้อง แต่ก็มีการพิจารณาส่วนขยายโปรโตคอลเพิ่มเติมอีกหลายรายการสำหรับการใช้งานตั้งแต่เริ่มต้นหรือหลังเปิดตัว คุณสมบัติเหล่านี้จะช่วยปรับปรุงการทำงานของเครือข่ายให้ดียิ่งขึ้น ในขณะเดียวกันก็รักษาความเข้ากันได้ย้อนหลังกับระบบนิเวศ Solana

6.1 การชำระค่าธรรมเนียมโทเค็น SPL
เพื่อให้สามารถเข้าถึงเครือข่ายได้กว้างขึ้นและปรับปรุงประสบการณ์ของผู้ใช้ Fogo อาจเปิดตัวประเภทธุรกรรม fee_payer_unsigned ที่อนุญาตให้ดำเนินธุรกรรมได้โดยไม่ต้องมี SOL ในบัญชีต้นทาง คุณสมบัตินี้ เมื่อรวมกับโปรแกรมการชำระค่าธรรมเนียมแบบ on-chain จะทำให้ผู้ใช้สามารถชำระค่าธรรมเนียมธุรกรรมโดยใช้โทเค็น SPL ในขณะที่ยังคงรักษาความปลอดภัยของโปรโตคอลและค่าตอบแทนจากตัวตรวจสอบความถูกต้อง
ระบบทำงานผ่านตลาดรีเลย์แบบไม่ต้องขออนุญาตนอกโปรโตคอล ผู้ใช้
สร้างธุรกรรมที่รวมทั้งการดำเนินการตามวัตถุประสงค์และการชำระเงินด้วยโทเค็น SPL เพื่อชดเชยให้กับผู้ชำระค่าธรรมเนียมในที่สุด ธุรกรรมเหล่านี้สามารถลงนามได้อย่างถูกต้องโดยไม่ต้องระบุผู้ชำระค่าธรรมเนียม ทำให้ทุกฝ่ายสามารถดำเนินการให้เสร็จสมบูรณ์ได้โดยการเพิ่มลายเซ็นและชำระค่าธรรมเนียม SOL กลไกนี้จะแยกการอนุมัติธุรกรรมออกจากการชำระค่าธรรมเนียมอย่างมีประสิทธิภาพ ช่วยให้บัญชีที่มียอดคงเหลือ SOL เป็นศูนย์สามารถโต้ตอบกับเครือข่ายได้ ตราบใดที่บัญชีเหล่านั้นมีสินทรัพย์ที่มีค่าอื่นๆ อยู่ คุณสมบัตินี้ดำเนินการผ่านการปรับเปลี่ยนโปรโตคอลเพียงเล็กน้อย โดยเพียงแค่เพิ่มประเภทธุรกรรมใหม่และโปรแกรมบนเชนเพื่อจัดการค่าตอบแทนของผู้ส่งต่อ ระบบนี้สร้างตลาดที่มีประสิทธิภาพสำหรับบริการส่งต่อธุรกรรม ในขณะที่ยังคงรักษาคุณสมบัติความปลอดภัยของโปรโตคอลพื้นฐานไว้ ซึ่งแตกต่างจากระบบการแยกค่าธรรมเนียมที่ซับซ้อนกว่า วิธีการนี้ไม่จำเป็นต้องเปลี่ยนแปลงกลไกการชำระเงินของผู้ตรวจสอบหรือกฎฉันทามติ

7. สรุป
Fogo นำเสนอแนวทางใหม่สำหรับสถาปัตยกรรมบล็อกเชนที่ท้าทายสมมติฐานดั้งเดิมเกี่ยวกับความสัมพันธ์ระหว่างประสิทธิภาพ การกระจายอำนาจ และความปลอดภัย ด้วยการผสานการใช้งานไคลเอนต์ประสิทธิภาพสูงเข้ากับฉันทามติหลายท้องถิ่นแบบไดนามิกและชุดตัวตรวจสอบที่คัดสรรมาอย่างดี ทำให้โปรโตคอลนี้บรรลุประสิทธิภาพที่ไม่เคยมีมาก่อนโดยไม่กระทบต่อคุณสมบัติด้านความปลอดภัยพื้นฐานของระบบ Proof-of-Stake ความสามารถในการย้ายฉันทามติแบบไดนามิกในขณะที่ยังคงรักษาความหลากหลายทางภูมิศาสตร์ไว้ มอบทั้งประสิทธิภาพที่ดีที่สุดและความยืดหยุ่นของระบบ ในขณะที่กลไกสำรองของโปรโตคอลช่วยให้มั่นใจได้ว่าจะทำงานได้อย่างต่อเนื่องภายใต้สภาวะแวดล้อมที่ไม่เอื้ออำนวย ด้วยการออกแบบทางเศรษฐกิจอย่างรอบคอบ กลไกเหล่านี้เกิดขึ้นเองตามธรรมชาติจากแรงจูงใจของผู้ตรวจสอบ มากกว่าการบังคับใช้โปรโตคอล ก่อให้เกิดระบบที่แข็งแกร่งและปรับเปลี่ยนได้ ในขณะที่เทคโนโลยีบล็อกเชนยังคงพัฒนาอย่างต่อเนื่อง นวัตกรรมของ Fogo แสดงให้เห็นว่าการออกแบบโปรโตคอลที่รอบคอบสามารถผลักดันขีดจำกัดของประสิทธิภาพได้อย่างไร พร้อมกับรักษาคุณสมบัติด้านความปลอดภัยและการกระจายอำนาจที่ทำให้เครือข่ายบล็อกเชนมีคุณค่า
`

// Hindi
const HINDI_TEXT = `
फोगो: एक उच्च-प्रदर्शन एसवीएम लेयर 1
संस्करण 1.0

सारांश
यह आलेख फोगो का परिचय देता है, जो एक नवीन लेयर 1 ब्लॉकचेन प्रोटोकॉल है जो थ्रूपुट, विलंबता और संकुलन प्रबंधन में अभूतपूर्व प्रदर्शन प्रदान करता है। सोलाना प्रोटोकॉल के विस्तार के रूप में, फोगो एसवीएम निष्पादन परत पर पूर्ण संगतता बनाए रखता है, जिससे मौजूदा सोलाना प्रोग्राम, टूलिंग और बुनियादी ढाँचे को निर्बाध रूप से माइग्रेट करने की अनुमति मिलती है, साथ ही उच्च प्रदर्शन और कम विलंबता भी प्राप्त होती है। फोगो तीन नवीन नवाचारों का योगदान देता है:
● शुद्ध फायरडांसर पर आधारित एक एकीकृत क्लाइंट कार्यान्वयन, जो धीमे क्लाइंट वाले नेटवर्क द्वारा अप्राप्य प्रदर्शन स्तरों को अनलॉक करता है - जिसमें सोलाना भी शामिल है।
● गतिशील सह-स्थान के साथ बहु-स्थानीय सहमति, ब्लॉक समय और विलंबता प्राप्त करना
किसी भी प्रमुख ब्लॉकचेन से बहुत कम।
● एक क्यूरेटेड सत्यापनकर्ता सेट जो उच्च प्रदर्शन को प्रोत्साहित करता है और सत्यापनकर्ता स्तर पर आक्रामक व्यवहार को रोकता है।
ये नवाचार लेयर 1 ब्लॉकचेन के लिए आवश्यक
विकेंद्रीकरण और मजबूती को बनाए रखते हुए प्रदर्शन में उल्लेखनीय वृद्धि प्रदान करते हैं।

1. परिचय
ब्लॉकचेन नेटवर्क को प्रदर्शन को विकेंद्रीकरण और सुरक्षा के साथ संतुलित करने में निरंतर चुनौतियों का सामना करना पड़ता है। आज के ब्लॉकचेन गंभीर थ्रूपुट सीमाओं का सामना करते हैं
जो उन्हें वैश्विक वित्तीय गतिविधियों के लिए अनुपयुक्त बनाती हैं। एथेरियम अपनी बेस लेयर पर 50 से कम
लेनदेन प्रति सेकंड (TPS) संसाधित करता है। यहाँ तक कि सबसे केंद्रीकृत लेयर 2 भी 1,000 से कम TPS संभालते हैं। हालाँकि सोलाना को उच्च प्रदर्शन के लिए डिज़ाइन किया गया था, लेकिन क्लाइंट विविधता की सीमाएँ वर्तमान में 5,000 TPS पर भीड़भाड़ का कारण बनती हैं। इसके विपरीत, NASDAQ, CME और यूरेक्स जैसी पारंपरिक वित्तीय प्रणालियाँ नियमित रूप से प्रति सेकंड 100,000 से अधिक संचालन संसाधित करती हैं।
विकेंद्रीकृत ब्लॉकचेन प्रोटोकॉल के लिए विलंबता एक और महत्वपूर्ण सीमा प्रस्तुत करती है।
वित्तीय बाजारों में—विशेष रूप से अस्थिर परिसंपत्तियों पर मूल्य खोज के लिए—कम विलंबता
बाजार की गुणवत्ता और तरलता के लिए आवश्यक है। पारंपरिक बाज़ार सहभागी मिलीसेकंड या सब-मिलीसेकंड के पैमाने पर
एंड-टू-एंड विलंबता के साथ काम करते हैं। ये गतियाँ केवल तभी
प्राप्त की जा सकती हैं जब बाज़ार सहभागी प्रकाश की गति की बाधाओं के कारण निष्पादन परिवेश के साथ सह-स्थान बना सकें।
पारंपरिक ब्लॉकचेन आर्किटेक्चर वैश्विक रूप से वितरित सत्यापनकर्ता सेट का उपयोग करते हैं जो भौगोलिक जागरूकता के बिना
संचालित होते हैं, जिससे मूलभूत प्रदर्शन सीमाएँ उत्पन्न होती हैं। प्रकाश को भूमध्य रेखा पर पृथ्वी का चक्कर लगाने में
130 मिलीसेकंड से अधिक समय लगता है, यहाँ तक कि एक पूर्ण वृत्त में भी यात्रा करने में - और वास्तविक दुनिया के नेटवर्क पथों में अतिरिक्त दूरी और बुनियादी ढाँचे में देरी शामिल होती है। ये भौतिक सीमाएँ तब और बढ़ जाती हैं जब आम सहमति के लिए सत्यापनकर्ताओं के बीच कई
संचार दौरों की आवश्यकता होती है। ये अंतर-क्षेत्रीय विलंबताएँ तब और बढ़ जाती हैं जब आम सहमति के लिए सत्यापनकर्ताओं के बीच कई संचार दौरों की आवश्यकता होती है। परिणामस्वरूप,
नेटवर्क को स्थिरता बनाए रखने के लिए रूढ़िवादी ब्लॉक समय और अंतिम विलंब लागू करने होंगे।
इष्टतम परिस्थितियों में भी, एक वैश्विक रूप से वितरित आम सहमति तंत्र
इन बुनियादी नेटवर्किंग विलंबों को दूर नहीं कर सकता।
जैसे-जैसे ब्लॉकचेन वैश्विक वित्तीय प्रणाली के साथ और अधिक एकीकृत होते जाएँगे, उपयोगकर्ता आज की केंद्रीकृत प्रणालियों के तुलनीय प्रदर्शन की माँग करेंगे। सावधानीपूर्वक डिज़ाइन के बिना, इन माँगों को पूरा करने से ब्लॉकचेन नेटवर्क के विकेंद्रीकरण और लचीलेपन में महत्वपूर्ण रूप से समझौता हो सकता है। इस चुनौती का समाधान करने के लिए, हम फोगो लेयर वन ब्लॉकचेन का प्रस्ताव रखते हैं। फोगो का मुख्य दर्शन दो प्रमुख तरीकों के माध्यम से थ्रूपुट को अधिकतम और विलंबता को न्यूनतम करना है: पहला, एक इष्टतम विकेंद्रीकृत सत्यापनकर्ता सेट पर सबसे अधिक प्रदर्शन करने वाले क्लाइंट सॉफ़्टवेयर का उपयोग करना; और दूसरा, वैश्विक सहमति के अधिकांश विकेंद्रीकरण लाभों को संरक्षित करते हुए सह-स्थित सहमति को अपनाना। 

2. रूपरेखा
यह पेपर फोगो से संबंधित प्रमुख डिज़ाइन निर्णयों को शामिल करते हुए खंडों में विभाजित है। खंड 3 सोलाना ब्लॉकचेन प्रोटोकॉल के साथ फोगो के संबंध और क्लाइंट अनुकूलन और विविधता के संबंध में इसकी रणनीति को शामिल करता है। खंड 4 बहु-स्थानीय सहमति, इसके व्यावहारिक कार्यान्वयन और वैश्विक या स्थानीय सहमति के सापेक्ष इसके द्वारा किए गए व्यापारों को शामिल करता है। खंड 5 सत्यापनकर्ता सेट को आरंभ करने और बनाए रखने के लिए फोगो के दृष्टिकोण को शामिल करता है। खंड 6 संभावित विस्तारों को शामिल करता है जिन्हें उत्पत्ति के बाद पेश किया जा सकता है।

3. प्रोटोकॉल और क्लाइंट
आधार स्तर पर, Fogo अब तक के सबसे अधिक प्रदर्शन करने वाले व्यापक रूप से उपयोग किए जाने वाले ब्लॉकचेन प्रोटोकॉल, सोलाना पर आधारित है। सोलाना नेटवर्क पहले से ही प्रोटोकॉल डिज़ाइन और क्लाइंट कार्यान्वयन दोनों के संदर्भ में कई अनुकूलन समाधानों के साथ आता है। Fogo, सोलाना के साथ अधिकतम संभव पश्चगामी संगतता को लक्षित करता है, जिसमें SVM निष्पादन स्तर पर पूर्ण संगतता और TowerBFT सर्वसम्मति, टर्बाइन ब्लॉक प्रसार, सोलाना लीडर रोटेशन और नेटवर्किंग एवं सर्वसम्मति स्तरों के अन्य सभी प्रमुख घटकों के साथ घनिष्ठ संगतता शामिल है। यह संगतता Fogo को सोलाना पारिस्थितिकी तंत्र से मौजूदा प्रोग्राम, टूल और बुनियादी ढांचे को आसानी से एकीकृत और तैनात करने की अनुमति देती है; साथ ही सोलाना में निरंतर अपस्ट्रीम सुधारों का लाभ भी उठाती है।
हालांकि, सोलाना के विपरीत, Fogo एक एकल कैननिकल क्लाइंट के साथ चलेगा। यह कैननिकल क्लाइंट सोलाना पर चलने वाला सबसे उच्च प्रदर्शन वाला प्रमुख क्लाइंट होगा। यह Fogo को काफी बेहतर प्रदर्शन प्राप्त करने में सक्षम बनाता है क्योंकि नेटवर्क हमेशा सबसे तेज़ क्लाइंट की गति से चलेगा। जबकि क्लाइंट विविधता द्वारा सीमित सोलाना हमेशा
सबसे धीमे क्लाइंट की गति से बाधित रहेगा। अभी और निकट भविष्य में यह
कैनोनिकल क्लाइंट फायरडांसर स्टैक पर आधारित होगा।

3.1 फायरडांसर
फायरडांसर, जंप क्रिप्टो का उच्च-प्रदर्शन सोलाना-संगत क्लाइंट कार्यान्वयन है,
जो अनुकूलित समानांतर प्रसंस्करण, मेमोरी प्रबंधन और SIMD
निर्देशों के माध्यम से वर्तमान सत्यापनकर्ता
क्लाइंटों की तुलना में काफी अधिक लेनदेन प्रसंस्करण थ्रूपुट प्रदर्शित करता है।
इसके दो संस्करण मौजूद हैं: "फ्रैंकेंडांसर", जो फायरडांसर के प्रसंस्करण इंजन का उपयोग करता है और
रस्ट सत्यापनकर्ता के नेटवर्किंग स्टैक के साथ, और पूर्ण फायरडांसर कार्यान्वयन जिसमें
पूरी तरह से C नेटवर्किंग स्टैक पुनर्लेखन है, जो वर्तमान में अंतिम चरण के विकास में है।
दोनों संस्करण प्रदर्शन को अधिकतम करते हुए सोलाना प्रोटोकॉल संगतता बनाए रखते हैं।
एक बार पूरा हो जाने पर, शुद्ध फायरडांसर कार्यान्वयन से नए प्रदर्शन
बेंचमार्क स्थापित होने की उम्मीद है, जो इसे फोगो की उच्च-थ्रूपुट आवश्यकताओं के लिए आदर्श बनाता है। फोगो एक फ्रैंकेंडांसर आधारित नेटवर्क से शुरुआत करेगा और फिर अंततः शुद्ध फायरडांसर में परिवर्तित हो जाएगा।

3.2 कैनोनिकल क्लाइंट बनाम क्लाइंट विविधता
ब्लॉकचेन प्रोटोकॉल क्लाइंट सॉफ़्टवेयर के माध्यम से संचालित होते हैं जो उनके नियमों और विनिर्देशों को लागू करता है। प्रोटोकॉल नेटवर्क संचालन के नियमों को परिभाषित करते हैं, जबकि क्लाइंट इन विनिर्देशों को निष्पादन योग्य सॉफ़्टवेयर में परिवर्तित करते हैं। प्रोटोकॉल और क्लाइंट के बीच संबंध ऐतिहासिक रूप से अलग-अलग मॉडलों का पालन करते रहे हैं, कुछ नेटवर्क सक्रिय रूप से क्लाइंट विविधता को बढ़ावा देते हैं जबकि अन्य स्वाभाविक रूप से कैनोनिकल कार्यान्वयन पर केंद्रित होते हैं। क्लाइंट विविधता पारंपरिक रूप से कई उद्देश्यों की पूर्ति करती है: यह कार्यान्वयन
अतिरेक प्रदान करती है, प्रोटोकॉल नियमों के स्वतंत्र सत्यापन को सक्षम बनाती है, और सैद्धांतिक रूप से नेटवर्क-व्यापी सॉफ़्टवेयर कमजोरियों के जोखिम को कम करती है। बिटकॉइन नेटवर्क एक दिलचस्प मिसाल पेश करता है - जबकि कई क्लाइंट कार्यान्वयन मौजूद हैं, बिटकॉइन कोर एक वास्तविक कैनोनिकल क्लाइंट के रूप में कार्य करता है, जो व्यावहारिक नेटवर्क व्यवहार को परिभाषित करने वाला संदर्भ कार्यान्वयन प्रदान करता है। हालाँकि, उच्च-प्रदर्शन वाले ब्लॉकचेन नेटवर्क में, प्रोटोकॉल और क्लाइंट कार्यान्वयन के बीच संबंध अधिक सीमित हो जाता है। जब कोई प्रोटोकॉल कंप्यूटिंग और नेटवर्किंग हार्डवेयर की
भौतिक सीमाओं के करीब पहुँचता है, तो कार्यान्वयन
विविधता के लिए जगह स्वाभाविक रूप से सिकुड़ जाती है। इन प्रदर्शन सीमाओं पर, इष्टतम कार्यान्वयनों को
समान समाधानों पर अभिसरित होना चाहिए क्योंकि वे समान भौतिक सीमाओं और
प्रदर्शन आवश्यकताओं का सामना करते हैं। इष्टतम कार्यान्वयन
पैटर्न से कोई भी महत्वपूर्ण विचलन निम्न प्रदर्शन का कारण बनेगा जो क्लाइंट को सत्यापनकर्ता संचालन के लिए अव्यवहार्य बना देगा।
यह गतिशीलता विशेष रूप से न्यूनतम संभव ब्लॉक समय
और अधिकतम लेनदेन थ्रूपुट को लक्षित करने वाले नेटवर्क में दिखाई देती है। ऐसी प्रणालियों में, क्लाइंट
विविधता के सैद्धांतिक लाभ कम प्रासंगिक हो जाते हैं, क्योंकि विभिन्न क्लाइंट कार्यान्वयनों के बीच संगतता बनाए रखने का ओवरहेड स्वयं एक प्रदर्शन बाधा बन सकता है। जब ब्लॉकचेन प्रदर्शन को भौतिक सीमाओं तक बढ़ाया जाता है, तो क्लाइंट कार्यान्वयन अनिवार्य रूप से
मुख्य वास्तुशिल्प निर्णयों को साझा करेंगे, जिससे कार्यान्वयन
विविधता के सुरक्षा लाभ काफी हद तक सैद्धांतिक हो जाते हैं।

3.3 प्रदर्शनकारी क्लाइंट के लिए प्रोटोकॉल प्रोत्साहन
हालांकि फोगो किसी भी अनुरूप क्लाइंट कार्यान्वयन की अनुमति देता है, लेकिन इसकी वास्तुकला स्वाभाविक रूप से
उच्च-प्रदर्शन वाले सह-स्थित संचालनों की व्यावहारिक माँगों से प्रेरित होकर, उपलब्ध सर्वोच्च प्रदर्शन करने वाले क्लाइंट के उपयोग को प्रोत्साहित करती है।
पारंपरिक नेटवर्कों के विपरीत, जहाँ भौगोलिक दूरी मुख्य बाधाएँ पैदा करती है,
फोगो के सह-स्थित डिज़ाइन का अर्थ है कि क्लाइंट कार्यान्वयन दक्षता सीधे सत्यापनकर्ता के प्रदर्शन को निर्धारित करती है। इस वातावरण में, नेटवर्क विलंबता न्यूनतम होती है, जिससे क्लाइंट
गति एक महत्वपूर्ण कारक बन जाती है।
नेटवर्क के गतिशील ब्लॉक समय और आकार पैरामीटर थ्रूपुट को अधिकतम करने के लिए आर्थिक दबाव बनाते हैं। सत्यापनकर्ताओं को सबसे तेज़ क्लाइंट का उपयोग करने या दंड और कम राजस्व का जोखिम उठाने के बीच चयन करना होगा। धीमे क्लाइंट चलाने वाले या तो आक्रामक पैरामीटर के लिए वोट करके ब्लॉक खोने का जोखिम उठाते हैं या रूढ़िवादी पैरामीटर के लिए वोट करके राजस्व खो देते हैं।
यह सबसे कुशल क्लाइंट कार्यान्वयन के लिए प्राकृतिक चयन बनाता है। फोगो के सह-स्थित वातावरण में, छोटे-छोटे प्रदर्शन अंतर भी महत्वपूर्ण हो जाते हैं - एक थोड़ा धीमा क्लाइंट लगातार कम प्रदर्शन करेगा, जिसके परिणामस्वरूप ब्लॉक छूट जाएँगे और दंड भी मिलेंगे। यह अनुकूलन सत्यापनकर्ता के स्वार्थ से होता है, प्रोटोकॉल नियमों से नहीं।
हालाँकि क्लाइंट की पसंद को प्रोटोकॉल द्वारा सीधे लागू नहीं किया जा सकता, लेकिन आर्थिक दबाव स्वाभाविक रूप से नेटवर्क को प्रतिस्पर्धी क्लाइंट विकास को बनाए रखते हुए सबसे कुशल कार्यान्वयन की ओर ले जाते हैं।

4. बहु-स्थानीय सहमति
बहु-स्थानीय सहमति ब्लॉकचेन सहमति के लिए एक नए दृष्टिकोण का प्रतिनिधित्व करती है जो सत्यापनकर्ता सह-स्थित के प्रदर्शन लाभों को भौगोलिक वितरण के सुरक्षा लाभों के साथ गतिशील रूप से संतुलित करती है। यह प्रणाली सत्यापनकर्ताओं को विभिन्न क्षेत्रों के लिए अलग-अलग क्रिप्टोग्राफ़िक पहचान बनाए रखते हुए विभिन्न युगों में अपने भौतिक स्थानों का समन्वय करने की अनुमति देती है, जिससे नेटवर्क सामान्य संचालन के दौरान अति-निम्न विलंबता सहमति प्राप्त कर सकता है और आवश्यकता पड़ने पर वैश्विक सहमति पर वापस लौटने की क्षमता को बनाए रख सकता है।
फोगो का बहु-स्थानीय सहमति मॉडल पारंपरिक वित्तीय बाजारों में स्थापित प्रथाओं से प्रेरणा लेता है, विशेष रूप से विदेशी मुद्रा और अन्य वैश्विक बाजारों में प्रयुक्त "सूर्य का अनुसरण करें" व्यापार मॉडल से। पारंपरिक वित्त में, बाजार निर्माण और तरलता प्रावधान स्वाभाविक रूप से प्रमुख वित्तीय केंद्रों के बीच स्थानांतरित हो जाते हैं जैसे-जैसे व्यापारिक दिन आगे बढ़ता है - एशिया से यूरोप और उत्तरी अमेरिका तक - जिससे विशिष्ट भौगोलिक क्षेत्रों में केंद्रित तरलता बनाए रखते हुए निरंतर बाजार संचालन संभव होता है। यह मॉडल पारंपरिक वित्त में प्रभावी साबित हुआ है क्योंकि यह मानता है कि बाजार वैश्विक होते हुए भी, नेटवर्किंग की भौतिक सीमाएँ और मानवीय प्रतिक्रिया समय इष्टतम मूल्य खोज और बाजार दक्षता के लिए कुछ हद तक भौगोलिक संकेंद्रण को आवश्यक बनाते हैं।

4.1 क्षेत्र और क्षेत्र घूर्णन
एक क्षेत्र एक भौगोलिक क्षेत्र का प्रतिनिधित्व करता है जहाँ सत्यापनकर्ता इष्टतम सर्वसम्मति प्रदर्शन प्राप्त करने के लिए सह-स्थित होते हैं। आदर्श रूप से, एक क्षेत्र एक एकल डेटा केंद्र होता है जहाँ सत्यापनकर्ताओं के बीच नेटवर्क विलंबता हार्डवेयर सीमाओं के करीब पहुँच जाती है। हालाँकि, जब आवश्यक हो, तो क्षेत्र बड़े क्षेत्रों को शामिल करने के लिए विस्तारित हो सकते हैं, व्यावहारिक विचारों के लिए कुछ प्रदर्शन का व्यापार कर सकते हैं। किसी ज़ोन की सटीक परिभाषा प्रोटोकॉल में सख्ती से परिभाषित होने के बजाय, सत्यापनकर्ताओं के बीच सामाजिक सहमति से उभरती है। यह लचीलापन नेटवर्क को प्रदर्शन उद्देश्यों को बनाए रखते हुए वास्तविक दुनिया की बुनियादी ढाँचे की बाधाओं के अनुकूल होने की अनुमति देता है। ज़ोन के बीच घूमने की नेटवर्क की क्षमता कई महत्वपूर्ण उद्देश्यों की पूर्ति करती है: 1. क्षेत्राधिकार विकेंद्रीकरण: नियमित ज़ोन रोटेशन किसी एक क्षेत्राधिकार द्वारा सहमति पर कब्ज़ा करने से रोकता है। यह नियामक दबाव के प्रति नेटवर्क के प्रतिरोध को बनाए रखता है और यह सुनिश्चित करता है कि कोई भी सरकार या प्राधिकरण नेटवर्क संचालन पर दीर्घकालिक नियंत्रण नहीं रख सकता है। 2. बुनियादी ढाँचे का लचीलापन: डेटा केंद्र और क्षेत्रीय बुनियादी ढाँचा कई कारणों से विफल हो सकते हैं - प्राकृतिक आपदाएँ, बिजली कटौती, नेटवर्किंग समस्याएँ, हार्डवेयर विफलताएँ, या रखरखाव आवश्यकताएँ। ज़ोन रोटेशन सुनिश्चित करता है कि नेटवर्क किसी एक विफलता बिंदु पर स्थायी रूप से निर्भर न रहे। प्रमुख डेटा केंद्र आउटेज के ऐतिहासिक उदाहरण, जैसे कि गंभीर मौसम की घटनाओं या पावर ग्रिड विफलताओं के कारण, इस लचीलेपन के महत्व को प्रदर्शित करते हैं। 3. रणनीतिक प्रदर्शन अनुकूलन: विशिष्ट नेटवर्क गतिविधियों के लिए अनुकूलन हेतु क्षेत्रों का चयन किया जा सकता है। उदाहरण के लिए, महत्वपूर्ण वित्तीय घटनाओं (जैसे फेडरल रिजर्व की घोषणाएँ, प्रमुख आर्थिक रिपोर्टें, या बाज़ार खुलने) वाले युगों के दौरान, सत्यापनकर्ता इस मूल्य-संवेदनशील जानकारी के स्रोत के निकट सर्वसम्मति का पता लगाना चुन सकते हैं। यह क्षमता नेटवर्क को महत्वपूर्ण कार्यों के लिए विलंबता को कम करने और साथ ही विभिन्न युगों में विभिन्न उपयोग मामलों के लिए लचीलापन बनाए रखने में सक्षम बनाती है।

4.2 कुंजी प्रबंधन
यह प्रोटोकॉल एक द्वि-स्तरीय कुंजी प्रबंधन प्रणाली लागू करता है जो दीर्घकालिक
सत्यापनकर्ता पहचान को क्षेत्र-विशिष्ट सहमति भागीदारी से अलग करता है। प्रत्येक सत्यापनकर्ता एक
वैश्विक कुंजी युग्म बनाए रखता है जो नेटवर्क में उनकी मूल पहचान के रूप में कार्य करता है। इस वैश्विक कुंजी का उपयोग
उच्च-स्तरीय संचालन जैसे कि हिस्सेदारी प्रत्यायोजन, क्षेत्र पंजीकरण और
वैश्विक सहमति में भागीदारी के लिए किया जाता है। वैश्विक कुंजी को उच्चतम संभव सुरक्षा उपायों के साथ सुरक्षित किया जाना चाहिए, क्योंकि यह नेटवर्क में सत्यापनकर्ता के अंतिम अधिकार का प्रतिनिधित्व करती है।
इसके बाद सत्यापनकर्ता एक ऑन-चेन
रजिस्ट्री प्रोग्राम के माध्यम से क्षेत्र-विशिष्ट उप-कुंजियों को अधिकार सौंप सकते हैं। ये उप-कुंजियाँ निर्दिष्ट सह-स्थान क्षेत्रों के भीतर सहमति भागीदारी के लिए विशेष रूप से अधिकृत हैं। यह पृथक्करण कई सुरक्षा उद्देश्यों की पूर्ति करता है: यह
सत्यापनकर्ताओं को विभिन्न कुंजी प्रकारों के लिए अलग-अलग सुरक्षा मॉडल बनाए रखने की अनुमति देता है, यह
सामान्य संचालन के दौरान वैश्विक कुंजियों को ऑनलाइन रखकर उनके प्रदर्शन को कम करता है, और यह
क्षेत्रों के बीच भौतिक अवसंरचना संक्रमण के दौरान कुंजी के समझौता होने के जोखिम को कम करता है।
ज़ोन-विशिष्ट कुंजियों का प्रत्यायोजन एक ऑन-चेन प्रोग्राम के माध्यम से प्रबंधित किया जाता है जो
प्रत्येक सत्यापनकर्ता के लिए अधिकृत ज़ोन कुंजियों की एक रजिस्ट्री बनाए रखता है। हालाँकि सत्यापनकर्ता अपनी वैश्विक कुंजी का उपयोग करके किसी भी समय नई ज़ोन कुंजियाँ पंजीकृत कर सकते हैं, ये पंजीकरण केवल
युग सीमाओं पर ही प्रभावी होते हैं। यह विलंब सुनिश्चित करता है कि सभी नेटवर्क प्रतिभागियों के पास सहमति में सक्रिय होने से पहले नई कुंजी प्रत्यायोजनों को सत्यापित करने और रिकॉर्ड करने का समय हो।

4.3 ज़ोन प्रस्ताव और सक्रियण
वैश्विक कुंजियों का उपयोग करके एक ऑन-चेन शासन तंत्र के माध्यम से नए ज़ोन प्रस्तावित किए जा सकते हैं। हालाँकि, नेटवर्क स्थिरता सुनिश्चित करने और सत्यापनकर्ताओं को सुरक्षित बुनियादी ढाँचा तैयार करने के लिए पर्याप्त समय देने के लिए, प्रस्तावित ज़ोन के चयन के लिए योग्य होने से पहले एक अनिवार्य विलंब अवधि होती है। प्रोटोकॉल पैरामीटर के रूप में निर्धारित यह विलंब, सत्यापनकर्ताओं को निम्नलिखित कार्य करने की अनुमति देने के लिए पर्याप्त रूप से लंबा होना चाहिए:
● नए ज़ोन में उपयुक्त भौतिक अवसंरचना सुरक्षित करना
● नए स्थान के लिए सुरक्षित कुंजी प्रबंधन प्रणालियाँ स्थापित करना
● नेटवर्किंग अवसंरचना स्थापित करना और उसका परीक्षण करना
● नई सुविधा का आवश्यक सुरक्षा ऑडिट करना
● बैकअप और पुनर्प्राप्ति प्रक्रियाएँ स्थापित करना
विलंब अवधि संभावित हमलों के विरुद्ध एक सुरक्षा उपाय के रूप में भी कार्य करती है, जहाँ कोई
दुर्भावनापूर्ण व्यक्ति किसी ऐसे ज़ोन में सहमति को लागू करने का प्रयास कर सकता है जहाँ उसके पास
अवसंरचनात्मक लाभ हैं। नए ज़ोन के लिए अग्रिम सूचना की आवश्यकता के द्वारा, प्रोटोकॉल
यह सुनिश्चित करता है कि सभी सत्यापनकर्ताओं को किसी भी ज़ोन में उपस्थिति स्थापित करने का उचित अवसर मिले, जिसे
सहमति के लिए चुना जा सकता है।
किसी ज़ोन द्वारा इस प्रतीक्षा अवधि को पूरा करने के बाद ही उसे भविष्य के युगों के लिए नियमित
ज़ोन वोटिंग प्रक्रिया के माध्यम से चुना जा सकता है। ज़ोन सक्रियण के प्रति यह सावधानीपूर्वक दृष्टिकोण नेटवर्क सुरक्षा और स्थिरता बनाए रखने में मदद करता है, साथ ही नेटवर्क आवश्यकताओं के विकसित होने पर नए रणनीतिक
स्थानों को जोड़ने की अनुमति भी देता है।

4.4 ज़ोन चयन मतदान प्रक्रिया
सर्वसम्मति ज़ोन का चयन एक ऑन-चेन मतदान तंत्र के माध्यम से होता है जो
समन्वित सत्यापनकर्ता संचलन की आवश्यकता को नेटवर्क सुरक्षा के साथ संतुलित करता है। सत्यापनकर्ताओं को
प्रत्येक भावी युग के सह-स्थान ज़ोन पर युग परिवर्तन से पहले एक विन्यास योग्य
कोरम समय के भीतर कोरम प्राप्त करना होगा। व्यवहार में, युग अनुसूची को
कुछ लीड समय के साथ निर्धारित किया जा सकता है, जैसे कि युग n के दौरान मतदान, युग n + k के लिए ज़ोन का चयन करता है। वोट सत्यापनकर्ताओं की वैश्विक
कुंजियों का उपयोग करके एक ऑन-चेन रजिस्ट्री प्रोग्राम के माध्यम से डाले जाते हैं, जिसमें मतदान शक्ति हिस्सेदारी द्वारा भारित होती है। यह प्रक्रिया ज़ोन
कुंजियों के बजाय वैश्विक कुंजियों का उपयोग करती है क्योंकि यह विलंबता-संवेदनशील नहीं है और इसके लिए अधिकतम सुरक्षा की आवश्यकता होती है।
मतदान प्रक्रिया में कोरम स्थापित करने के लिए हिस्सेदारी भार के एक बड़े बहुमत की आवश्यकता होती है, यह सुनिश्चित करते हुए कि
सत्यापनकर्ताओं का एक छोटा समूह एकतरफा ज़ोन परिवर्तन को बाध्य नहीं कर सकता। यदि सत्यापनकर्ता निर्दिष्ट समय सीमा के भीतर कोरम प्राप्त करने में विफल रहते हैं, तो नेटवर्क स्वचालित रूप से अगले युग के लिए
वैश्विक सहमति मोड पर डिफ़ॉल्ट हो जाता है। यह फ़ॉलबैक तंत्र नेटवर्क
निरंतरता सुनिश्चित करता है, तब भी जब सत्यापनकर्ता किसी सह-स्थान क्षेत्र पर सहमत नहीं हो पाते।
मतदान अवधि के दौरान, सत्यापनकर्ता अगले युग के लिए अपने पसंदीदा क्षेत्र
और उस क्षेत्र के लिए अपने लक्षित ब्लॉक समय, दोनों का संकेत देते हैं। स्थान और प्रदर्शन
मापदंडों का यह संयुक्त चयन नेटवर्क को प्रत्येक क्षेत्र की भौतिक बाधाओं और प्रदर्शन
क्षमताओं, दोनों के लिए अनुकूलित करने की अनुमति देता है। महत्वपूर्ण रूप से, मतदान अवधि सत्यापनकर्ताओं को चयनित क्षेत्र में बुनियादी ढाँचा तैयार करने का समय प्रदान करती है, जिसमें क्षेत्र-विशिष्ट कुंजियों को तैयार करना और नेटवर्क कनेक्टिविटी का परीक्षण करना शामिल है। यह तैयारी अवधि क्षेत्र संक्रमणों के दौरान नेटवर्क
स्थिरता बनाए रखने के लिए महत्वपूर्ण है।

4.5 वैश्विक सहमति मोड
वैश्विक सहमति मोड प्रोटोकॉल की एक फ़ॉलबैक प्रणाली और एक आधारभूत सुरक्षा
विशेषता दोनों के रूप में कार्य करता है। जबकि फ़ोगो ज़ोन-आधारित
सहमति के माध्यम से अपना सर्वोच्च प्रदर्शन प्राप्त करता है, वैश्विक सहमति पर वापस लौटने की क्षमता प्रतिकूल परिस्थितियों में नेटवर्क के निरंतर
संचालन को सुनिश्चित करती है। वैश्विक सहमति मोड में, नेटवर्क वैश्विक रूप से वितरित सत्यापन के लिए अनुकूलित रूढ़िवादी मापदंडों के साथ संचालित होता है: भौगोलिक रूप से बिखरे हुए सत्यापनकर्ताओं के बीच उच्च नेटवर्क विलंबता को समायोजित करने के लिए एक निश्चित 400ms ब्लॉक
समय और कम ब्लॉक आकार।
प्रोटोकॉल दो प्राथमिक मार्गों के माध्यम से वैश्विक सहमति मोड में प्रवेश करता है:
● विफल ज़ोन चयन: यदि सत्यापनकर्ता निर्दिष्ट मतदान अवधि के भीतर अगले युग के
सहमति क्षेत्र पर कोरम प्राप्त करने में विफल रहते हैं, तो नेटवर्क स्वचालित रूप से
उस युग के लिए वैश्विक सहमति पर डिफ़ॉल्ट हो जाता है।
● रनटाइम सहमति विफलता: यदि वर्तमान ज़ोन किसी युग के दौरान अपनी निर्दिष्ट समय-सीमा अवधि के भीतर ब्लॉक अंतिमता प्राप्त करने में विफल रहता है, तो प्रोटोकॉल तुरंत उस युग के शेष भाग के लिए
वैश्विक सहमति मोड में बदल जाता है। यह फ़ॉलबैक "चिपचिपा" है -
एक बार युग के मध्य में ट्रिगर होने पर, नेटवर्क अगले युग संक्रमण तक वैश्विक सहमति में बना रहता है,
प्रदर्शन पुनर्प्राप्ति पर स्थिरता को प्राथमिकता देता है।
वैश्विक सहमति मोड में, सत्यापनकर्ता वैश्विक संचालन के लिए एक निर्दिष्ट कुंजी का उपयोग करके भाग लेते हैं,
जो उनकी ज़ोन-विशिष्ट कुंजियों में से एक हो भी सकती है और नहीं भी, और नेटवर्क
ज़ोन-आधारित सहमति के समान फ़ॉर्क चयन नियमों को बनाए रखता है। हालाँकि यह मोड सह-स्थित ज़ोन में प्राप्त होने वाली
अति-निम्न विलंबता का त्याग करता है, यह नेटवर्क निरंतरता के लिए एक मज़बूत आधार प्रदान करता है और दर्शाता है कि कैसे Fogo खराब परिस्थितियों में
सक्रियता का त्याग किए बिना सुरक्षा बनाए रखता है।

5. सत्यापनकर्ता सेट
उच्च प्रदर्शन प्राप्त करने और अनुचित MEV प्रथाओं को कम करने के लिए, Fogo एक
क्यूरेटेड सत्यापनकर्ता सेट का उपयोग करेगा। यह आवश्यक है क्योंकि कम प्रावधान वाले
सत्यापन नोड्स का एक छोटा सा अंश भी नेटवर्क को उसकी भौतिक प्रदर्शन सीमाओं तक पहुँचने से रोक सकता है।
प्रारंभ में, क्यूरेशन, सत्यापनकर्ता सेट द्वारा प्रत्यक्ष
अनुमति में परिवर्तित होने से पहले, प्राधिकरण प्रमाण के माध्यम से संचालित होगा। सत्यापनकर्ता सेट के साथ क्यूरेशन प्राधिकरण रखकर,
Fogo एक पारंपरिक
प्राधिकरण प्रमाण प्रणाली की तरह अपमानजनक व्यवहार के लिए सामाजिक स्तर पर दंड लागू कर सकता है, लेकिन इस तरह से कि यह उस फोर्क पावर से अधिक केंद्रीकृत न हो जो
सोलाना जैसे पारंपरिक PoS नेटवर्क में पहले से ही 2/3 हिस्सेदारी रखती है।

5.1 आकार और प्रारंभिक कॉन्फ़िगरेशन
Fogo एक अनुमति प्राप्त सत्यापनकर्ता सेट को प्रोटोकॉल-प्रवर्तित न्यूनतम और
अधिकतम संख्या में सत्यापनकर्ताओं के साथ बनाए रखता है ताकि नेटवर्क प्रदर्शन के लिए अनुकूलन करते हुए पर्याप्त विकेंद्रीकरण सुनिश्चित किया जा सके।
प्रारंभिक लक्ष्य आकार लगभग 20-50 सत्यापनकर्ता होंगे, हालाँकि
यह सीमा एक प्रोटोकॉल पैरामीटर के रूप में लागू की जाती है जिसे नेटवर्क के परिपक्व होने पर समायोजित किया जा सकता है। उत्पत्ति के समय, प्रारंभिक सत्यापनकर्ता सेट का चयन एक उत्पत्ति प्राधिकरण द्वारा किया जाएगा, जो नेटवर्क के प्रारंभिक चरणों के दौरान सत्यापनकर्ता सेट संरचना को प्रबंधित करने के लिए अस्थायी अनुमतियाँ बनाए रखेगा।

5.2 शासन और संक्रमण
सत्यापनकर्ता सेट सदस्यता पर उत्पत्ति प्राधिकरण का नियंत्रण अस्थायी रूप से डिज़ाइन किया गया है। नेटवर्क स्थिरीकरण की प्रारंभिक अवधि के बाद, यह प्राधिकरण सत्यापनकर्ता सेट में ही स्थानांतरित हो जाएगा। इस संक्रमण के बाद, सत्यापनकर्ता सेट सदस्यता में परिवर्तन के लिए स्टेक किए गए टोकन के दो-तिहाई बहुमत की आवश्यकता होगी, जो प्रूफ-ऑफ-स्टेक नेटवर्क में प्रोटोकॉल-स्तरीय परिवर्तनों के लिए आवश्यक सीमा से मेल खाता हो।
नेटवर्क को अस्थिर कर सकने वाले अचानक परिवर्तनों को रोकने के लिए, प्रोटोकॉल पैरामीटर सत्यापनकर्ता टर्नओवर दरों को सीमित करते हैं। किसी निश्चित समयावधि के भीतर सत्यापनकर्ता सेट के एक निश्चित प्रतिशत से अधिक को प्रतिस्थापित या हटाया नहीं जा सकता है, जहाँ यह प्रतिशत एक ट्यूनेबल प्रोटोकॉल पैरामीटर है। यह नेटवर्क स्थिरता बनाए रखते हुए सत्यापनकर्ता सेट के क्रमिक विकास को सुनिश्चित करता है।

5.3 भागीदारी आवश्यकताएँ
सत्यापनकर्ताओं को सत्यापनकर्ता सेट के लिए पात्र होने के लिए न्यूनतम प्रत्यायोजित हिस्सेदारी की आवश्यकताओं को पूरा करना होगा,
और अनुमति प्राप्त घटक जोड़ते समय सोलाना के आर्थिक मॉडल के साथ संगतता बनाए रखनी होगी। यह दोहरी आवश्यकता - पर्याप्त हिस्सेदारी और सेट अनुमोदन -
यह सुनिश्चित करती है कि सत्यापनकर्ताओं के पास खेल में आर्थिक भागीदारी और नेटवर्क प्रदर्शन को बनाए रखने की
परिचालन क्षमताएँ दोनों हों।

5.4 औचित्य और नेटवर्क शासन
अनुमति प्राप्त सत्यापनकर्ता सेट नेटवर्क विकेंद्रीकरण को भौतिक रूप से प्रभावित नहीं करता है, क्योंकि
किसी भी प्रूफ-ऑफ-स्टेक नेटवर्क में, स्टेक का दो-तिहाई बहुमत पहले से ही
फ़ोर्किंग के माध्यम से प्रोटोकॉल में मनमाने बदलावों को प्रभावित कर सकता है। इसके बजाय, यह तंत्र सत्यापनकर्ता सेट के लिए एक औपचारिक ढाँचा प्रदान करता है ताकि लाभकारी नेटवर्क व्यवहारों को लागू किया जा सके, जिन्हें
अन्यथा प्रोटोकॉल नियमों में एनकोड करना मुश्किल हो सकता है।
उदाहरण के लिए, सत्यापनकर्ताओं को बाहर निकालने की क्षमता नेटवर्क को इन पर प्रतिक्रिया देने में सक्षम बनाती है:
● लगातार प्रदर्शन संबंधी समस्याएँ जो नेटवर्क क्षमताओं को कम करती हैं
● अनुचित MEV निष्कर्षण जो नेटवर्क की उपयोगिता को नुकसान पहुँचाता है
● नेटवर्क को अस्थिर करने वाला व्यवहार जिसे सीधे प्रोटोकॉल में लागू नहीं किया जा सकता, जैसे
लीचिंग लेकिन टर्बाइन ब्लॉक को अग्रेषित न करना
● अन्य व्यवहार जो, व्यक्तिगत सत्यापनकर्ताओं के लिए संभावित रूप से लाभदायक होते हुए भी, नेटवर्क के दीर्घकालिक मूल्य को नुकसान पहुँचाते हैं
यह शासन तंत्र यह मानता है कि कुछ व्यवहार अल्पावधि में लाभदायक हो सकते हैं, लेकिन वे नेटवर्क की दीर्घकालिक व्यवहार्यता को नुकसान पहुँचा सकते हैं।
स्टेक-भारित सत्यापनकर्ता सेट को सदस्यता नियंत्रण के माध्यम से ऐसे व्यवहारों पर नज़र रखने में सक्षम बनाकर, फ़ोगो
प्रूफ-ऑफ-स्टेक सिस्टम में निहित मूलभूत विकेंद्रीकरण गुणों से समझौता किए बिना सत्यापनकर्ता प्रोत्साहनों को नेटवर्क के दीर्घकालिक स्वास्थ्य के साथ संरेखित करता है।

6. संभावित विस्तार
हालांकि फोगो के मुख्य नवाचार बहु-स्थानीय सहमति, क्लाइंट प्रदर्शन और
सत्यापनकर्ता सेट प्रबंधन पर केंद्रित हैं, कई अतिरिक्त प्रोटोकॉल विस्तार विचाराधीन हैं
या तो उत्पत्ति या लॉन्च के बाद कार्यान्वयन के लिए। ये सुविधाएँ सोलाना
पारिस्थितिकी तंत्र के साथ पश्चगामी संगतता बनाए रखते हुए नेटवर्क कार्यक्षमता को और बेहतर बनाएँगी।

6.1 एसपीएल टोकन शुल्क भुगतान
व्यापक नेटवर्क पहुँच को सक्षम करने और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए, फोगो संभावित रूप से
एक शुल्क_भुगतानकर्ता_अहस्ताक्षरित लेनदेन प्रकार पेश करेगा जो लेनदेन को मूल खाते में एसओएल के बिना निष्पादित करने की अनुमति देता है। यह सुविधा, एक ऑन-चेन शुल्क
भुगतान कार्यक्रम के साथ मिलकर, उपयोगकर्ताओं को प्रोटोकॉल सुरक्षा और सत्यापनकर्ता क्षतिपूर्ति को बनाए रखते हुए एसपीएल टोकन का उपयोग करके लेनदेन शुल्क का भुगतान करने में सक्षम बनाती है।
यह प्रणाली प्रोटोकॉल से बाहर अनुमति रहित रिलेअर मार्केटप्लेस के माध्यम से काम करती है। उपयोगकर्ता
ऐसे लेनदेन बनाते हैं जिनमें उनके इच्छित संचालन और अंतिम शुल्क भुगतानकर्ता को क्षतिपूर्ति करने के लिए एक एसपीएल टोकन
भुगतान दोनों शामिल होते हैं। इन लेन-देनों पर बिना किसी शुल्क भुगतानकर्ता को निर्दिष्ट किए वैध रूप से हस्ताक्षर किए जा सकते हैं, जिससे कोई भी पक्ष अपने हस्ताक्षर करके और SOL शुल्क का भुगतान करके इन्हें पूरा कर सकता है। यह तंत्र प्रभावी रूप से लेनदेन प्राधिकरण को शुल्क भुगतान से अलग करता है, जिससे शून्य SOL शेष वाले खाते नेटवर्क के साथ तब तक बातचीत कर सकते हैं जब तक उनके पास अन्य मूल्यवान संपत्तियाँ मौजूद हों। यह सुविधा न्यूनतम प्रोटोकॉल संशोधनों के माध्यम से कार्यान्वित की जाती है, जिसके लिए केवल नए लेनदेन प्रकार और रिलेयर मुआवजे को संभालने के लिए एक ऑन-चेन प्रोग्राम जोड़ने की आवश्यकता होती है। यह प्रणाली अंतर्निहित प्रोटोकॉल के सुरक्षा गुणों को बनाए रखते हुए लेनदेन रिले सेवाओं के लिए एक कुशल बाजार बनाती है। अधिक जटिल शुल्क अमूर्तन प्रणालियों के विपरीत, इस दृष्टिकोण के लिए सत्यापनकर्ता भुगतान तंत्र या सहमति नियमों में किसी बदलाव की आवश्यकता नहीं होती है।

7. निष्कर्ष
फोगो ब्लॉकचेन आर्किटेक्चर के लिए एक नए दृष्टिकोण का प्रतिनिधित्व करता है जो प्रदर्शन, विकेंद्रीकरण और सुरक्षा के बीच संबंधों के बारे में पारंपरिक मान्यताओं को चुनौती देता है। उच्च-प्रदर्शन क्लाइंट कार्यान्वयन को गतिशील बहु-स्थानीय
सहमति और क्यूरेटेड सत्यापनकर्ता सेटों के साथ जोड़कर, प्रोटोकॉल अभूतपूर्व प्रदर्शन प्राप्त करता है
बिना प्रूफ-ऑफ-स्टेक सिस्टम के मूलभूत सुरक्षा गुणों से समझौता किए।
भौगोलिक विविधता को बनाए रखते हुए सर्वसम्मति को गतिशील रूप से स्थानांतरित करने की क्षमता
प्रदर्शन अनुकूलन और प्रणालीगत लचीलापन दोनों प्रदान करती है, जबकि प्रोटोकॉल के फ़ॉलबैक
तंत्र प्रतिकूल परिस्थितियों में निरंतर संचालन सुनिश्चित करते हैं।
सावधानीपूर्वक आर्थिक डिज़ाइन के माध्यम से, ये तंत्र प्रोटोकॉल प्रवर्तन के बजाय सत्यापनकर्ता
प्रोत्साहनों से स्वाभाविक रूप से उभरते हैं, जिससे एक मजबूत और अनुकूलनीय
प्रणाली का निर्माण होता है। जैसे-जैसे ब्लॉकचेन तकनीक विकसित होती जा रही है, फोगो के नवाचार प्रदर्शित करते हैं
कि कैसे विचारशील प्रोटोकॉल डिज़ाइन प्रदर्शन की सीमाओं को आगे बढ़ा सकता है
और साथ ही सुरक्षा और विकेंद्रीकरण गुणों को बनाए रखता है जो ब्लॉकचेन नेटवर्क को
मूल्यवान बनाते हैं।
`

// Japanese
const JAPANESE_TEXT = `
Fogo：高性能SVMレイヤー1
バージョン1.0
概要
本稿では、スループット、レイテンシ、輻輳管理において画期的なパフォーマンスを提供する、画期的なレイヤー1ブロックチェーンプロトコル、Fogoを紹介します。Solanaプロトコルの拡張として、FogoはSVM実行レイヤーでの完全な互換性を維持し、既存のSolanaプログラム、ツール、インフラストラクチャをシームレスに移行しながら、大幅なパフォーマンス向上とレイテンシ低減を実現します。Fogoは3つの革新的なイノベーションをもたらします。
● 純粋なFiredancerに基づく統合クライアント実装により、Solana自体を含む低速クライアントを持つネットワークでは達成できないパフォーマンスレベルを実現します。
● 動的コロケーションによるマルチローカルコンセンサスにより、主要なブロックチェーンをはるかに下回るブロック生成時間とレイテンシを実現します。
● 高性能を奨励し、バリデータレベルでの略奪的行動を抑止する、厳選されたバリデータセット。これらのイノベーションは、レイヤー1ブロックチェーンに不可欠な分散性と堅牢性を維持しながら、大幅なパフォーマンス向上を実現します。

1. はじめに
ブロックチェーンネットワークは、パフォーマンスと分散性、そしてセキュリティのバランスを取るという継続的な課題に直面しています。今日のブロックチェーンは、深刻なスループット制限に悩まされており、グローバルな金融活動には適していません。Ethereumはベースレイヤーで1秒あたり50件未満のトランザクション（TPS）しか処理できません。最も集中化されたレイヤー2でさえ、1,000TPS未満しか処理できません。Solanaはより高いパフォーマンスを実現するように設計されましたが、クライアントの多様性による制限により、現在5,000TPSで輻輳が発生しています。対照的に、NASDAQ、CME、Eurexなどの従来の金融システムは、1秒あたり10万件を超える操作を定期的に処理しています。
レイテンシは、分散型ブロックチェーンプロトコルにとってもう1つの重要な制約となります。金融市場、特に変動の激しい資産の価格発見においては、低レイテンシが市場の質と流動性にとって不可欠です。従来の市場参加者は、エンドツーエンドでミリ秒またはミリ秒未満のレイテンシで取引を行っています。このような速度は、光速の制約により、市場参加者が実行環境と共存できる場合にのみ実現可能です。従来のブロックチェーンアーキテクチャは、地理的な制約なしに動作するグローバルに分散されたバリデータセットを使用しているため、根本的なパフォーマンス制限が生じます。光自体は、赤道上で地球を一周するのに、たとえ完全な円を描いて移動したとしても130ミリ秒以上かかります。また、現実世界のネットワークパスには、追加の距離とインフラストラクチャの遅延が伴います。コンセンサスにバリデータ間の複数回の通信ラウンドが必要な場合、これらの物理的な制限はさらに複雑になります。これらの地域間のレイテンシは、コンセンサスにバリデータ間の複数回の通信ラウンドが必要な場合、さらに複雑になります。その結果、ネットワークは安定性を維持するために、保守的なブロック生成時間とファイナリティ遅延を実装する必要があります。最適な条件下でも、グローバルに分散されたコンセンサスメカニズムは、これらの基本的なネットワーク遅延を克服できません。ブロックチェーンがグローバル金融システムとの統合を進めるにつれ、ユーザーは今日の中央集権型システムに匹敵するパフォーマンスを求めるようになるでしょう。綿密な設計がなければ、これらの要求を満たすことはブロックチェーンネットワークの分散化と回復力を大きく損なう可能性があります。この課題に対処するため、我々はFogoレイヤー1ブロックチェーンを提案します。Fogoの核となる理念は、2つの主要なアプローチを通じてスループットを最大化し、レイテンシを最小化することです。1つ目は、最適に分散化されたバリデータセット上で最もパフォーマンスの高いクライアントソフトウェアを使用すること、2つ目は、グローバルコンセンサスの分散化の利点の大部分を維持しながら、共存型コンセンサスを採用することです。

2. 概要
本論文は、Fogoに関する主要な設計上の決定を扱うセクションに分かれています。
セクション3では、FogoとSolanaブロックチェーンプロトコルの関係、そしてクライアントの最適化と多様性に関する戦略について説明します。セクション4では、マルチローカルコンセンサス、その実用的な実装、そしてグローバルコンセンサスまたはローカルコンセンサスと比較してFogoが行うトレードオフについて説明します。第5章では、Fogoによるバリデータセットの初期化と維持のアプローチについて説明します。第6章では、ジェネシス後に導入される可能性のある拡張について説明します。

3. プロトコルとクライアント
Fogoは、ベースレイヤーとして、現在最も高性能で広く使用されているブロックチェーンプロトコルであるSolanaをベースに構築されています。Solanaネットワークには、プロトコル設計とクライアント実装の両面において、既に数多くの最適化ソリューションが組み込まれています。Fogoは、SVM実行レイヤーにおける完全な互換性、TowerBFTコンセンサス、Turbineブロック伝播、Solanaリーダーローテーション、その他ネットワークおよびコンセンサスレイヤーの主要コンポーネントとの高度な互換性など、Solanaとの最大限の後方互換性を目指しています。この互換性により、FogoはSolanaエコシステムの既存のプログラム、ツール、インフラストラクチャを容易に統合・展開できるだけでなく、Solanaの継続的なアップストリーム改善の恩恵を受けることができます。ただし、Solanaとは異なり、Fogoは単一の標準クライアントで動作します。この標準クライアントは、Solana上で動作する主要クライアントの中で最も高性能なものになります。これにより、ネットワークは常に最速クライアントの速度で動作するため、Fogoは大幅に高いパフォーマンスを実現できます。一方、クライアントの多様性に制限されるSolanaは、常に最も遅いクライアントの速度によってボトルネックとなります。現在および近い将来、この標準クライアントはFiredancerスタックをベースにします。

3.1 Firedancer
Firedancerは、Jump Cryptoの高性能Solana互換クライアント実装であり、最適化された並列処理、メモリ管理、SIMD命令により、現在のバリデータクライアントよりも大幅に高いトランザクション処理スループットを実現します。
2つのバージョンがあります。「Frankendancer」は、Firedancerの処理エンジンとRustバリデータのネットワークスタックを組み合わせたハイブリッド版で、もう1つはC言語のネットワークスタックを完全に書き換えた完全なFiredancer実装で、現在開発後期段階にあります。
どちらのバージョンも、Solanaプロトコルの互換性を維持しながらパフォーマンスを最大化しています。
完成すれば、純粋なFiredancer実装は新たなパフォーマンスベンチマークを確立し、Fogoの高スループット要件に最適なものになると期待されています。FogoはFrankendancerベースのネットワークから開始し、最終的には純粋なFiredancerに移行します。

3.2 標準クライアント vs. クライアントの多様性
ブロックチェーンプロトコルは、そのルールと仕様を実装するクライアントソフトウェアを通じて動作します。プロトコルはネットワーク動作のルールを定義する一方、クライアントはこれらの仕様を実行可能なソフトウェアに変換します。プロトコルとクライアントの関係は歴史的に様々なモデルを辿ってきました。一部のネットワークはクライアントの多様性を積極的に推進していますが、他のネットワークは自然に標準実装に収束しています。
クライアントの多様性は伝統的に複数の目的を果たします。実装の冗長性を提供し、プロトコルルールの独立した検証を可能にし、理論的にはネットワーク全体のソフトウェア脆弱性のリスクを軽減します。ビットコインネットワークは興味深い先例を示しています。複数のクライアント実装が存在する中で、ビットコインコアは事実上の標準クライアントとして機能し、実用的なネットワーク動作を定義するリファレンス実装を提供しています。
しかし、高性能ブロックチェーンネットワークでは、プロトコルとクライアント実装の関係はより制約されます。プロトコルがコンピューティングおよびネットワークハードウェアの物理的限界に近づくと、実装の多様性の余地は自然に縮小します。これらのパフォーマンスの限界においては、最適な実装は、同じ物理的制限とパフォーマンス要件に直面するため、類似のソリューションに収束する必要があります。最適な実装パターンから大幅に逸脱すると、パフォーマンスが低下し、クライアントはバリデーター操作に使用できなくなります。この傾向は、可能な限り最短のブロック時間と最大のトランザクションスループットを目標とするネットワークで特に顕著です。このようなシステムでは、異なるクライアント実装間の互換性を維持するためのオーバーヘッド自体がパフォーマンスのボトルネックになる可能性があるため、クライアントの多様性の理論的な利点はあまり重要ではなくなります。ブロックチェーンのパフォーマンスを物理的な限界まで押し上げると、クライアント実装は必然的にコアとなるアーキテクチャ上の決定を共有するため、実装の多様性によるセキュリティ上の利点は主に理論的なものになります。

3.3 高性能クライアントに対するプロトコルインセンティブ
Fogoは、準拠するクライアント実装を任意に許可しますが、そのアーキテクチャは、高性能な共存運用の実際的な要求に基づき、利用可能な最高性能のクライアントを使用することを自然に奨励します。
地理的な距離が主なボトルネックとなる従来のネットワークとは異なり、Fogoの共存設計では、クライアント実装の効率性がバリデータのパフォーマンスを直接決定します。この環境ではネットワークの遅延は最小限に抑えられるため、クライアントの速度が重要な要素となります。
ネットワークの動的なブロック時間とサイズパラメータは、スループットを最大化するための経済的プレッシャーを生み出します。バリデータは、最速のクライアントを使用するか、ペナルティと収益減少のリスクを負うかを選択する必要があります。低速なクライアントを実行しているバリデータは、積極的なパラメータに投票することでブロックを見逃すリスクを負うか、保守的なパラメータに投票することで収益を失うリスクを負うかのいずれかになります。
これにより、最も効率的なクライアント実装が自然に選択されます。 Fogoの共存環境では、わずかなパフォーマンスの違いでも大きな影響を与えます。わずかに遅いクライアントは常にパフォーマンスが低下し、ブロック生成の失敗やペナルティにつながります。この最適化は、プロトコルルールではなく、バリデータの自己利益によって行われます。クライアントの選択はプロトコルによって直接強制することはできませんが、経済的なプレッシャーによって、競争力のあるクライアント開発を維持しながら、ネットワークは最も効率的な実装へと自然に導かれます。

4. マルチローカルコンセンサス
マルチローカルコンセンサスは、バリデータ共存によるパフォーマンス上の利点と地理的分散によるセキュリティ上の利点を動的にバランスさせる、ブロックチェーンコンセンサスへの新しいアプローチです。このシステムにより、バリデータはエポック間で物理的な場所を調整しながら、異なるゾーンに異なる暗号IDを維持できます。これにより、ネットワークは通常運用時に超低遅延のコンセンサスを達成しながら、必要に応じてグローバルコンセンサスにフォールバックする能力を維持できます。 Fogoのマルチローカル・コンセンサス・モデルは、伝統的な金融市場、特に外国為替市場やその他のグローバル市場で使用されている「フォロー・ザ・サン」取引モデルにおける確立された慣行から着想を得ています。伝統的な金融では、取引日が進むにつれて、マーケットメイクと流動性の提供は、アジアからヨーロッパ、そして北米へと主要な金融センター間を自然に移動することで、特定の地理的地域に集中した流動性を維持しながら、継続的な市場運営を可能にしています。このモデルは、市場はグローバルであるものの、ネットワークの物理的な限界と人間の反応時間により、最適な価格発見と市場効率にはある程度の地理的集中が必要であることを認識しているため、伝統的な金融において有効性が実証されています。

4.1 ゾーンとゾーンローテーション
ゾーンとは、最適なコンセンサスパフォーマンスを実現するためにバリデーターが共存する地理的領域を表します。理想的には、ゾーンはバリデーター間のネットワーク遅延がハードウェアの限界に近づく単一のデータセンターです。ただし、ゾーンは必要に応じてより広い地域を網羅するように拡張でき、その場合、実用上の考慮事項と引き換えに、ある程度のパフォーマンスを犠牲にすることができます。ゾーンの正確な定義は、プロトコルで厳密に定義されるのではなく、バリデータ間の社会的合意を通じて形成されます。この柔軟性により、ネットワークはパフォーマンス目標を維持しながら、現実世界のインフラの制約に適応することができます。
ネットワークがゾーンをローテーションする機能は、複数の重要な目的を果たします。
1. 管轄区域の分散化：定期的なゾーンローテーションにより、単一の管轄区域による合意の獲得を防ぎます。これにより、ネットワークは規制圧力に対する耐性を維持し、単一の政府または当局がネットワーク運用を長期的に制御できないようにします。
2. インフラの耐障害性：データセンターや地域インフラは、自然災害、停電、ネットワークの問題、ハードウェア障害、保守要件など、さまざまな理由で障害が発生する可能性があります。ゾーンローテーションにより、ネットワークが単一障害点に永続的に依存しないことが保証されます。悪天候や電力網の障害などによる大規模なデータセンターの障害の過去の事例は、この柔軟性の重要性を実証しています。 3. 戦略的なパフォーマンス最適化：特定のネットワークアクティビティに合わせてゾーンを選択できます。例えば、重要な金融イベント（連邦準備制度理事会の発表、主要な経済レポート、市場のオープンなど）を含むエポックでは、バリデータは価格に影響を与える情報源の近くにコンセンサスを設定することを選択できます。この機能により、ネットワークは重要な操作のレイテンシを最小限に抑えながら、エポック間で異なるユースケースに対応する柔軟性を維持できます。

4.2 鍵管理
本プロトコルは、長期的なバリデータIDとゾーン固有のコンセンサス参加を分離する2層鍵管理システムを実装しています。各バリデータは、ネットワークにおけるルートIDとして機能するグローバル鍵ペアを保持します。このグローバル鍵は、ステーク委任、ゾーン登録、グローバルコンセンサスへの参加といった高レベルの操作に使用されます。グローバル鍵は、ネットワークにおけるバリデータの最終的な権限を表すため、可能な限り高度なセキュリティ対策で保護する必要があります。バリデータは、オンチェーンレジストリプログラムを通じて、ゾーン固有のサブ鍵に権限を委任できます。これらのサブ鍵は、指定されたコロケーションゾーン内でのコンセンサス参加のために特別に承認されています。この分離は、複数のセキュリティ目的に役立ちます。バリデータは、異なる鍵タイプに対して異なるセキュリティモデルを維持できること、通常運用中にグローバル鍵をオンラインに保つことで鍵の露出を最小限に抑えること、そしてゾーン間の物理インフラストラクチャ移行時に鍵が侵害されるリスクを軽減することです。ゾーン固有の鍵の委任は、各バリデータごとに承認されたゾーン鍵のレジストリを維持するオンチェーンプログラムによって管理されます。バリデータはグローバル鍵を使用していつでも新しいゾーン鍵を登録できますが、これらの登録はエポック境界でのみ有効になります。この遅延により、ネットワーク参加者全員が新しい鍵の委任を検証し、記録する時間を確保してから、コンセンサスでアクティブになります。

4.3 ゾーンの提案とアクティブ化
新しいゾーンは、グローバル鍵を使用したオンチェーンガバナンスメカニズムを通じて提案できます。ただし、ネットワークの安定性を確保し、バリデータが安全なインフラストラクチャを準備するための十分な時間を与えるため、提案されたゾーンは選択対象になるまでに必須の遅延期間が設けられています。プロトコルパラメータとして設定されるこの遅延時間は、バリデーターが以下の作業を実行できる十分な長さでなければなりません。
● 新しいゾーンで適切な物理インフラストラクチャを保護する
● 新しい場所に安全な鍵管理システムを確立する
● ネットワークインフラストラクチャを構築し、テストする
● 新しい施設の必要なセキュリティ監査を実施する
● バックアップおよびリカバリ手順を確立する
この遅延期間は、悪意のある攻撃者がインフラストラクチャ的に有利なゾーンにコンセンサスを強制的に導入しようとする潜在的な攻撃に対するセキュリティ対策としても機能します。新しいゾーンについて事前通知を要求することで、プロトコルはすべてのバリデーターが、コンセンサスのために選択される可能性のあるゾーンにプレゼンスを確立する公平な機会を持つことを保証します。
ゾーンがこの待機期間を完了した後にのみ、将来のエポックのための通常のゾーン投票プロセスを通じて選択されます。ゾーンのアクティベーションに対するこの慎重なアプローチは、ネットワーク要件の進化に応じて新しい戦略的拠点を追加しながら、ネットワークのセキュリティと安定性を維持するのに役立ちます。 4.4 ゾーン選択投票プロセス
コンセンサスゾーンの選択は、協調的なバリデーターの移動とネットワークセキュリティのバランスをとるオンチェーン投票メカニズムによって行われます。バリデーターは、エポック遷移前の設定可能なクォーラム時間内に、将来の各エポックのコロケーションゾーンでクォーラムを達成する必要があります。実際には、エポックスケジュールは、エポックnでの投票でエポックn + kのゾーンが選択されるように、ある程度のリードタイムで決定される場合があります。投票は、バリデーターのグローバルキーを使用してオンチェーンレジストリプログラムを通じて行われ、投票権はステークによって重み付けされます。このプロセスはレイテンシの影響を受けにくく、最大限のセキュリティが求められるため、ゾーンキーではなくグローバルキーを使用します。投票プロセスでは、クォーラムを確立するためにステークウェイトの超過分が必要であり、少数のバリデーターが一方的にゾーン変更を強制できないようにします。バリデータが指定された時間内にクォーラムを達成できない場合、ネットワークは次のエポックで自動的にグローバルコンセンサスモードに移行します。このフォールバックメカニズムにより、バリデータがコロケーションゾーンに合意できない場合でもネットワークの継続性が確保されます。投票期間中、バリデータは次のエポックで優先するゾーンと、そのゾーンの目標ブロックタイムの両方を通知します。このようにロケーションとパフォーマンスパラメータを共同で選択することで、ネットワークは各ゾーンの物理的制約とパフォーマンス能力の両方を最適化できます。重要なのは、投票期間中にバリデータが選択されたゾーンのインフラストラクチャを準備するための時間（ゾーン固有のキーのウォームアップやネットワーク接続のテストなど）が確保されることです。この準備期間は、ゾーン移行中のネットワークの安定性を維持するために不可欠です。

4.5 グローバルコンセンサスモード
グローバルコンセンサスモードは、フォールバックメカニズムとプロトコルの基本的な安全機能の両方として機能します。Fogoはゾーンベースのコンセンサスを通じて最高のパフォーマンスを実現しますが、グローバルコンセンサスへのフォールバック機能により、悪条件下でもネットワークの継続的な運用が保証されます。グローバルコンセンサスモードでは、ネットワークはグローバル分散検証に最適化された保守的なパラメータ（400msの固定ブロックタイムと、地理的に分散したバリデータ間のネットワーク遅延の増加に対応するために縮小されたブロックサイズ）で動作します。プロトコルは、主に2つの経路でグローバルコンセンサスモードに移行します。
● 失敗ゾーン選択：バリデータが指定された投票期間内に次のエポックのコンセンサスゾーンでクォーラムを達成できなかった場合、ネットワークはそのエポックで自動的にグローバルコンセンサスをデフォルトとします。 ● 実行時コンセンサス失敗：現在のゾーンがエポック中に指定されたタイムアウト期間内にブロックのファイナリティを達成できなかった場合、プロトコルは直ちにグローバルコンセンサスモードに切り替え、そのエポックの残りの期間をグローバルコンセンサスモードで処理します。このフォールバックは「スティッキー」です。エポックの途中で一度トリガーされると、ネットワークは次のエポックの遷移までグローバルコンセンサスモードを維持し、パフォーマンス回復よりも安定性を優先します。
グローバルコンセンサスモードでは、バリデータはグローバル操作用の指定キーを使用して参加します。このキーは、ゾーン固有のキーである場合もそうでない場合もあります。ネットワークはゾーンベースのコンセンサスと同じフォーク選択ルールを維持します。このモードでは、共存ゾーンで実現可能な超低レイテンシは犠牲になりますが、ネットワークの継続性のための堅牢な基盤を提供し、Fogoが劣化状況下でも生存性を犠牲にすることなく安全性を維持する方法を示しています。 5. バリデータセット
高いパフォーマンスを実現し、MEVの不正使用を軽減するために、Fogoはキュレーションされたバリデータセットを活用します。これは、たとえプロビジョニングが不十分なバリデータノードがごく一部存在したとしても、ネットワークが物理的なパフォーマンス限界に達するのを阻止する可能性があるため、不可欠です。
当初は、キュレーションはProof of Authority（権限証明）を通じて行われ、その後、バリデータセットによる直接的な許可へと移行します。バリデータセットにキュレーション権限を与えることで、Fogoは従来のProof of Authorityシステムと同様に、不正行為に対するソーシャルレイヤーのペナルティを強制できます。ただし、その方法は、Solanaのような従来のPoSネットワークで既にステークの2/3が保有しているフォークパワーよりも中央集権的ではありません。

5.1 サイズと初期設定
Fogoは、プロトコルによって強制される最小および最大バリデータ数を持つ許可型バリデータセットを維持することで、ネットワークパフォーマンスを最適化しながら適切な分散化を確保します。初期の目標バリデータ数は約20～50ですが、この上限はプロトコルパラメータとして実装されており、ネットワークの成熟度に応じて調整可能です。ジェネシス（初期段階）では、ジェネシス・オーソリティ（権限）によって初期バリデータセットが選出されます。ジェネシス・オーソリティは、ネットワークの初期段階において、バリデータセットの構成を管理する一時的な権限を保持します。

5.2 ガバナンスと移行
ジェネシス・オーソリティによるバリデータセットのメンバーシップの管理は、一時的なものとして設計されています。ネットワークの安定化の初期期間が経過した後、このオーソリティはバリデータセット自体の管理に移行します。この移行後、バリデータセットのメンバーシップの変更には、ステークされたトークンの3分の2以上の圧倒的多数が必要になります。これは、プルーフ・オブ・ステーク・ネットワークにおけるプロトコルレベルの変更に必要なしきい値と同じです。
ネットワークの安定性を損なう可能性のある突然の変更を防ぐため、プロトコルパラメータによってバリデータの変更率を制限しています。一定期間内にバリデーターセットの一定割合以上を置き換えたり排除したりすることはできません。この割合は調整可能なプロトコルパラメータです。これにより、ネットワークの安定性を維持しながら、バリデーターセットを段階的に進化させることができます。

5.3 参加要件
バリデーターは、バリデーターセットへの参加資格を得るために、最低限の委任ステーク要件を満たす必要があります。これにより、Solanaの経済モデルとの互換性を維持しながら、許可コンポーネントを追加できます。この二重の要件（十分なステークとセットの承認）により、バリデーターは経済的なリスクとネットワークパフォーマンスを維持するための運用能力の両方を確保できます。

5.4 理論的根拠とネットワークガバナンス
許可型バリデータセットは、ネットワークの分散化に実質的な影響を与えません。これは、プルーフ・オブ・ステーク・ネットワークにおいて既に、ステークの3分の2以上の超多数がフォークを通じてプロトコルに任意の変更を加えることができるためです。その代わりに、このメカニズムは、バリデータセットが、プロトコルルールにコード化することが困難な、有益なネットワーク動作を実施するための正式なフレームワークを提供します。例えば、バリデータを排除する機能により、ネットワークは次のような問題に対応できます。

● ネットワーク機能を低下させる永続的なパフォーマンス問題
● ネットワークのユーザビリティを損なう不正なMEV抽出
● プロトコルで直接強制できないネットワークを不安定にする動作（Turbineブロックのリーチングは行うが転送は行わないなど）
● 個々のバリデータにとっては利益をもたらす可能性があるものの、ネットワークの長期的な価値を損なうその他の動作
このガバナンスメカニズムは、特定の動作が短期的には利益をもたらす可能性がある一方で、ネットワークの長期的な存続可能性を損なう可能性があることを認識しています。ステーク重み付けされたバリデータセットがメンバーシップ制御を通じてこのような動作を監視できるようにすることで、Fogoはプルーフ・オブ・ステークシステムに固有の基本的な分散化特性を損なうことなく、バリデータへのインセンティブをネットワークの長期的な健全性と整合させます。 6. 今後の拡張
Fogoの中核的なイノベーションは、マルチローカルコンセンサス、クライアントパフォーマンス、バリデータセット管理に重点を置いていますが、ジェネシス実装またはローンチ後の実装に向けて、いくつかの追加プロトコル拡張が検討されています。これらの機能は、Solanaエコシステムとの後方互換性を維持しながら、ネットワーク機能をさらに強化します。

6.1 SPLトークン手数料支払い
より広範なネットワークアクセスを可能にし、ユーザーエクスペリエンスを向上させるため、Fogoは、発信元アカウントでSOLなしでトランザクションを実行できるfee_payer_unsignedトランザクションタイプを導入する可能性があります。この機能は、オンチェーン手数料支払いプログラムと組み合わせることで、プロトコルセキュリティとバリデータへの報酬を維持しながら、SPLトークンを使用してトランザクション手数料を支払うことを可能にします。
このシステムは、プロトコル外のパーミッションレスなリレーマーケットプレイスを通じて機能します。ユーザーは、意図した操作と、最終的な手数料支払者への報酬としてSPLトークンの支払いの両方を含むトランザクションを構築します。これらのトランザクションは、手数料支払者を指定せずに有効に署名できるため、誰でも署名を追加しSOL手数料を支払うことでトランザクションを完了できます。このメカニズムは、トランザクションの承認と手数料の支払いを効果的に分離し、SOL残高がゼロのアカウントでも、他の価値ある資産を保有している限り、ネットワークとやり取りできるようにします。
この機能は、最小限のプロトコル変更で実装され、新しいトランザクションタイプと、リレーヤーの報酬を処理するオンチェーンプログラムを追加するだけで済みます。このシステムは、基盤となるプロトコルのセキュリティ特性を維持しながら、トランザクションリレーサービスのための効率的な市場を構築します。より複雑な手数料抽象化システムとは異なり、このアプローチではバリデーターの支払いメカニズムやコンセンサスルールを変更する必要はありません。

7. 結論
Fogoは、パフォーマンス、分散化、セキュリティの関係に関する従来の前提に挑戦する、ブロックチェーンアーキテクチャへの新しいアプローチです。高性能クライアント実装と動的なマルチローカルコンセンサス、そして厳選されたバリデータセットを組み合わせることで、このプロトコルは、プルーフオブステークシステムの基本的なセキュリティ特性を損なうことなく、比類のないパフォーマンスを実現します。地理的多様性を維持しながらコンセンサスを動的に再配置する機能は、パフォーマンスの最適化とシステムの回復力の両方を提供し、プロトコルのフォールバックメカニズムは、悪条件下でも継続的な運用を保証します。慎重な経済設計により、これらのメカニズムはプロトコルの強制ではなくバリデータインセンティブから自然に生まれ、堅牢で適応性の高いシステムを実現します。ブロックチェーン技術が進化し続ける中で、Fogoのイノベーションは、思慮深いプロトコル設計が、ブロックチェーンネットワークの価値を高めるセキュリティと分散化の特性を維持しながら、パフォーマンスの限界を押し広げることができることを示しています。
`

// Korean
const KOREAN_TEXT = `
Fogo: 고성능 SVM 레이어 1
버전 1.0

초록
본 논문에서는 처리량, 지연 시간 및 혼잡 관리 측면에서 획기적인 성능을 제공하는 새로운 레이어 1 블록체인 프로토콜인 Fogo를 소개합니다. Solana 프로토콜의 확장인 Fogo는 SVM 실행 계층에서 완벽한 호환성을 유지하여 기존 Solana 프로그램, 툴 및 인프라를 원활하게 마이그레이션하는 동시에 훨씬 향상된 성능과 낮은 지연 시간을 달성할 수 있도록 합니다.
Fogo는 세 가지 혁신적인 기능을 제공합니다.
● Firedancer 기반의 통합 클라이언트 구현으로, Solana를 포함하여 느린 클라이언트를 사용하는 네트워크에서는 달성할 수 없는 수준의 성능을 제공합니다.
● 동적 코로케이션을 통한 다중 로컬 합의를 통해 주요 블록체인보다 훨씬 낮은 블록 시간과 지연 시간을 달성합니다.
● 검증인 수준에서 고성능을 장려하고 약탈적인 행위를 억제하는 선별된 검증인 세트

이러한 혁신은 레이어 1 블록체인에 필수적인 탈중앙화와 견고성을 유지하면서도 상당한 성능 향상을 제공합니다.
1. 서론
블록체인 네트워크는 성능과 탈중앙화, 그리고 보안의 균형을 맞추는 데 지속적인 어려움을 겪고 있습니다.
오늘날의 블록체인은 심각한 처리량 제한으로 인해 글로벌 금융 활동에 적합하지 않습니다. 이더리움은 기본 계층에서 초당 50건 미만의 트랜잭션(TPS)을 처리합니다. 가장 중앙화된 레이어 2조차도 1,000TPS 미만을 처리합니다. 솔라나는 더 높은 성능을 위해 설계되었지만, 클라이언트 다양성의 제한으로 인해 현재 5,000TPS의 혼잡을 유발합니다. 반면, 나스닥, CME, 유렉스와 같은 기존 금융 시스템은 초당 10만 건 이상의 작업을 정기적으로 처리합니다.
지연 시간은 분산형 블록체인 프로토콜의 또 다른 중요한 한계입니다.
금융 시장, 특히 변동성이 큰 자산의 가격 발견과 같은 경우, 낮은 지연 시간은 시장의 질과 유동성을 위해 필수적입니다. 기존 시장 참여자들은 밀리초 또는 밀리초 미만의 단위의 엔드 투 엔드 지연 시간으로 운영합니다. 이러한 속도는 시장 참여자들이 빛의 속도 제약으로 인해 실행 환경과 동일한 위치에 있을 때만 달성 가능합니다.
기존 블록체인 아키텍처는 지리적 인식 없이 작동하는 전 세계에 분산된 검증자 세트를 사용하므로 근본적인 성능 제한이 발생합니다. 빛 자체가 적도를 따라 지구를 한 바퀴 도는 데 130밀리초 이상이 걸리며, 완벽한 원을 그리며 이동하더라도 마찬가지입니다.
실제 네트워크 경로에는 추가적인 거리와 인프라 지연이 수반됩니다. 합의 과정에서 검증자 간에 여러 차례의 통신 라운드가 필요할 경우 이러한 물리적 제한은 더욱 가중됩니다.
합의 과정에서 검증자 간에 여러 차례의 통신 라운드가 필요할 경우 이러한 지역 간 지연 시간은 더욱 가중됩니다. 결과적으로 네트워크는 안정성을 유지하기 위해 보수적인 블록 시간과 최종성 지연을 구현해야 합니다. 최적의 조건에서도 전 세계에 분산된 합의 메커니즘은 이러한 기본적인 네트워킹 지연을 극복할 수 없습니다.
블록체인이 글로벌 금융 시스템과 더욱 긴밀하게 통합됨에 따라 사용자들은 오늘날의 중앙 집중식 시스템과 유사한 성능을 요구하게 될 것입니다. 신중한 설계 없이는 이러한 요구 사항을 충족하는 것이 블록체인 네트워크의 탈중앙화 및 복원력을 심각하게 저해할 수 있습니다. 이러한 과제를 해결하기 위해 Fogo 레이어 1 블록체인을 제안합니다. Fogo의 핵심 철학은 두 가지 핵심 접근 방식을 통해 처리량을 극대화하고 지연 시간을 최소화하는 것입니다. 첫째, 최적의 탈중앙화 검증자 세트에서 가장 성능이 뛰어난 클라이언트 소프트웨어를 사용하는 것입니다. 둘째, 글로벌 합의의 탈중앙화 이점을 대부분 유지하면서 공동 배치 합의를 수용하는 것입니다.

2. 개요
본 논문은 Fogo와 관련된 주요 설계 결정 사항을 다루는 섹션으로 나뉩니다.
3절에서는 Fogo와 Solana 블록체인 프로토콜의 관계, 그리고 클라이언트 최적화 및 다양성과 관련된 전략을 다룹니다.
4절에서는 다중 로컬 합의, 그 실제 구현, 그리고 글로벌 또는 로컬 합의와 관련된 거래에 대해 다룹니다.
5절에서는 Fogo의 검증자 세트 초기화 및 유지 관리 접근 방식을 다룹니다.
6절에서는 제네시스 이후 도입될 수 있는 향후 확장 기능에 대해 다룹니다.

3. 프로토콜 및 클라이언트
Fogo는 기본 계층에서 현재까지 가장 성능이 뛰어난 널리 사용되는 블록체인 프로토콜인 Solana를 기반으로 구축됩니다. Solana 네트워크는 프로토콜 설계 및 클라이언트 구현 측면에서 이미 다양한 최적화 솔루션을 제공합니다. Fogo는 SVM 실행 계층에서의 완벽한 호환성, TowerBFT 합의, Turbine 블록 전파, Solana 리더 회전 및 기타 모든 주요 네트워킹 및 합의 계층 구성 요소와의 긴밀한 호환성을 포함하여 Solana와의 최대한의 하위 호환성을 목표로 합니다. 이러한 호환성을 통해 Fogo는 Solana 생태계의 기존 프로그램, 도구 및 인프라를 쉽게 통합하고 배포할 수 있을 뿐만 아니라 Solana의 지속적인 업스트림 개선의 이점을 누릴 수 있습니다.
하지만 Solana와 달리 Fogo는 단일 표준 클라이언트로 실행됩니다. 이 표준 클라이언트는 Solana에서 실행되는 가장 높은 성능의 주요 클라이언트가 됩니다. 이를 통해 Fogo는 네트워크가 항상 가장 빠른 클라이언트의 속도로 실행되므로 훨씬 더 높은 성능을 달성할 수 있습니다. 클라이언트 다양성에 제약을 받는 Solana는 항상
가장 느린 클라이언트의 속도에 의해 병목 현상을 겪을 것입니다. 현재와 가까운 미래에 이 정식 클라이언트는 Firedancer 스택을 기반으로 할 것입니다.

3.1 Firedancer
Firedancer는 Jump Crypto의 고성능 Solana 호환 클라이언트 구현으로,
최적화된 병렬 처리, 메모리 관리 및 SIMD 명령어를 통해 기존 검증 클라이언트보다 훨씬 높은 트랜잭션 처리량을 보여줍니다.
두 가지 버전이 있습니다. Firedancer의 처리 엔진과 Rust 검증의 네트워킹 스택을 혼합한 "Frankendancer"와
완전히 C 네트워킹 스택을 재작성한 전체 Firedancer 구현으로, 현재 개발 후반 단계에 있습니다.
두 버전 모두 Solana 프로토콜 호환성을 유지하면서 성능을 극대화합니다.
완성되면 순수 Firedancer 구현은 새로운 성능 벤치마크를 설정할 것으로 예상되며, Fogo의 높은 처리량 요구 사항에 이상적입니다. Fogo는 Frankendancer 기반 네트워크로 시작하여 결국 Firedancer로 전환할 예정입니다.

3.2 정식 클라이언트 vs. 클라이언트 다양성
블록체인 프로토콜은 규칙과 사양을 구현하는 클라이언트 소프트웨어를 통해 작동합니다. 프로토콜은 네트워크 운영 규칙을 정의하는 반면, 클라이언트는 이러한 사양을 실행 가능한 소프트웨어로 변환합니다. 프로토콜과 클라이언트 간의 관계는 역사적으로 서로 다른 모델을 따랐으며, 일부 네트워크는 클라이언트 다양성을 적극적으로 장려하는 반면, 다른 네트워크는 자연스럽게 정식 구현으로 수렴합니다.
클라이언트 다양성은 전통적으로 여러 가지 목적을 위해 사용됩니다. 구현 중복성을 제공하고, 프로토콜 규칙의 독립적인 검증을 가능하게 하며, 이론적으로 네트워크 전체 소프트웨어 취약성의 위험을 줄입니다.
비트코인 네트워크는 흥미로운 선례를 보여줍니다. 여러 클라이언트 구현이 존재하지만, 비트코인 코어는 사실상 정식 클라이언트 역할을 하며 실제 네트워크 동작을 정의하는 참조 구현을 제공합니다.
그러나 고성능 블록체인 네트워크에서는 프로토콜과 클라이언트 구현 간의 관계가 더욱 제한됩니다. 프로토콜이 컴퓨팅 및 네트워킹 하드웨어의 물리적 한계에 도달하면 구현 다양성 공간이 자연스럽게 축소됩니다. 이러한 성능 한계에서 최적의 구현은 동일한 물리적 한계와 성능 요구 사항에 직면함에 따라 유사한 솔루션으로 수렴해야 합니다. 최적의 구현 패턴에서 크게 벗어나면 성능이 저하되어 클라이언트가 검증자 작업에 사용할 수 없게 됩니다. 이러한 역학은 최소 블록 시간과 최대 트랜잭션 처리량을 목표로 하는 네트워크에서 특히 두드러집니다. 이러한 시스템에서는 서로 다른 클라이언트 구현 간의 호환성을 유지하는 오버헤드 자체가 성능 병목 현상이 될 수 있으므로 클라이언트 다양성의 이론적 이점은 의미가 줄어듭니다. 블록체인 성능을 물리적 한계까지 끌어올릴 경우, 클라이언트 구현은 필연적으로 핵심 아키텍처 결정을 공유하게 되므로 구현 다양성의 보안 이점은 대체로 이론적인 수준에 그치게 됩니다.

3.3 성능 클라이언트에 대한 프로토콜 인센티브
Fogo는 모든 규정을 준수하는 클라이언트 구현을 허용하지만, 고성능 공동 배치 운영의 실질적인 요구 사항에 따라 아키텍처는 자연스럽게 사용 가능한 최고 성능 클라이언트를 사용하도록 인센티브를 제공합니다.
지리적 거리가 주요 병목 현상을 유발하는 기존 네트워크와 달리,
Fogo의 공동 배치 설계는 클라이언트 구현 효율성이 검증자 성능을 직접적으로 결정합니다.
이 환경에서는 네트워크 지연 시간이 최소화되므로 클라이언트 속도가 중요한 요소입니다.
네트워크의 동적 블록 시간 및 크기 매개변수는 처리량을 극대화해야 한다는 경제적 압력을 가합니다.
검증자는 가장 빠른 클라이언트를 사용할지, 아니면 페널티와 수익 감소의 위험을 감수할지 선택해야 합니다. 속도가 느린 클라이언트를 사용하는 경우, 공격적인 매개변수에 투표하여 블록을 놓칠 위험이 있고, 보수적인 매개변수에 투표하여 수익을 잃게 됩니다.
이는 가장 효율적인 클라이언트 구현에 대한 자연 선택을 가능하게 합니다. Fogo의 공동 배치 환경에서는 작은 성능 차이조차도 심각해집니다.
약간 느린 클라이언트는 지속적으로 성능이 저하되어 블록 누락과 페널티로 이어집니다. 이러한 최적화는 프로토콜 규칙이 아닌 검증자의 이익에 따라 이루어집니다.
클라이언트 선택을 프로토콜로 직접 강제할 수는 없지만, 경제적 압력은 자연스럽게 경쟁력 있는 클라이언트 개발을 유지하면서 가장 효율적인 구현 방식을 지향하는 네트워크를 구축합니다.

4. 다중 지역 합의
다중 지역 합의는 검증자 공동 배치의 성능 이점과 지리적 분산의 보안 이점을 동적으로 균형 있게 조정하는 블록체인 합의에 대한 새로운 접근 방식을 나타냅니다. 이 시스템을 통해 검증자는 각기 다른 영역에 대해 고유한 암호화 ID를 유지하면서 여러 에포크에 걸쳐 물리적 위치를 조정할 수 있습니다.
이를 통해 네트워크는 정상 작동 중에 초저지연 합의를 달성하는 동시에 필요 시 글로벌 합의로 돌아갈 수 있는 기능을 유지합니다.
Fogo의 다중 지역 합의 모델은 기존 금융 시장, 특히 외환 및 기타 글로벌 시장에서 사용되는 "태양을 따르다(follow the sun)" 거래 모델의 기존 관행에서 영감을 얻었습니다. 전통적인 금융에서 시장 조성 및 유동성 공급은 거래일이 진행됨에 따라 아시아에서 유럽, 북미로 자연스럽게 주요 금융 센터 사이를 이동합니다. 이를 통해 특정 지역에 집중된 유동성을 유지하면서도 지속적인 시장 운영이 가능합니다. 이 모델은 시장이 전 세계적이지만 네트워킹의 물리적 한계와 인간의 반응 시간으로 인해 최적의 가격 발견 및 시장 효율성을 위해 어느 정도의 지리적 집중이 필요하다는 점을 인식하고 있기 때문에 전통적인 금융에서 효과적인 것으로 입증되었습니다.

4.1 존(zone) 및 존 로테이션
존은 검증자들이 최적의 합의 성능을 달성하기 위해 함께 위치하는 지리적 영역을 나타냅니다. 이상적으로 존은 검증자 간의 네트워크 지연 시간이 하드웨어 한계에 도달하는 단일 데이터 센터입니다. 그러나 필요에 따라 존은 더 넓은 지역으로 확장될 수 있으며, 이는 실질적인 고려 사항으로 인해 일부 성능을 희생하는 것입니다. 존의 정확한 정의는 프로토콜에 엄격하게 정의되는 것이 아니라 검증자들 간의 사회적 합의를 통해 나타납니다. 이러한 유연성 덕분에 네트워크는 성능 목표를 유지하면서 실제 인프라 제약에 적응할 수 있습니다.
네트워크의 존 간 순환 기능은 여러 가지 중요한 목적을 달성합니다.
1. 관할권 분산화: 정기적인 존 순환은 특정 관할권의 합의가 확보되는 것을 방지합니다. 이를 통해 네트워크는 규제 압력에 대한 저항력을 유지하고 단일 정부나 기관이 네트워크 운영에 대해 장기적인 통제권을 행사할 수 없도록 합니다.
2. 인프라 복원력: 데이터 센터와 지역 인프라는 자연재해, 정전, 네트워킹 문제, 하드웨어 장애 또는 유지 관리 요구 사항 등 다양한 이유로 장애가 발생할 수 있습니다. 존 순환은 네트워크가 단일 장애 지점에 영구적으로 의존하지 않도록 보장합니다.
악천후 또는 전력망 장애로 인한 주요 데이터 센터 정전 사례는 이러한 유연성의 중요성을 보여줍니다.
3. 전략적 성능 최적화: 특정 네트워크 활동에 맞춰 존을 선택하여 최적화할 수 있습니다. 예를 들어, 중요한 금융 이벤트(연준 발표, 주요 경제 보고서 또는 시장 개장 등)가 포함된 에포크(epoch) 동안 검증자는 가격에 민감한 정보의 출처 근처에 합의를 위치시킬 수 있습니다. 이러한 기능을 통해 네트워크는 에포크 전반에 걸쳐 다양한 사용 사례에 대한 유연성을 유지하면서 중요한 작업의 지연 시간을 최소화할 수 있습니다.

4.2 키 관리
이 프로토콜은 장기 검증자 신원과 존별 합의 참여를 분리하는 2계층 키 관리 시스템을 구현합니다. 각 검증자는 네트워크에서 루트 신원 역할을 하는 글로벌 키 쌍을 유지합니다. 이 글로벌 키는 지분 위임, 존 등록, 글로벌 합의 참여와 같은 고급 작업에 사용됩니다. 글로벌 키는 네트워크에서 검증자의 최종 권한을 나타내므로 가능한 가장 높은 보안 수준으로 보호되어야 합니다.
검증자는 온체인 레지스트리 프로그램을 통해 존별 하위 키에 권한을 위임할 수 있습니다. 이러한 하위 키는 지정된 코로케이션 존 내에서 합의 참여를 위해 특별히 승인됩니다.
이러한 분리는 여러 가지 보안 목적을 제공합니다.
검증자는 다양한 키 유형에 대해 서로 다른 보안 모델을 유지할 수 있고,
정상적인 작동 중에 글로벌 키를 온라인 상태로 유지하여 노출을 최소화하며,
존 간 물리적 인프라 전환 중 키 손상 위험을 줄입니다.

존별 키 위임은 각 검증인에 대해 승인된 존 키 레지스트리를 유지하는 온체인 프로그램을 통해 관리됩니다. 검증인은 글로벌 키를 사용하여 언제든지 새로운 존 키를 등록할 수 있지만, 이러한 등록은 에포크 경계에서만 적용됩니다. 이러한 지연은 모든 네트워크 참여자가 합의에 참여하기 전에 새로운 키 위임을 검증하고 기록할 시간을 확보할 수 있도록 보장합니다.

4.3 존 제안 및 활성화
새로운 존은 글로벌 키를 사용하여 온체인 거버넌스 메커니즘을 통해 제안될 수 있습니다.
그러나 네트워크 안정성을 보장하고 검증인이 안전한 인프라를 준비할 충분한 시간을 확보하기 위해 제안된 존은 선택 자격을 얻기 전에 필수 지연 기간을 갖습니다. 프로토콜 매개변수로 설정된 이 지연 시간은 검증자가 다음을 수행할 수 있도록 충분히 길어야 합니다.
● 새로운 구역에 적절한 물리적 인프라 확보
● 새로운 위치에 대한 안전한 키 관리 시스템 구축
● 네트워킹 인프라 설정 및 테스트
● 새로운 시설에 대한 필요한 보안 감사 수행
● 백업 및 복구 절차 수립
지연 시간은 악의적인 행위자가 인프라상 유리한 구역에 합의를 강제로 유도하려는 잠재적 공격에 대한 보안 조치 역할도 합니다.
새로운 구역에 대한 사전 통지를 요구함으로써, 프로토콜은 모든 검증자가 합의 대상으로 선택될 수 있는 모든 구역에 참여할 수 있는 공정한 기회를 갖도록 보장합니다.
구역이 이 대기 시간을 완료한 후에만 정기적인
구역 투표 프로세스를 통해 향후 에포크에 참여할 수 있습니다. 이러한 신중한 구역 활성화 방식은 네트워크 요구 사항이 변화함에 따라 새로운 전략적 위치를 추가하는 동시에 네트워크 보안과 안정성을 유지하는 데 도움이 됩니다.

4.4 존 선택 투표 프로세스
합의 존 선택은 온체인 투표 메커니즘을 통해 이루어지며, 이는 조정된 검증자 이동과 네트워크 보안 간의 균형을 유지합니다. 검증자는 에포크 전환 전 설정 가능한 정족수 시간 내에 각 미래 에포크의 코로케이션 존에서 정족수를 달성해야 합니다. 실제로 에포크 일정은 어느 정도 리드타임을 두고 결정될 수 있으며, 에포크 n 동안 투표를 통해 에포크 n + k의 존이 선택됩니다. 투표는 검증자의 글로벌 키를 사용하는 온체인 레지스트리 프로그램을 통해 이루어지며, 투표권은 지분에 따라 가중치가 부여됩니다. 이 프로세스는 지연 시간에 민감하지 않고 최고 수준의 보안을 요구하기 때문에 존 키 대신 글로벌 키를 사용합니다.
투표 프로세스는 정족수를 확보하기 위해 지분 가중치의 절대다수를 요구하며, 이는 소수의 검증자가 일방적으로 존 변경을 강제할 수 없도록 보장합니다. 검증자가 지정된 시간 내에 정족수를 달성하지 못하면 네트워크는 자동으로 다음 에포크의 글로벌 합의 모드로 전환됩니다. 이 폴백 메커니즘은 검증자가 코로케이션 존에 동의하지 않더라도 네트워크 연속성을 보장합니다.
투표 기간 동안 검증자는 다음 에포크에 선호하는 존과 해당 존의 목표 블록 시간을 모두 표시합니다.
위치 및 성능 매개변수를 함께 선택함으로써 네트워크는 각 존의 물리적 제약과 성능 요건을 모두 고려하여 최적화할 수 있습니다. 중요한 점은 투표 기간이 검증자가 선택한 존에서 존별 키 워밍업 및 네트워크 연결 테스트 등 인프라를 준비할 수 있는 시간을 제공한다는 것입니다. 이 준비 기간은 존 전환 중 네트워크 안정성을 유지하는 데 매우 중요합니다.

4.5 글로벌 합의 모드
글로벌 합의 모드는 프로토콜의 폴백 메커니즘이자 기본적인 안전 기능 역할을 합니다. Fogo는 존 기반 합의를 통해 최고의 성능을 발휘하지만, 글로벌 합의로 폴백하는 기능은 악조건에서도 네트워크의 지속적인 운영을 보장합니다. 글로벌 합의 모드에서 네트워크는 글로벌 분산 검증에 최적화된 보수적인 매개변수, 즉 고정된 400ms 블록 시간과 지리적으로 분산된 검증자 간의 더 높은 네트워크 지연 시간을 수용하기 위한 감소된 블록 크기를 사용하여 작동합니다.
프로토콜은 두 가지 주요 경로를 통해 글로벌 합의 모드로 전환됩니다.
● 존 선택 실패: 검증자가 지정된 투표 기간 내에 다음 에포크의 합의 존에서 쿼럼을 달성하지 못하면 네트워크는 자동으로 해당 에포크에 대한 글로벌 합의로 기본 설정됩니다.
● 런타임 합의 실패: 현재 존이 에포크 동안 지정된 시간 초과 기간 내에 블록 확정성을 달성하지 못하면 프로토콜은 즉시 해당 에포크의 남은 시간 동안 글로벌 합의 모드로 전환합니다. 이 폴백은 "스티키(sticky)"합니다. 즉, 에포크 중간에 트리거되면 네트워크는 다음 에포크 전환까지 글로벌 합의 상태를 유지하며, 성능 회복보다 안정성을 우선시합니다.
글로벌 합의 모드에서 검증자는 글로벌 작업을 위해 지정된 키를 사용하여 참여하며, 이 키는 존별 키 중 하나일 수도 있고 아닐 수도 있습니다. 네트워크는 존 기반 합의와 동일한 포크 선택 규칙을 유지합니다. 이 모드는 동일 존에서 달성 가능한 초저지연성을 희생하지만, 네트워크 연속성을 위한 견고한 기반을 제공하며, Fogo가 성능 저하 상황에서도 활성 상태를 유지하면서 안전성을 유지하는 방식을 보여줍니다.

5. 검증자 세트
높은 성능을 달성하고 악용되는 MEV 관행을 완화하기 위해 Fogo는 엄선된 검증자 세트를 활용합니다. 이는 프로비저닝이 부족한 검증 노드의 일부만으로도 네트워크가 물리적 성능 한계에 도달하는 것을 막을 수 있기 때문에 필수적입니다.
초기에 큐레이션은 검증인 세트에 의한 직접적인 권한 부여로 전환되기 전에 권한 증명을 통해 운영됩니다. 검증인 세트에 큐레이션 권한을 부여함으로써, Fogo는 기존의 권한 증명 시스템처럼 악의적인 행동에 대한 소셜 계층 처벌을 시행할 수 있지만, 이는 Solana와 같은 기존 PoS 네트워크에서 지분의 2/3가 이미 보유하고 있는 포크 파워보다 더 중앙화되지는 않습니다.

5.1 크기 및 초기 구성
Fogo는 프로토콜에 따라 최소 및 최대 검증인 수를 적용하는 권한 부여된 검증인 세트를 유지하여 네트워크 성능을 최적화하는 동시에 충분한 탈중앙화를 보장합니다. 초기 목표 규모는 약 20~50개의 검증인으로 설정되지만,
이 제한은 네트워크가 성숙함에 따라 조정될 수 있는 프로토콜 매개변수로 구현됩니다. 제네시스(genesis) 단계에서 초기 검증인 세트는 제네시스 권한에 의해 선택되며, 이 권한은 네트워크 초기 단계에서 검증인 세트 구성을 관리하기 위한 임시 권한을 유지합니다.

5.2 거버넌스 및 전환
제네시스 권한(genesis authority)의 검증인 세트 멤버십 관리는 일시적입니다. 초기 네트워크 안정화 기간 후, 이 권한은 검증인 세트 자체로 전환됩니다. 이 전환 이후, 검증인 세트 멤버십 변경에는 지분 증명 네트워크의 프로토콜 수준 변경에 필요한 기준과 동일한 스테이킹 토큰의 3분의 2 이상의 압도적 다수가 필요합니다.
네트워크를 불안정하게 만들 수 있는 갑작스러운 변경을 방지하기 위해 프로토콜 매개변수는 검증인 교체율을 제한합니다.
주어진 기간 내에 검증인 세트의 고정된 비율만 교체되거나 제거될 수 있으며, 이 비율은 조정 가능한 프로토콜 매개변수입니다.
이를 통해 네트워크 안정성을 유지하면서 검증인 세트의 점진적인 진화가 보장됩니다.

5.3 참여 요건
검증인은 검증인 세트에 참여할 자격을 얻으려면 최소 위임 지분 요건을 충족해야 하며,
솔라나의 경제 모델과의 호환성을 유지하면서 허가된 구성 요소를 추가해야 합니다. 충분한 지분 확보와 승인 설정이라는 두 가지 요건을 통해 검증자는 경제적 이익과 네트워크 성능을 유지할 수 있는 운영 역량을 모두 확보할 수 있습니다.

5.4 근거 및 네트워크 거버넌스
허가형 검증자 세트는 네트워크 탈중앙화에 실질적인 영향을 미치지 않습니다. 모든 지분 증명 네트워크에서 3분의 2 이상의 지분을 보유한 경우, 포킹을 통해 프로토콜에 대한 임의적인 변경을 이미 실행할 수 있기 때문입니다. 대신, 이 메커니즘은 검증자 세트가 프로토콜 규칙에 명시하기 어려울 수 있는 유익한 네트워크 동작을 강제할 수 있는 공식적인 프레임워크를 제공합니다.
예를 들어, 검증자를 추방할 수 있는 기능을 통해 네트워크는 다음과 같은 상황에 대응할 수 있습니다.
● 네트워크 기능을 저하시키는 지속적인 성능 문제
● 네트워크 사용성을 저해하는 악의적인 MEV 추출
● 프로토콜에서 직접 적용할 수 없는 네트워크 불안정화 동작(예: 터빈 블록을 유출하지만 전달하지 않는 동작)
● 개별 검증자에게는 잠재적으로 이익이 될 수 있지만 네트워크의 장기적인 가치를 저해하는 기타 동작
이 거버넌스 메커니즘은 특정 동작이 단기적으로는 이익이 될 수 있지만 네트워크의 장기적인 생존 가능성을 저해할 수 있음을 인지합니다. Fogo는 멤버십 제어를 통해 지분 가중 검증자 세트가 이러한 행동을 감시할 수 있도록 함으로써, 지분 증명 시스템의 근본적인 탈중앙화 특성을 저해하지 않으면서 검증자 인센티브를 네트워크의 장기적인 건전성에 맞춥니다.

6. 향후 확장
Fogo의 핵심 혁신은 다중 로컬 합의, 클라이언트 성능 및 검증자 세트 관리에 중점을 두고 있지만, 제네시스 또는 출시 후 구현을 위해 몇 가지 추가 프로토콜 확장이 고려 중입니다. 이러한 기능은 Solana 생태계와의 하위 호환성을 유지하면서 네트워크 기능을 더욱 향상시킬 것입니다.

6.1 SPL 토큰 수수료 지불
더 넓은 네트워크 접근성을 제공하고 사용자 경험을 개선하기 위해 Fogo는 발신 계정에 SOL 없이도 거래를 실행할 수 있는 fee_payer_unsigned 거래 유형을 도입할 가능성이 있습니다. 이 기능은 온체인 수수료 지불 프로그램과 결합되어 사용자가 프로토콜 보안과 검증자 보상을 유지하면서 SPL 토큰을 사용하여 거래 수수료를 지불할 수 있도록 합니다.
이 시스템은 프로토콜 외 허가 없는 릴레이어 마켓플레이스를 통해 작동합니다. 사용자는 의도한 작업과 최종 수수료 납부자에게 보상하기 위한 SPL 토큰 지불을 모두 포함하는 거래를 구성합니다. 이러한 거래는 수수료 납부자를 지정하지 않고도 유효하게 서명될 수 있으며, 누구든 서명을 추가하고 SOL 수수료를 지불하여 거래를 완료할 수 있습니다. 이 메커니즘은 거래 승인과 수수료 지불을 효과적으로 분리하여 SOL 잔액이 없는 계정도 다른 귀중한 자산을 보유하는 한 네트워크와 상호 작용할 수 있도록 합니다. 이 기능은 최소한의 프로토콜 수정만으로 구현되며, 새로운 거래 유형과 릴레이어 보상을 처리하는 온체인 프로그램만 추가하면 됩니다. 이 시스템은 기본 프로토콜의 보안 속성을 유지하면서 거래 릴레이 서비스를 위한 효율적인 시장을 생성합니다. 더 복잡한 수수료 추상화 시스템과 달리, 이 접근 방식은 검증자 지불 메커니즘이나 합의 규칙을 변경할 필요가 없습니다.

7. 결론
Fogo는 성능, 탈중앙화, 보안 간의 관계에 대한 기존의 가정에 도전하는 새로운 블록체인 아키텍처 접근 방식을 제시합니다.
고성능 클라이언트 구현과 동적 다중 로컬 합의 및 선별된 검증자 세트를 결합하여, 이 프로토콜은 지분 증명 시스템의 근본적인 보안 특성을 손상시키지 않으면서도 전례 없는 성능을 달성합니다. 지리적 다양성을 유지하면서 합의를 동적으로 재배치할 수 있는 능력은 성능 최적화와 시스템 복원력을 모두 제공하며, 프로토콜의 폴백 메커니즘은 악조건에서도 지속적인 작동을 보장합니다. 신중한 경제적 설계를 통해 이러한 메커니즘은 프로토콜 시행이 아닌 검증자 인센티브에서 자연스럽게 도출되어, 견고하고 적응력 있는 시스템을 구축합니다. 블록체인 기술이 끊임없이 발전함에 따라, Fogo의 혁신은 신중한 프로토콜 설계가 블록체인 네트워크를 가치 있게 만드는 보안 및 탈중앙화 특성을 유지하면서 성능의 한계를 어떻게 뛰어넘을 수 있는지 보여줍니다.
`

// Filipino
const FILIPINO_TEXT = `
Fogo: Isang Mataas na Pagganap ng SVM Layer 1
Bersyon 1.0

Abstract
Ipinakilala ng papel na ito ang Fogo, isang nobelang layer 1 blockchain protocol na naghahatid ng tagumpay
pagganap sa throughput, latency, at pamamahala ng congestion. Bilang extension ng
Solana protocol, pinapanatili ng Fogo ang buong compatibility sa SVM execution layer, na nagpapahintulot
umiiral na mga programa, tooling, at imprastraktura ng Solana upang walang putol na lumipat habang
pagkamit ng makabuluhang mas mataas na pagganap at mas mababang latency.
Nag-aambag si Fogo ng tatlong nobelang inobasyon:
● Isang pinag-isang pagpapatupad ng kliyente batay sa purong Firedancer, na nag-a-unlock ng performance
mga antas na hindi maaabot ng mga network na may mas mabagal na mga kliyente—kabilang ang Solana mismo.
● Multi-local consensus na may dynamic na colocation, na nakakamit ng mga block times at latency
mas mababa sa anumang pangunahing blockchain.
● Isang na-curate na hanay ng validator na nagbibigay-insentibo sa mataas na pagganap at humahadlang sa mandaragit
pag-uugali sa antas ng validator.
Ang mga inobasyong ito ay naghahatid ng malaking tagumpay sa pagganap habang pinapanatili ang
desentralisasyon at katatagan na mahalaga sa isang layer 1 blockchain.

1. Panimula
Ang mga network ng Blockchain ay nahaharap sa isang patuloy na hamon sa pagbabalanse ng pagganap sa
desentralisasyon at seguridad. Ang mga blockchain ngayon ay naghahabol ng matinding limitasyon sa throughput
na ginagawa silang hindi angkop para sa pandaigdigang aktibidad sa pananalapi. Mas kaunti sa 50 ang proseso ng Ethereum
transactions per second (TPS) sa base layer nito. Kahit na ang pinaka-sentralisadong layer 2s na hawakan
mas mababa sa 1,000 TPS. Habang ang Solana ay idinisenyo para sa mas mataas na pagganap, ang mga limitasyon mula sa
Ang pagkakaiba-iba ng kliyente ay kasalukuyang nagdudulot ng pagsisikip sa 5,000 TPS. Sa kaibahan, tradisyonal na pananalapi
Ang mga system tulad ng NASDAQ, CME, at Eurex ay regular na nagpoproseso ng higit sa 100,000 mga operasyon bawat
pangalawa.
Ang latency ay nagpapakita ng isa pang kritikal na limitasyon para sa mga desentralisadong protocol ng blockchain. Sa
mga pamilihan sa pananalapi—lalo na para sa pagtuklas ng presyo sa mga pabagu-bagong asset—ang mababang latency ay
mahalaga para sa kalidad at pagkatubig ng merkado. Ang mga tradisyunal na kalahok sa merkado ay nagpapatakbo sa
end-to-end latencies sa millisecond o sub-millisecond scale. Ang mga bilis na ito ay lamang
matamo kapag ang mga kalahok sa merkado ay maaaring co-locate sa kapaligiran ng pagpapatupad dahil sa
ang bilis ng mga hadlang sa liwanag.
Ang mga tradisyonal na arkitektura ng blockchain ay gumagamit ng mga validator set na ipinamamahagi sa buong mundo na gumagana
nang walang kaalaman sa heograpiya, na lumilikha ng mga pangunahing limitasyon sa pagganap. Liwanag mismo
tumatagal ng mahigit 130 milliseconds para umikot sa globo sa equator, kahit na naglalakbay sa isang
perpektong bilog—at ang mga landas ng network sa totoong mundo ay nagsasangkot ng karagdagang distansya at imprastraktura
mga pagkaantala. Ang mga pisikal na limitasyong ito ay pinagsama kapag ang pinagkasunduan ay nangangailangan ng maramihan
mga round ng komunikasyon sa pagitan ng mga validator. Ang mga inter-regional latencies na ito ay pinagsama-sama
kapag ang pinagkasunduan ay nangangailangan ng maraming round ng komunikasyon sa pagitan ng mga validator. Bilang resulta,
dapat ipatupad ng mga network ang mga konserbatibong oras ng pag-block at mga pagkaantala sa pagtatapos upang mapanatili
katatagan. Kahit na sa ilalim ng pinakamainam na mga kondisyon, isang mekanismo ng pinagkasunduan na ipinamamahagi sa buong mundo
hindi madaig ang mga pangunahing pagkaantala sa networking.
Habang ang mga blockchain ay sumasama pa sa pandaigdigang sistema ng pananalapi, hihingi ang mga user
pagganap na maihahambing sa mga sentralisadong sistema ngayon. Nang walang maingat na disenyo, pulong
ang mga kahilingang ito ay maaaring makabuluhang ikompromiso ang desentralisasyon ng mga network ng blockchain at
katatagan. Upang matugunan ang hamon na ito, iminumungkahi namin ang Fogo layer one blockchain. ni Fogo
Ang pangunahing pilosopiya ay upang i-maximize ang throughput at i-minimize ang latency sa pamamagitan ng dalawang key
approach: una, gamit ang pinaka-performant client software sa isang mahusay na desentralisado
set ng validator; at pangalawa, tinatanggap ang co-located consensus habang pinapanatili ang karamihan sa
mga benepisyo ng desentralisasyon ng pandaigdigang pinagkasunduan.

2. Balangkas
Ang papel ay pinaghiwa-hiwalay sa mga seksyon na sumasaklaw sa mga pangunahing desisyon sa disenyo sa paligid ng Fogo.
Sinasaklaw ng Seksyon 3 ang kaugnayan ng Fogo sa Solana blockchain protocol at nito
diskarte patungkol sa pag-optimize at pagkakaiba-iba ng kliyente. Saklaw ng Seksyon 4 ang multi-local
pinagkasunduan, praktikal na pagpapatupad nito, at ang mga tradeos na ginagawa nito kaugnay sa global o
lokal na pinagkasunduan. Sinasaklaw ng Seksyon 5 ang diskarte ni Fogo sa pagsisimula at pagpapanatili ng
set ng validator. Saklaw ng Seksyon 6 ang mga prospective na extension na maaaring ipakilala pagkatapos
genesis.

3. Protocol at mga Kliyente
Sa isang base layer nagsisimula ang Fogo sa pamamagitan ng pagbuo sa ibabaw ng pinaka-performant na malawakang ginagamit
blockchain protocol hanggang ngayon, Solana. Ang network ng Solana ay mayroon nang marami
mga solusyon sa pag-optimize, kapwa sa mga tuntunin ng disenyo ng protocol at mga pagpapatupad ng kliyente. Fogo
tina-target ang maximum na posibleng backwards compatibility sa Solana, kasama ang full
compatibility sa SVM execution layer at close compatibility sa TowerBFT
consensus, Turbine block propagation, Solana leader rotation at lahat ng iba pang major
mga bahagi ng networking at consensus layers. Ang compatibility na ito ay nagpapahintulot sa Fogo na
madaling isama at i-deploy ang mga kasalukuyang programa, tooling at imprastraktura mula sa Solana
ecosystem; pati na rin ang makinabang mula sa patuloy na pagpapabuti ng upstream sa Solana.
Gayunpaman hindi tulad ng Solana, ang Fogo ay tatakbo kasama ang isang kanonikal na kliyente. Ang canonical client na ito
ay ang pinakamataas na pagganap ng pangunahing kliyente na tumatakbo sa Solana. Ito ay nagpapahintulot sa Fogo na
makamit ang makabuluhang mas mataas na pagganap dahil ang network ay palaging tatakbo sa
bilis ng pinakamabilis na kliyente. Samantalang ang Solana, limitado ng pagkakaiba-iba ng kliyente ay palaging magiging
bottlenecked sa bilis ng pinakamabagal na kliyente. Sa ngayon at sa hinaharap na ito
Ang canonical na kliyente ay ibabatay sa salansan ng Firedancer.

3.1 Bumbero
Ang Firedancer ay ang high-performance na Solana-compatible na pagpapatupad ng kliyente ng Jump Crypto,
nagpapakita ng mas mataas na throughput sa pagproseso ng transaksyon kaysa sa kasalukuyang validator
mga kliyente sa pamamagitan ng optimized parallel processing, memory management, at SIMD
mga tagubilin.
Mayroong dalawang bersyon: "Frankendancer," isang hybrid na gumagamit ng makina ng pagpoproseso ng Firedancer na may
networking stack ng rust validator, at ang buong pagpapatupad ng Firedancer na may a
kumpletong C networking stack rewrite, kasalukuyang nasa late-stage development.
Ang parehong mga bersyon ay nagpapanatili ng pagiging tugma sa protocol ng Solana habang pina-maximize ang pagganap.
Kapag nakumpleto na, ang purong pagpapatupad ng Firedancer ay inaasahang magtatakda ng bagong performance
mga benchmark, na ginagawa itong perpekto para sa mga kinakailangan sa high-throughput ng Fogo. Magsisimula ang Fogo sa
isang network na nakabase sa Frankendancer pagkatapos ay lumipat sa purong Firedancer.

3.2 Mga Canonical na Kliyente kumpara sa Pagkakaiba-iba ng Kliyente
Gumagana ang mga protocol ng Blockchain sa pamamagitan ng software ng kliyente na nagpapatupad ng kanilang mga panuntunan at
mga pagtutukoy. Habang tinutukoy ng mga protocol ang mga patakaran ng pagpapatakbo ng network, nagsasalin ang mga kliyente
ang mga pagtutukoy na ito sa executable software. Ang relasyon sa pagitan ng mga protocol at
ang mga kliyente ay makasaysayang sumunod sa magkakaibang mga modelo, na may ilang mga network na aktibong nagpo-promote
pagkakaiba-iba ng kliyente habang ang iba ay natural na nagkakaisa sa mga kanonikal na pagpapatupad.
Ang pagkakaiba-iba ng kliyente ay tradisyonal na nagsisilbi sa maraming layunin: nagbibigay ito ng pagpapatupad
redundancy, nagbibigay-daan sa independiyenteng pag-verify ng mga panuntunan sa protocol, at theoretically binabawasan
ang panganib ng mga kahinaan ng software sa buong network. Ang network ng Bitcoin ay nagpapakita ng isang
kawili-wiling pamarisan - habang umiiral ang maraming pagpapatupad ng kliyente, nagsisilbing Bitcoin Core
ang de facto canonical na kliyente, na nagbibigay ng reference na pagpapatupad na tumutukoy
praktikal na pag-uugali ng network.
Gayunpaman, sa mataas na pagganap ng mga network ng blockchain, ang relasyon sa pagitan ng protocol
at ang pagpapatupad ng kliyente ay nagiging mas pinipigilan. Kapag ang isang protocol ay lumalapit sa
pisikal na mga limitasyon ng computing at networking hardware, ang espasyo para sa pagpapatupad
natural na nagkakakontrata ang pagkakaiba-iba. Sa mga hangganan ng pagganap na ito, pinakamainam na pagpapatupad
dapat magtagpo sa mga katulad na solusyon habang kinakaharap nila ang parehong pisikal na limitasyon at
mga kinakailangan sa pagganap. Anumang makabuluhang paglihis mula sa pinakamainam na pagpapatupad
ang mga pattern ay magreresulta sa mababang pagganap na ginagawang hindi mabubuhay ang kliyente
pagpapatakbo ng validator.
Ang dynamic na ito ay partikular na nakikita sa mga network na nagta-target ng pinakamababang posibleng mga oras ng pag-block
at maximum na throughput ng transaksyon. Sa ganitong mga sistema, ang teoretikal na benepisyo ng kliyente
ang pagkakaiba-iba ay nagiging hindi gaanong nauugnay, dahil ang overhead ng pagpapanatili ng pagiging tugma sa pagitan
Ang magkakaibang pagpapatupad ng kliyente ay maaaring maging isang bottleneck sa pagganap. kailan
itulak ang pagganap ng blockchain sa mga pisikal na limitasyon, ang mga pagpapatupad ng kliyente ay kinakailangan
magbahagi ng mga pangunahing desisyon sa arkitektura, na ginagawa ang mga benepisyo sa seguridad ng pagpapatupad
pagkakaiba-iba sa kalakhan theoretical.

3.3 Mga Insentibo sa Protocol para sa mga Kliyente na gumaganap
Habang pinapayagan ng Fogo ang anumang sumusunod na pagpapatupad ng kliyente, natural ang arkitektura nito
nagbibigay ng insentibo gamit ang magagamit na kliyente na may pinakamataas na pagganap, na hinihimok ng mga praktikal na pangangailangan
ng mga high-performance na co-located na operasyon.
Hindi tulad ng mga tradisyunal na network kung saan ang heyograpikong distansya ay lumilikha ng mga pangunahing bottleneck,
Nangangahulugan ang co-located na disenyo ng Fogo na direktang tinutukoy ang kahusayan sa pagpapatupad ng kliyente
pagganap ng validator. Sa ganitong kapaligiran, ang latency ng network ay minimal, na ginagawang kliyente
bilisan ang kritikal na salik.
Ang mga parameter ng dynamic na block time at laki ng network ay lumilikha ng pang-ekonomiyang presyon sa
i-maximize ang throughput. Dapat pumili ang mga validator sa pagitan ng paggamit ng pinakamabilis na kliyente o sa panganib
mga parusa at pinababang kita. Ang mga tumatakbong mas mabagal na kliyente ay maaaring may panganib na mawala ang mga bloke
pagboto para sa mga agresibong parameter o mawalan ng kita sa pamamagitan ng pagboto para sa mga konserbatibo.
Lumilikha ito ng natural na seleksyon para sa pinakaepektibong pagpapatupad ng kliyente. Sa Fogo's
co-located na kapaligiran, kahit maliit na pagkakaiba sa pagganap ay nagiging makabuluhan - a
bahagyang mas mabagal na kliyente ay patuloy na hindi gumaganap, na humahantong sa hindi nakuha na mga bloke at
mga parusa. Nangyayari ang pag-optimize na ito sa pamamagitan ng sariling interes ng validator, hindi mga panuntunan sa protocol.
Bagama't hindi direktang maipapatupad ng protocol ang pagpili ng kliyente, natural ang mga panggigipit sa ekonomiya
himukin ang network patungo sa pinakamabisang pagpapatupad habang pinapanatili ang mapagkumpitensya
pag-unlad ng kliyente.

4. Multi-Local Consensus
Ang multi-local consensus ay kumakatawan sa isang nobelang diskarte sa blockchain consensus na
dynamic na binabalanse ang mga benepisyo sa pagganap ng validator co-location sa seguridad
mga pakinabang ng geographic na pamamahagi. Pinapayagan ng system ang mga validator na i-coordinate ang kanilang
mga pisikal na lokasyon sa buong panahon habang pinapanatili ang mga natatanging cryptographic na pagkakakilanlan para sa
magkakaibang mga zone, na nagbibigay-daan sa network na makamit ang ultra-low latency consensus habang
normal na operasyon habang pinapanatili ang kakayahang bumalik sa pandaigdigang pinagkasunduan kapag
kailangan.
Ang multi-local na consensus na modelo ng Fogo ay nakakakuha ng inspirasyon mula sa mga naitatag na kasanayan sa
tradisyonal na mga pamilihan sa pananalapi, partikular na ang modelong pangkalakal na "follow the sun" na ginagamit sa dayuhan
exchange at iba pang pandaigdigang pamilihan. Sa tradisyonal na pananalapi, paggawa ng merkado at pagkatubig
Ang probisyon ay natural na lumilipat sa pagitan ng mga pangunahing sentro ng pananalapi habang umuusad ang araw ng pangangalakal
– mula sa Asya hanggang Europa hanggang Hilagang Amerika – nagbibigay-daan para sa patuloy na operasyon ng merkado habang
pagpapanatili ng puro pagkatubig sa mga partikular na heyograpikong rehiyon. Ang modelong ito ay napatunayan
epektibo sa tradisyonal na pananalapi dahil kinikilala nito na habang ang mga pamilihan ay pandaigdigan, ang
Ang mga pisikal na limitasyon ng networking at mga oras ng reaksyon ng tao ay gumagawa ng ilang antas ng
heograpikong konsentrasyon na kinakailangan para sa pinakamainam na pagtuklas ng presyo at kahusayan sa merkado.

4.1 Mga Sona at Pag-ikot ng Sona
Ang isang zone ay kumakatawan sa isang heograpikal na lugar kung saan ang mga validator ay nagtutulungan upang makamit ang pinakamainam
pinagkasunduan na pagganap. Sa isip, ang isang zone ay isang solong data center kung saan ang latency ng network
sa pagitan ng mga validator ay lumalapit sa mga limitasyon ng hardware. Gayunpaman, ang mga zone ay maaaring lumawak sa
sumasaklaw sa mas malalaking rehiyon kung kinakailangan, nakikipagkalakalan ng ilang pagganap para sa praktikal
pagsasaalang-alang. Ang eksaktong kahulugan ng isang zone ay lumalabas sa pamamagitan ng social consensus sa mga
validator sa halip na mahigpit na tinukoy sa protocol. Ang kakayahang umangkop na ito ay nagbibigay-daan sa
network upang umangkop sa real-world na mga hadlang sa imprastraktura habang pinapanatili ang pagganap
mga layunin.
Ang kakayahan ng network na umikot sa pagitan ng mga zone ay nagsisilbi ng maraming kritikal na layunin:
1. Jurisdictional Decentralization: Pinipigilan ng regular na pag-ikot ng zone ang pagkuha ng
pinagkasunduan ng alinmang hurisdiksyon. Pinapanatili nito ang paglaban ng network sa
presyon ng regulasyon at tinitiyak na walang iisang pamahalaan o awtoridad ang maaaring magsagawa
pangmatagalang kontrol sa pagpapatakbo ng network.
2. Infrastructure Resilience: Maaaring mabigo ang mga data center at imprastraktura ng rehiyon
maraming dahilan - mga natural na sakuna, pagkawala ng kuryente, mga isyu sa networking, hardware
mga pagkabigo, o mga kinakailangan sa pagpapanatili. Tinitiyak ng pag-ikot ng zone na ang network ay hindi
permanenteng umaasa sa anumang punto ng kabiguan. Makasaysayang mga halimbawa ng major
mga pagkawala ng data center, gaya ng mga sanhi ng masasamang pangyayari sa panahon o power grid
mga kabiguan, ipakita ang kahalagahan ng kakayahang umangkop na ito.
3. Madiskarteng Pag-optimize ng Pagganap: Maaaring mapili ang mga zone para sa pag-optimize
mga partikular na aktibidad sa network. Halimbawa, sa panahon ng mga epoch na naglalaman ng makabuluhan
mga kaganapan sa pananalapi (tulad ng mga anunsyo ng Federal Reserve, pangunahing ekonomiya
ulat, o pagbubukas ng merkado), maaaring piliin ng mga validator na hanapin ang pinagkasunduan malapit sa
pinagmulan ng impormasyong ito na sensitibo sa presyo. Ang kakayahang ito ay nagpapahintulot sa network na
bawasan ang latency para sa mga kritikal na operasyon habang pinapanatili ang flexibility para sa dierent na paggamit
mga kaso sa buong panahon.

4.2 Pangunahing Pamamahala
Ang protocol ay nagpapatupad ng two-tier key management system na naghihiwalay sa pangmatagalan
pagkakakilanlan ng validator mula sa partisipasyon ng consensus na partikular sa zone. Ang bawat validator ay nagpapanatili ng a
global key pair na nagsisilbing kanilang root identity sa network. Ginagamit ang global key na ito para sa
mataas na antas ng operasyon tulad ng stake delegation, zone registration, at partisipasyon sa
pandaigdigang pinagkasunduan. Ang pandaigdigang susi ay dapat na secure na may pinakamataas na posibleng seguridad
mga panukala, dahil kinakatawan nito ang sukdulang awtoridad ng validator sa network.
Ang mga validator ay maaaring magtalaga ng awtoridad sa mga sub-key na partikular sa zone sa pamamagitan ng isang on-chain
programa sa pagpapatala. Ang mga sub-key na ito ay partikular na pinahintulutan para sa paglahok ng pinagkasunduan
sa loob ng mga itinalagang co-location zone. Ang paghihiwalay na ito ay nagsisilbi ng maraming layuning pangseguridad: ito
nagbibigay-daan sa mga validator na mapanatili ang magkakaibang mga modelo ng seguridad para sa magkakaibang uri ng mga pangunahing uri, pinapaliit nito
ang pagkakalantad ng mga pandaigdigang key sa pamamagitan ng pagpapanatiling oline sa mga ito sa panahon ng normal na operasyon, at ito
binabawasan ang panganib ng pangunahing kompromiso sa panahon ng mga paglipat ng pisikal na imprastraktura sa pagitan
mga zone.
Ang delegasyon ng mga key na partikular sa zone ay pinamamahalaan sa pamamagitan ng isang on-chain na programa na
nagpapanatili ng registry ng mga awtorisadong zone key para sa bawat validator. Habang ang mga validator ay maaari
magparehistro ng mga bagong zone key anumang oras gamit ang kanilang global key, ang mga pagpaparehistrong ito ay tumatagal lamang
eect sa mga hangganan ng kapanahunan. Tinitiyak ng pagkaantala na ito na ang lahat ng kalahok sa network ay may oras
i-verify at itala ang mga bagong pangunahing delegasyon bago sila maging aktibo sa pinagkasunduan.

4.3 Panukala at Pag-activate ng Sona
Maaaring imungkahi ang mga bagong zone sa pamamagitan ng on-chain na mekanismo ng pamamahala gamit ang global
mga susi. Gayunpaman, upang matiyak ang katatagan ng network at bigyan ang mga validator ng sapat na oras upang maghanda
ligtas na imprastraktura, ang mga iminungkahing sona ay may mandatoryong panahon ng pagkaantala bago ito maging
karapat-dapat para sa pagpili. Ang pagkaantala na ito, na itinakda bilang parameter ng protocol, ay dapat na mahaba
payagan ang mga validator na:
● I-secure ang naaangkop na pisikal na imprastraktura sa bagong sona
● Magtatag ng mga secure na key management system para sa bagong lokasyon
● I-set up at subukan ang networking infrastructure
● Magsagawa ng mga kinakailangang pagsusuri sa seguridad ng bagong pasilidad
● Magtatag ng mga pamamaraan sa pag-backup at pagbawi
Ang panahon ng pagkaantala ay nagsisilbi rin bilang isang hakbang sa seguridad laban sa mga potensyal na pag-atake kung saan a
Maaaring subukan ng malisyosong aktor na pilitin ang pinagkasunduan sa isang lugar kung saan mayroon sila
mga kalamangan sa imprastraktura. Sa pamamagitan ng pag-aatas ng paunang abiso para sa mga bagong zone, ang protocol
tinitiyak na ang lahat ng mga validator ay may patas na pagkakataon na magtatag ng presensya sa anumang zone na iyon
maaaring mapili para sa pinagkasunduan.
Pagkatapos lamang makumpleto ng isang zone ang panahon ng paghihintay na ito maaari itong mapili sa pamamagitan ng regular
proseso ng pagboto sa sona para sa mga hinaharap na panahon. Ang maingat na diskarte na ito sa pag-activate ng zone ay nakakatulong
mapanatili ang seguridad at katatagan ng network habang pinapayagan pa rin ang pagdaragdag ng bagong estratehiko
mga lokasyon habang nagbabago ang mga kinakailangan sa network.

4.4 Proseso ng Pagboto sa Pagpili ng Sona
Ang pagpili ng mga consensus zone ay nangyayari sa pamamagitan ng on-chain na mekanismo ng pagboto na
binabalanse ang pangangailangan para sa coordinated validator movement na may network security. Mga validator
dapat makamit ang quorum sa bawat hinaharap na epoch na co-location zone sa loob ng isang configurable
oras ng korum bago ang paglipat ng panahon. Sa pagsasagawa, ang iskedyul ng kapanahunan ay maaaring
tinutukoy na may ilang oras ng pangunguna, na ang pagboto sa panahon ay pinipili ang sona para sa
kapanahunan n + k. Ang mga boto ay ibinibigay sa pamamagitan ng on-chain registry program gamit ang global ng mga validator
mga susi, na may kapangyarihan sa pagboto na natimbang ayon sa stake. Gumagamit ang prosesong ito ng mga pandaigdigang key kaysa sa zone
key dahil hindi ito latency-sensitive at nangangailangan ng maximum na seguridad.
Ang proseso ng pagboto ay nangangailangan ng isang supermajority ng stake weight upang maitatag ang korum, pagtiyak
na ang isang maliit na grupo ng mga validator ay hindi maaaring unilaterally na puwersahin ang pagbabago ng zone. Kung nabigo ang mga validator
makamit ang quorum sa loob ng itinalagang timeframe, awtomatikong magde-default ang network sa
global consensus mode para sa susunod na panahon. Tinitiyak ng mekanismong ito ng fallback ang network
pagpapatuloy kahit na hindi magkasundo ang mga validator sa isang co-location zone.
Sa panahon ng pagboto, sinenyasan ng mga validator ang kanilang ginustong sona para sa susunod na panahon
at ang kanilang target na block time para sa zone na iyon. Ang pinagsamang pagpili ng lokasyon at pagganap
pinahihintulutan ng mga parameter ang network na mag-optimize para sa parehong mga pisikal na hadlang at pagganap
kakayahan ng bawat zone. Mahalaga, ang panahon ng pagboto ay nagbibigay ng oras para sa mga validator
maghanda ng imprastraktura sa napiling zone, kabilang ang pag-init ng mga key na partikular sa zone at
pagsubok ng koneksyon sa network. Ang panahon ng paghahanda na ito ay mahalaga para sa pagpapanatili ng network
katatagan sa panahon ng mga paglipat ng zone.

4.5 Global Consensus Mode
Ang pandaigdigang consensus mode ay nagsisilbing parehong mekanismo ng fallback at isang pundasyong kaligtasan
tampok ng protocol. Habang nakakamit ng Fogo ang pinakamataas na performance nito sa pamamagitan ng zone-based
consensus, tinitiyak ng kakayahang bumalik sa pandaigdigang pinagkasunduan na magpapatuloy ang network
operasyon sa ilalim ng masamang kondisyon. Sa pandaigdigang consensus mode, gumagana ang network sa
konserbatibong mga parameter na na-optimize para sa globally distributed validation: isang nakapirming 400ms block
oras at pinababang laki ng bloke upang mapaunlakan ang mas mataas na mga latency ng network sa pagitan
geographically dispersed validators.
Ang protocol ay pumapasok sa global consensus mode sa pamamagitan ng dalawang pangunahing landas:
● Nabigong Pagpili ng Sona: Kung nabigo ang mga validator na makamit ang korum sa susunod na panahon
consensus zone sa loob ng itinalagang panahon ng pagboto, awtomatikong ang network
mga default sa pandaigdigang pinagkasunduan para sa panahong iyon.
● Runtime Consensus Failure: Kung nabigo ang kasalukuyang zone na makamit ang block finality sa loob
ang itinalagang panahon ng pag-timeout nito sa isang panahon, agad na lumipat ang protocol
sa pandaigdigang consensus mode para sa natitirang bahagi ng panahong iyon. Ang fallback na ito ay "sticky" -
sa sandaling na-trigger ang kalagitnaan ng panahon, ang network ay nananatili sa pandaigdigang pinagkasunduan hanggang sa susunod
epoch transition, inuuna ang katatagan kaysa sa pagbawi ng performance.
Sa global consensus mode, ang mga validator ay lumahok gamit ang isang itinalagang key para sa global
operasyon, na maaaring isa o hindi isa sa kanilang mga key na partikular sa zone, at ang network
nagpapanatili ng parehong mga panuntunan sa pagpili ng tinidor bilang consensus na nakabatay sa zone. Habang ang mode na ito ay nagsasakripisyo
ang napakababang latency na makakamit sa mga co-located na zone, nagbibigay ito ng matatag na pundasyon para sa
pagpapatuloy ng network at ipinapakita kung paano pinapanatili ng Fogo ang kaligtasan nang hindi nagsasakripisyo
kabuhayan sa ilalim ng masasamang kondisyon.

5. Validator Set
Upang makamit ang mataas na pagganap at mabawasan ang mapang-abusong mga kasanayan sa MEV, gagamitin ng Fogo ang a
na-curate na validator set. Ito ay kinakailangan dahil kahit isang maliit na bahagi ng kulang sa probisyon
ang pagpapatunay ng mga node ay maaaring pigilan ang network na maabot ang mga pisikal na limitasyon ng pagganap nito.
Sa una, gagana ang curation sa pamamagitan ng proof-of-authority bago lumipat sa direct
pagpapahintulot ng validator set. Sa pamamagitan ng paglalagay ng awtoridad sa pag-curate sa hanay ng validator,
Maaaring ipatupad ng Fogo ang social layer na parusa ng mapang-abusong pag-uugali tulad ng tradisyonal
proof-of-authority system, ngunit sa paraang hindi mas sentralisado kaysa sa fork power na iyon
2/3 ng stake ay hawak na sa mga tradisyonal na PoS network tulad ng Solana.

5.1 Sukat at Paunang Configuration
Ang Fogo ay nagpapanatili ng isang pinahintulutang validator set na may minimum na ipinapatupad ng protocol at
maximum na bilang ng mga validator upang matiyak ang angkop na desentralisasyon habang nag-o-optimize para sa
pagganap ng network. Ang paunang laki ng target ay magiging humigit-kumulang 20-50 validator, bagaman
ang cap na ito ay ipinatupad bilang isang parameter ng protocol na maaaring iakma bilang network
tumatanda. Sa genesis, ang paunang validator set ay pipiliin ng isang genesis authority, na
ay magpapanatili ng mga pansamantalang pahintulot upang pamahalaan ang komposisyon ng validator set sa panahon ng
mga unang yugto ng network.

5.2 Pamamahala at Transisyon
Ang kontrol ng genesis authority sa validator set membership ay idinisenyo upang maging
pansamantala. Pagkatapos ng unang panahon ng pagpapatatag ng network, lilipat ang awtoridad na ito sa
itinakda mismo ng validator. Kasunod ng paglipat na ito, gagawin ang mga pagbabago sa validator set membership
nangangailangan ng dalawang-ikatlong supermajority ng mga staked token, na tumutugma sa parehong threshold
kinakailangan para sa mga pagbabago sa antas ng protocol sa mga network ng proof-of-stake.
Upang maiwasan ang mga biglaang pagbabago na maaaring makapagpapahina sa network, nililimitahan ang mga parameter ng protocol
mga rate ng paglilipat ng validator. Hindi hihigit sa isang nakapirming porsyento ng validator set ang maaaring
pinalitan o na-eject sa loob ng isang partikular na yugto ng panahon, kung saan ang porsyentong ito ay isang tunable na protocol
parameter. Tinitiyak nito ang unti-unting ebolusyon ng validator set habang pinapanatili ang network
katatagan.

5.3 Mga Kinakailangan sa Pakikilahok
Dapat matugunan ng mga validator ang pinakamababang iniatas na mga kinakailangan sa stake upang maging karapat-dapat para sa
validator set, pinapanatili ang pagiging tugma sa modelo ng ekonomiya ni Solana habang idinaragdag ang
pinahintulutang bahagi. Ang dalawahang kinakailangan na ito - sapat na taya at nakatakdang pag-apruba -
Tinitiyak na ang mga validator ay may parehong pang-ekonomiyang balat sa laro at sa pagpapatakbo
mga kakayahan upang mapanatili ang pagganap ng network.

5.4 Makatuwiran at Pamamahala sa Network
Ang pinahintulutang validator set ay hindi nakakaapekto sa desentralisasyon ng network, gaya ng sa
anumang proof-of-stake network, ang dalawang-ikatlong supermajority ng stake ay maaari nang magdulot
arbitrary na pagbabago sa protocol sa pamamagitan ng forking. Sa halip, ang mekanismong ito ay nagbibigay ng a
pormal na balangkas para sa validator na itinakda upang ipatupad ang mga kapaki-pakinabang na pag-uugali ng network na maaaring
kung hindi man ay mahirap mag-encode sa mga panuntunan sa protocol.
Halimbawa, ang kakayahang mag-eject ng mga validator ay nagbibigay-daan sa network na tumugon sa:
● Patuloy na mga isyu sa pagganap na nagpapababa sa mga kakayahan ng network
● Mapang-abusong MEV extraction na pumipinsala sa usability ng network
● Network destabilizing behavior na hindi maaaring ipatupad nang direkta sa protocol, gaya ng
leaching ngunit hindi nagpapasa ng mga bloke ng Turbine
● Iba pang mga pag-uugali na, habang potensyal na kumikita para sa mga indibidwal na validator, ay nakakapinsala sa
pangmatagalang halaga ng network
Kinikilala ng mekanismo ng pamamahala na ito na habang ang ilang mga pag-uugali ay maaaring kumikita sa
sa maikling panahon, maaari nilang masira ang pangmatagalang viability ng network. Sa pamamagitan ng pagpapagana ng
Ang stake-weighted validator ay itinakda sa pulisya ang gayong mga pag-uugali sa pamamagitan ng kontrol ng membership, Fogo
inihanay ang mga insentibo ng validator sa pangmatagalang kalusugan ng network nang hindi kinokompromiso ang
pangunahing katangian ng desentralisasyon na likas sa mga sistema ng patunay ng istaka.

6. Mga Prospective na Extension
Habang ang mga pangunahing inobasyon ng Fogo ay nakatuon sa multi-lokal na pinagkasunduan, pagganap ng kliyente, at
validator set management, maraming karagdagang extension ng protocol ang isinasaalang-alang
para sa alinman sa simula o pagpapatupad pagkatapos ng paglunsad. Ang mga tampok na ito ay higit na magpapahusay
network functionality habang pinapanatili ang pabalik na compatibility sa Solana
ecosystem.

6.1 Pagbabayad ng Bayad sa Token ng SPL
Upang paganahin ang mas malawak na access sa network at pagbutihin ang karanasan ng user, ang Fogo ay posibleng
magpakilala ng fee_payer_unsigned na uri ng transaksyon na nagpapahintulot sa mga transaksyon na maisagawa
walang SOL sa pinagmulang account. Ang feature na ito, na sinamahan ng on-chain fee
programa sa pagbabayad, nagbibigay-daan sa mga user na magbayad ng mga bayarin sa transaksyon gamit ang mga token ng SPL habang
pagpapanatili ng protocol security at validator compensation.
Gumagana ang system sa labas ng protocol na walang pahintulot na relayer marketplace. Mga gumagamit
bumuo ng mga transaksyon na kinabibilangan ng kanilang mga nilalayong operasyon at isang token ng SPL
pagbabayad upang mabayaran ang nagbabayad ng bayad. Ang mga transaksyong ito ay maaaring wastong lagdaan
nang hindi tinukoy ang isang nagbabayad ng bayad, na nagpapahintulot sa sinumang partido na kumpletuhin ang mga ito sa pamamagitan ng pagdaragdag ng kanilang
lagda at pagbabayad ng mga bayarin sa SOL. Ang mekanismong ito ay epektibong naghihiwalay sa transaksyon
awtorisasyon mula sa pagbabayad ng bayad, na nagbibigay-daan sa mga account na may zero na balanse sa SOL na makipag-ugnayan
ang network hangga't nagtataglay sila ng iba pang mahahalagang asset.
Ang tampok na ito ay ipinatupad sa pamamagitan ng kaunting mga pagbabago sa protocol, na nangangailangan lamang ng
pagdaragdag ng bagong uri ng transaksyon at isang on-chain na programa upang mahawakan ang relayer
kabayaran. Lumilikha ang system ng isang mahusay na merkado para sa mga serbisyo ng relay ng transaksyon habang
pagpapanatili ng mga katangian ng seguridad ng pinagbabatayan na protocol. Hindi tulad ng mas kumplikadong bayad
abstraction system, ang pamamaraang ito ay hindi nangangailangan ng mga pagbabago sa mga mekanismo ng pagbabayad ng validator
o mga tuntuning pinagkasunduan.

7. Konklusyon
Ang Fogo ay kumakatawan sa isang nobelang diskarte sa arkitektura ng blockchain na humahamon sa tradisyonal
mga pagpapalagay tungkol sa kaugnayan sa pagitan ng pagganap, desentralisasyon, at seguridad.
Sa pamamagitan ng pagsasama-sama ng mataas na pagganap ng pagpapatupad ng kliyente sa dynamic na multi-local
consensus at curated validator set, ang protocol ay nakakamit ng hindi pa nagagawang pagganap
nang hindi nakompromiso ang mga pangunahing katangian ng seguridad ng mga proof-of-stake system. Ang
kakayahang dynamic na ilipat ang pinagkasunduan habang pinapanatili ang heograpikal na pagkakaiba-iba ay nagbibigay
parehong pag-optimize ng pagganap at sistematikong katatagan, habang ang pagbagsak ng protocol
Tinitiyak ng mga mekanismo ang patuloy na operasyon sa ilalim ng masamang kondisyon.
Sa pamamagitan ng maingat na disenyong pang-ekonomiya, natural na lumalabas ang mga mekanismong ito mula sa validator
mga insentibo sa halip na sa pamamagitan ng pagpapatupad ng protocol, na lumilikha ng matatag at madaling ibagay
sistema. Habang patuloy na umuunlad ang teknolohiya ng blockchain, ipinapakita ang mga inobasyon ng Fogo
kung paano maaaring itulak ng maalalahanin na disenyo ng protocol ang mga hangganan ng pagganap habang
pagpapanatili ng mga katangian ng seguridad at desentralisasyon na gumagawa ng mga network ng blockchain
mahalaga.
`

// Ukrainian
const UKRAINIAN_TEXT = `
Fogo: Високопродуктивний SVM рівня 1
Версія 1.0

Анотація
У цій статті представлено Fogo, новий протокол блокчейну рівня 1, який забезпечує проривну
продуктивність у пропускній здатності, затримці та управлінні перевантаженнями. Як розширення протоколу Solana, Fogo підтримує повну сумісність на рівні виконання SVM, що дозволяє
існуючим програмам, інструментам та інфраструктурі Solana безперешкодно мігрувати, одночасно
досягаючи значно вищої продуктивності та меншої затримки.
Fogo пропонує три новітні розробки:
● Уніфікована клієнтська реалізація на основі чистого Firedancer, що розблоковує рівні продуктивності,
недосяжні мережам з повільнішими клієнтами, включаючи саму Solana.
● Багатолокальний консенсус з динамічним колокацією, що забезпечує час блокування та затримки,
значно нижчі за показники будь-якого основного блокчейну.
● Кураторський набір валідаторів, який стимулює високу продуктивність та стримує хижацьку
поведінку на рівні валідатора.
Ці інновації забезпечують значне підвищення продуктивності, зберігаючи
децентралізацію та надійність, необхідні для блокчейну рівня 1.

1. Вступ
Блокчейн-мережі постійно стикаються з проблемою балансування продуктивності з
децентралізацією та безпекою. Сучасні блокчейни мають серйозні обмеження пропускної здатності,
що робить їх непридатними для глобальної фінансової діяльності. Ethereum обробляє менше 50
транзакцій за секунду (TPS) на своєму базовому рівні. Навіть найбільш централізовані рівні 2 обробляють
менше 1000 TPS. Хоча Solana була розроблена для вищої продуктивності, обмеження, пов'язані з
різноманітністю клієнтів, наразі призводять до перевантаження на рівні 5000 TPS. На противагу цьому, традиційні фінансові
системи, такі як NASDAQ, CME та Eurex, регулярно обробляють понад 100 000 операцій за
секунду.

Затримка є ще одним критичним обмеженням для децентралізованих блокчейн-протоколів. На
фінансових ринках, особливо для визначення цін на волатильні активи, низька затримка є
важливою для якості та ліквідності ринку. Традиційні учасники ринку працюють з
наскрізними затримками на рівні мілісекунд або субмілісекунд. Ці швидкості досягаються лише тоді, коли учасники ринку можуть спільно використовувати середовище виконання через
обмеження швидкості світла.
Традиційні архітектури блокчейну використовують глобально розподілені набори валідаторів, які працюють
без географічної обізнаності, створюючи фундаментальні обмеження продуктивності. Самому світлу
потрібно понад 130 мілісекунд, щоб облетіти земну кулю на екваторі, навіть подорожуючи по
ідеальному колу, а реальні мережеві шляхи передбачають додаткові затримки, пов'язані з відстанню та інфраструктурою.
Ці фізичні обмеження посилюються, коли консенсус вимагає кількох
раундів зв'язку між валідаторами. Ці міжрегіональні затримки посилюються,
коли консенсус вимагає кількох раундів зв'язку між валідаторами. Як результат,
мережі повинні впроваджувати консервативні часи блокування та затримки остаточності для підтримки
стабільності. Навіть за оптимальних умов глобально розподілений механізм консенсусу
не може подолати ці основні мережеві затримки.
У міру подальшої інтеграції блокчейнів з глобальною фінансовою системою, користувачі вимагатимуть
продуктивності, порівнянної з сучасними централізованими системами. Без ретельного проектування, задоволення
цих вимог може значно поставити під загрозу децентралізацію та
стійкість блокчейн-мереж. Щоб вирішити цю проблему, ми пропонуємо блокчейн першого рівня Fogo. Основна філософія Fogo полягає в максимізації пропускної здатності та мінімізації затримки за допомогою двох ключових підходів: по-перше, використання найпродуктивнішого клієнтського програмного забезпечення на оптимально децентралізованому наборі валідаторів; та по-друге, використання спільного консенсусу, зберігаючи при цьому більшість переваг децентралізації глобального консенсусу.

2. План
Стаття поділена на розділи, що охоплюють основні рішення щодо проектування Fogo.
У розділі 3 розглядається зв'язок Fogo з блокчейн-протоколом Solana та його стратегія щодо оптимізації та різноманітності клієнтів. У розділі 4 розглядається багатолокальний консенсус, його практична реалізація та компроміси, які він робить відносно глобального або
локального консенсусу. У розділі 5 розглядається підхід Fogo до ініціалізації та підтримки набору валідаторів. У розділі 6 розглядаються потенційні розширення, які можуть бути введені після
створення.

3. Протокол і клієнти
На базовому рівні Fogo починає з розробки на основі найпродуктивнішого широко використовуваного
протоколу блокчейну на сьогоднішній день, Solana. Мережа Solana вже постачається з численними
рішеннями для оптимізації, як з точки зору розробки протоколів, так і реалізації клієнтів. Fogo
прагне максимально можливої зворотної сумісності з Solana, включаючи повну
сумісність на рівні виконання SVM та тісну сумісність з консенсусом TowerBFT, поширенням блоків Turbine, ротацією лідерів Solana та всіма іншими основними
компонентами мережевого та консенсусного рівнів. Ця сумісність дозволяє Fogo
легко інтегрувати та розгортати існуючі програми, інструменти та інфраструктуру з екосистеми Solana; а також отримувати вигоду від постійних удосконалень Solana.
Однак, на відміну від Solana, Fogo працюватиме з одним канонічним клієнтом. Цей канонічний клієнт
буде найпродуктивнішим основним клієнтом, що працює на Solana. Це дозволяє Fogo
досягти значно вищої продуктивності, оскільки мережа завжди працюватиме на
швидкості найшвидшого клієнта. Тоді як Solana, обмежена різноманітністю клієнтів, завжди буде
вузьким місцем через швидкість найповільнішого клієнта. Наразі та в найближчому майбутньому цей
канонічний клієнт буде базуватися на стеку Firedancer.

3.1 Firedancer
Firedancer – це високопродуктивна реалізація клієнта Jump Crypto, сумісна з Solana,
яка демонструє значно вищу пропускну здатність обробки транзакцій, ніж поточні клієнти валідатора,
завдяки оптимізованій паралельній обробці, управлінню пам'яттю та SIMD-інструкціям.

Існують дві версії: "Frankendancer", гібрид, що використовує процесор Firedancer з
мережевим стеком валідатора Rust, та повна реалізація Firedancer з
повним переписуванням мережевого стеку C, яка зараз знаходиться на пізній стадії розробки.
Обидві версії підтримують сумісність протоколу Solana, максимізуючи при цьому продуктивність.
Після завершення очікується, що чиста реалізація Firedancer встановить нові показники продуктивності,
що зробить її ідеальною для вимог Fogo до високої пропускної здатності. Fogo розпочнеться з
мережі на базі Frankendancer, а потім зрештою перейде до чистого Firedancer.

3.2 Канонічні клієнти проти різноманітності клієнтів
Протоколи блокчейну працюють через клієнтське програмне забезпечення, яке реалізує їхні правила та
специфікації. Хоча протоколи визначають правила роботи мережі, клієнти перетворюють
ці специфікації на виконуване програмне забезпечення. Зв'язок між протоколами та
клієнтами історично дотримувався різних моделей, причому деякі мережі активно сприяли
різноманітності клієнтів, тоді як інші природно сходяться до канонічних реалізацій.
Різноманітність клієнтів традиційно служить кільком цілям: вона забезпечує надлишковість
реалізації, дозволяє незалежну перевірку правил протоколу та теоретично знижує
ризик вразливостей програмного забезпечення в масштабах всієї мережі. Мережа Bitcoin демонструє
цікавий прецедент - хоча існує кілька реалізацій клієнтів, Bitcoin Core служить
фактично канонічним клієнтом, забезпечуючи еталонну реалізацію, яка визначає
практичну поведінку мережі.
Однак у високопродуктивних блокчейн-мережах зв'язок між протоколом
та реалізацією клієнта стає більш обмеженим. Коли протокол наближається до
фізичних меж обчислювального та мережевого обладнання, простір для різноманітності
реалізації природно звужується. На цих межах продуктивності оптимальні реалізації
повинні схилятися до подібних рішень, оскільки вони стикаються з тими ж фізичними обмеженнями та
вимогами до продуктивності. Будь-яке значне відхилення від оптимальних шаблонів реалізації
призведе до погіршення продуктивності, що зробить клієнт непридатним для
роботи валідатора.
Ця динаміка особливо помітна в мережах, що прагнуть мінімально можливих часів блокування та максимальної пропускної здатності транзакцій. У таких системах теоретичні переваги різноманітності клієнтів стають менш актуальними, оскільки накладні витрати на підтримку сумісності між різними реалізаціями клієнтів самі по собі можуть стати вузьким місцем продуктивності. При досягненні фізичних меж продуктивності блокчейну клієнтські реалізації обов'язково будуть використовувати спільні основні архітектурні рішення, що робить переваги безпеки різноманітності реалізації значною мірою теоретичними.

3.3 Стимули протоколу для продуктивних клієнтів
Хоча Fogo дозволяє будь-яку відповідну реалізацію клієнта, його архітектура природно
стимулює використання найпродуктивнішого доступного клієнта, зумовленого практичними вимогами
високопродуктивних спільно розміщених операцій.
На відміну від традиційних мереж, де географічна відстань створює основні вузькі місця,
колокаційний дизайн Fogo означає, що ефективність реалізації клієнта безпосередньо визначає
продуктивність валідатора. У цьому середовищі затримка мережі мінімальна, що робить швидкість клієнта
критичним фактором.
Динамічні параметри часу та розміру блоку мережі створюють економічний тиск для
максимізації пропускної здатності. Валідатори повинні вибирати між використанням найшвидшого клієнта або ризиком
штрафів та зменшенням доходу. Ті, хто використовує повільніші клієнти, або ризикують пропустити блоки,
голосуючи за агресивні параметри, або втрачають дохід, голосуючи за консервативні.
Це створює природний відбір для найефективнішої реалізації клієнта. У спільно розміщеному середовищі Fogo
навіть невеликі відмінності в продуктивності стають значними -
трохи повільніший клієнт постійно працюватиме нижче продуктивності, що призведе до пропущених блоків та
штрафів. Ця оптимізація відбувається через власні інтереси валідатора, а не правила протоколу.
Хоча вибір клієнта не може бути безпосередньо забезпечений протоколом, економічний тиск природним чином
стимулює мережу до найефективнішого впровадження, зберігаючи конкурентний
розвиток клієнтів.

4. Мультилокальний консенсус
Мультилокальний консенсус являє собою новий підхід до консенсусу блокчейну, який
динамічно балансує переваги продуктивності спільного розташування валідатора з перевагами безпеки
географічного розподілу. Система дозволяє валідаторам координувати своє
фізичне розташування протягом епох, зберігаючи при цьому різні криптографічні ідентичності для
різних зон, що дозволяє мережі досягати консенсусу з наднизькою затримкою під час
нормальної роботи, зберігаючи при цьому можливість повертатися до глобального консенсусу, коли
це необхідно.
Модель мультилокального консенсусу Fogo черпає натхнення з усталених практик на
традиційних фінансових ринках, зокрема з торгової моделі «слідуй за сонцем», яка використовується на валютному
валютному та інших світових ринках. У традиційних фінансах маркетмейкерство та забезпечення ліквідності
природно мігрують між основними фінансовими центрами в міру проходження торгового дня
– від Азії до Європи та Північної Америки – що дозволяє безперервну роботу ринку, одночасно
підтримуючи концентровану ліквідність у певних географічних регіонах. Ця модель довела свою ефективність у традиційних фінансах, оскільки вона визнає, що хоча ринки є глобальними, фізичні обмеження мережі та час реакції людини роблять певний ступінь географічної концентрації необхідним для оптимального визначення цін та ефективності ринку.

4.1 Зони та ротація зон
Зона являє собою географічну область, де валідатори спільно розміщуються для досягнення оптимальної
консенсусної продуктивності. В ідеалі зона – це єдиний центр обробки даних, де затримка мережі
між валідаторами наближається до апаратних меж. Однак зони можуть розширюватися,
охоплюючи більші регіони, коли це необхідно, жертвуючи деякою продуктивністю заради практичних
міркувань. Точне визначення зони виникає завдяки соціальному консенсусу серед
валідаторів, а не суворо визначеному в протоколі. Ця гнучкість дозволяє
мережі адаптуватися до реальних обмежень інфраструктури, зберігаючи при цьому цілі продуктивності.

Здатність мережі чергуватися між зонами служить кільком критичним цілям:
1. Юрисдикційна децентралізація: регулярна ротація зон запобігає досягненню
консенсусу будь-якою окремою юрисдикцією. Це підтримує стійкість мережі до
регуляторного тиску та гарантує, що жоден окремий уряд чи орган влади не зможе здійснювати
довгостроковий контроль над роботою мережі.
2. Стійкість інфраструктури: Центри обробки даних та регіональна інфраструктура можуть вийти з ладу з
численних причин – стихійних лих, відключень електроенергії, проблем з мережею, збоїв обладнання
або вимог до технічного обслуговування. Ротація зон гарантує, що мережа не буде
постійно залежною від жодної єдиної точки відмови. Історичні приклади великих
відключень центрів обробки даних, таких як ті, що спричинені суворими погодними явищами або збоями в електромережі, демонструють важливість цієї гнучкості.
3. Стратегічна оптимізація продуктивності: Зони можна вибрати для оптимізації для
конкретної діяльності мережі. Наприклад, під час епох, що містять значні
фінансові події (такі як оголошення Федеральної резервної системи, важливі економічні
звіти або відкриття ринку), валідатори можуть вирішити знайти консенсус поблизу
джерела цієї цінової інформації. Ця можливість дозволяє мережі
мінімізувати затримку для критичних операцій, зберігаючи гнучкість для різних випадків використання
в різні епохи.

4.2 Керування ключами
Протокол реалізує дворівневу систему керування ключами, яка відокремлює довгострокову
ідентичність валідатора від участі в консенсусі, специфічної для зони. Кожен валідатор підтримує
глобальну пару ключів, яка служить його кореневою ідентифікатором у мережі. Цей глобальний ключ використовується для
високорівневих операцій, таких як делегування частки, реєстрація зони та участь у
глобальному консенсусі. Глобальний ключ повинен бути захищений з найвищими можливими заходами безпеки,
оскільки він представляє кінцевий авторитет валідатора в мережі.

Валідатори можуть делегувати повноваження специфічним для зони підключам через програму реєстру в мережі.
Ці підключі спеціально авторизовані для участі в консенсусі
в межах визначених зон спільного розташування. Таке розділення служить кільком цілям безпеки: воно
дозволяє валідаторам підтримувати різні моделі безпеки для різних типів ключів, мінімізує
розкриття глобальних ключів, зберігаючи їх онлайн під час нормальної роботи, та
зменшує ризик компрометації ключів під час переходів фізичної інфраструктури між
зонами.
Делегування специфічних для зони ключів керується за допомогою програми в мережі, яка
веде реєстр авторизованих зональних ключів для кожного валідатора. Хоча валідатори можуть
реєструвати нові зональні ключі в будь-який час, використовуючи свій глобальний ключ, ці реєстрації набувають
чинності лише на межах епох. Ця затримка гарантує, що всі учасники мережі матимуть час
перевірити та записати нові делегування ключів, перш ніж вони стануть активними на основі консенсусу.

4.3 Пропозиція та активація зони
Нові зони можуть бути запропоновані за допомогою механізму управління в мережі, використовуючи глобальні
ключі. Однак, щоб забезпечити стабільність мережі та надати валідаторам достатньо часу для підготовки
безпечної інфраструктури, запропоновані зони мають обов'язковий період затримки, перш ніж вони стануть
придатними для вибору. Ця затримка, встановлена як параметр протоколу, має бути достатньо довгою, щоб
дозволити валідаторам:
● Захист відповідної фізичної інфраструктури в новій зоні
● Встановлення безпечних систем керування ключами для нового місця розташування
● Налаштування та тестування мережевої інфраструктури
● Виконання необхідних аудитів безпеки нового об'єкта
● Встановлення процедур резервного копіювання та відновлення
Період затримки також служить заходом безпеки проти потенційних атак, коли
зловмисник може спробувати примусово встановити консенсус у зоні, де він має
інфраструктурні переваги. Вимагаючи попереднього повідомлення про нові зони, протокол
гарантує, що всі валідатори мають справедливу можливість встановити присутність у будь-якій зоні, яка
може бути обрана для консенсусу.
Тільки після того, як зона завершить цей період очікування, її можна вибрати через звичайний
процес голосування за зону для майбутніх епох. Такий ретельний підхід до активації зони допомагає
підтримувати безпеку та стабільність мережі, водночас дозволяючи додавати нові стратегічні
розташування в міру розвитку вимог мережі.

4.4 Процес голосування за вибір зони
Вибір консенсусних зон відбувається за допомогою механізму голосування в мережі, який
збалансовує необхідність скоординованого переміщення валідатора з безпекою мережі. Валідатори
повинні досягти кворуму в зоні колокації кожної майбутньої епохи протягом налаштованого
часу кворуму до переходу епохи. На практиці графік епох може бути
визначений з певним завчасним виконанням, таким чином, що голосування протягом епохи n вибирає зону для
епохи n + k. Голоси подаються через програму реєстру в мережі з використанням глобальних
ключів валідаторів, причому право голосу зважується за часткою. Цей процес використовує глобальні ключі, а не ключі зони,
оскільки він не чутливий до затримки та вимагає максимальної безпеки.
Процес голосування вимагає переважної більшості ваги частки для встановлення кворуму, що гарантує,
що невелика група валідаторів не може односторонньо примусово змінити зону. Якщо валідаторам не вдається
досягти кворуму протягом визначеного часу, мережа автоматично переходить до
режиму глобального консенсусу для наступної епохи. Цей резервний механізм забезпечує безперервність мережі
навіть коли валідатори не можуть домовитися про зону колокації.
Під час періоду голосування валідатори сигналізують як про свою бажану зону для наступної епохи,
так і про цільовий час блокування для цієї зони. Такий спільний вибір параметрів розташування та продуктивності дозволяє мережі оптимізувати як фізичні обмеження, так і можливості продуктивності кожної зони. Важливо, що період голосування надає валідаторам час для підготовки інфраструктури у вибраній зоні, включаючи розігрів специфічних для зони ключів та тестування мережевого з'єднання. Цей період підготовки має вирішальне значення для підтримки стабільності мережі під час переходів між зонами.

4.5 Режим глобального консенсусу
Режим глобального консенсусу служить як резервним механізмом, так і фундаментальною функцією безпеки
протоколу. Хоча Fogo досягає найвищої продуктивності завдяки зонному
консенсусу, можливість повернення до глобального консенсусу забезпечує безперервну роботу мережі
за несприятливих умов. У режимі глобального консенсусу мережа працює з
консервативними параметрами, оптимізованими для глобально розподіленої валідації: фіксований час блокування 400 мс
та зменшений розмір блоку для врахування вищих затримок мережі між
географічно розподіленими валідаторами.
Протокол переходить у режим глобального консенсусу двома основними шляхами:
● Невдалий вибір зони: Якщо валідатори не досягають кворуму в консенсусній зоні наступної епохи
в межах визначеного періоду голосування, мережа автоматично
за замовчуванням переходить до глобального консенсусу для цієї епохи.
● Помилка консенсусу під час виконання: Якщо поточна зона не досягає завершеності блоку в межах
визначеного періоду очікування протягом епохи, протокол негайно перемикається
в режим глобального консенсусу на решту цієї епохи. Цей резервний режим є «липким» –
після спрацьовування в середині епохи мережа залишається в глобальному консенсусі до наступного
переходу епохи, надаючи пріоритет стабільності над відновленням продуктивності.
У режимі глобального консенсусу валідатори беруть участь, використовуючи призначений ключ для глобальної
операції, який може бути або не бути одним із їхніх ключів, специфічних для зони, і мережа
підтримує ті ж правила вибору розгалуження, що й консенсус на основі зони. Хоча цей режим жертвує
наднизькою затримкою, досяжною в спільно розташованих зонах, він забезпечує надійну основу для
безперервності мережі та демонструє, як Fogo підтримує безпеку, не жертвуючи
життєздатністю в умовах погіршення.

5. Набір валідаторів
Для досягнення високої продуктивності та зменшення зловживань у MEV Fogo використовуватиме
кураторський набір валідаторів. Це необхідно, оскільки навіть невелика частина недостатньо забезпечених
вузлів для перевірки може перешкодити мережі досягти своїх фізичних меж продуктивності.
Спочатку кураторство працюватиме через підтвердження авторизації, перш ніж перейти до прямого
дозволу набором валідаторів. Розміщуючи повноваження кураторів разом із набором валідаторів,
Fogo може запровадити покарання на соціальному рівні за зловживальну поведінку, як традиційна
система підтвердження авторитету, але таким чином, щоб це не було більш централізовано, ніж потужність форку,
яка вже має 2/3 частки в традиційних мережах PoS, таких як Solana.

5.1 Розмір та початкова конфігурація
Fogo підтримує набір валідаторів з дозволом та мінімальною та максимальною кількістю валідаторів, що встановлюються протоколом, щоб забезпечити достатню децентралізацію та оптимізувати
продуктивність мережі. Початковий цільовий розмір становитиме приблизно 20-50 валідаторів, хоча
це обмеження реалізовано як параметр протоколу, який можна коригувати в міру розвитку мережі.
На початку розробки початковий набір валідаторів буде обраний органом генезису, який
збереже тимчасові дозволи на керування складом набору валідаторів на ранніх стадіях
розвитку мережі.

5.2 Управління та переходи
Контроль органу генезису над членством у наборі валідаторів призначений для
тимчасового характеру. Після початкового періоду стабілізації мережі цей набір валідаторів перейде до
самого набору валідаторів. Після цього переходу зміни до членства в наборі валідаторів
вимагатимуть двотретєної більшості заставлених токенів, що відповідає тому ж порогу,
необхідному для змін на рівні протоколу в мережах Proof-of-Stake.
Щоб запобігти раптовим змінам, які можуть дестабілізувати мережу, параметри протоколу обмежують
швидкість обороту валідаторів. Не більше фіксованого відсотка набору валідаторів може бути
замінено або вилучено протягом заданого періоду часу, де цей відсоток є налаштованим параметром протоколу.
Це забезпечує поступову еволюцію набору валідаторів, зберігаючи при цьому
стабільність мережі.

5.3 Вимоги до участі
Валідатори повинні відповідати мінімальним вимогам до делегованої частки, щоб мати право на участь у наборі валідаторів, підтримуючи сумісність з економічною моделлю Solana, додаючи
компонент дозволу. Ця подвійна вимога – достатня частка та схвалення набору –
гарантує, що валідатори мають як економічну частку в грі, так і операційні
можливості для підтримки продуктивності мережі.
5.4 Обґрунтування та управління мережею
Набір валідаторів з дозволом суттєво не впливає на децентралізацію мережі, оскільки в будь-якій мережі типу Proof-of-Stake, дві третини учасників вже можуть вносити довільні зміни до протоколу через розгалуження. Натомість, цей механізм забезпечує формальну основу для набору валідаторів, щоб забезпечити корисну поведінку мережі, яку в іншому випадку було б важко закодувати в правилах протоколу.
Наприклад, можливість вилучати валідатори дозволяє мережі реагувати на:
● Постійні проблеми з продуктивністю, які погіршують можливості мережі
● Зловживальне вилучення MEV, яке шкодить зручності використання мережі
● Дестабілізуючу поведінку мережі, яку неможливо безпосередньо реалізувати в протоколі, таку як
вилучення, але не пересилання блоків Turbine
● Інші моделі поведінки, які, хоча й потенційно вигідні для окремих валідаторів, шкодять довгостроковій цінності мережі
Цей механізм управління визнає, що хоча певна поведінка може бути вигідною в короткостроковій перспективі, вона може зашкодити довгостроковій життєздатності мережі. Завдяки можливості контролю за такою поведінкою набору валідаторів, зважених за часткою, шляхом контролю членства, Fogo узгоджує стимули валідаторів із довгостроковим станом мережі, не ставлячи під загрозу фундаментальні властивості децентралізації, властиві системам Proof-of-Stake.

6. Перспективні розширення
Хоча основні інновації Fogo зосереджені на багатолокальному консенсусі, продуктивності клієнтів та
керуванні набором валідаторів, розглядається кілька додаткових розширень протоколу
для розробки або після запуску. Ці функції ще більше покращать
функціональність мережі, зберігаючи при цьому зворотну сумісність з екосистемою Solana.

6.1 Оплата комісії за токен SPL
Щоб забезпечити ширший доступ до мережі та покращити взаємодію з користувачами, Fogo потенційно
введе тип транзакції fee_payer_unsigned, який дозволяє виконувати транзакції
без SOL у вихідному обліковому записі. Ця функція, у поєднанні з програмою оплати комісій у мережі,
дозволяє користувачам сплачувати комісії за транзакції за допомогою токенів SPL,
зберігаючи при цьому безпеку протоколу та компенсацію валідаторам.
Система працює через позапротокольний ринок ретрансляторів без дозволів. Користувачі
створюють транзакції, що включають як передбачувані операції, так і оплату токеном SPL
для компенсації кінцевому платнику комісії. Ці транзакції можуть бути валідно підписані
без зазначення платника комісії, що дозволяє будь-якій стороні завершити їх, додавши свій
підпис та сплативши комісії SOL. Цей механізм ефективно відокремлює авторизацію транзакції
від оплати комісії, дозволяючи обліковим записам з нульовим балансом SOL взаємодіяти з
мережею, якщо вони володіють іншими цінними активами.
Ця функція реалізована за допомогою мінімальних модифікацій протоколу, що вимагає лише
додавання нового типу транзакції та програми в ланцюзі для обробки компенсації ретранслятору.
Система створює ефективний ринок для послуг ретрансляції транзакцій, зберігаючи при цьому
властивості безпеки базового протоколу. На відміну від складніших систем
абстракції комісії, цей підхід не вимагає змін у механізмах оплати валідаторами
або правилах консенсусу.

7. Висновок
Fogo представляє новий підхід до архітектури блокчейну, який ставить під сумнів традиційні
припущення щодо взаємозв'язку між продуктивністю, децентралізацією та безпекою.
Поєднуючи високопродуктивну клієнтську реалізацію з динамічним багатолокальним консенсусом та курованими наборами валідаторів, протокол досягає безпрецедентної продуктивності
без шкоди для фундаментальних властивостей безпеки систем Proof-of-Stake.
Здатність динамічно переміщувати консенсус, зберігаючи географічну різноманітність, забезпечує
як оптимізацію продуктивності, так і системну стійкість, тоді як резервні механізми протоколу
забезпечують безперервну роботу за несприятливих умов.
Завдяки ретельному економічному проекту ці механізми виникають природним чином зі стимулів валідаторів,
а не через забезпечення дотримання протоколу, створюючи надійну та адаптовану
систему. Оскільки технологія блокчейн продовжує розвиватися, інновації Fogo демонструють,
як продуманий дизайн протоколів може розширити межі продуктивності, зберігаючи при цьому
властивості безпеки та децентралізації, які роблять блокчейн-мережі
цінними.
`

// Portuguese
const PORTUGUESE_TEXT = `
Fogo: Uma Camada 1 de SVM de Alto Desempenho
Versão 1.0

Resumo
Este artigo apresenta o Fogo, um novo protocolo blockchain de nível 1 que oferece um desempenho inovador
em débito, latência e gestão de congestionamento. Como extensão do
protocolo Solana, o Fogo mantém total compatibilidade na camada de execução do SVM, permitindo
que os programas, ferramentas e infraestruturas Solana existentes migrem perfeitamente,
alcançando um desempenho significativamente maior e menor latência.
O Fogo contribui com três inovações:
● Uma implementação de cliente unificada baseada em Firedancer puro, desbloqueando os níveis de desempenho
inatingíveis por redes com clientes mais lentos — incluindo a própria Solana.
● Consenso multilocal com colocation dinâmico, alcançando tempos de bloco e latências
muito abaixo dos de qualquer blockchain importante.
● Um conjunto de validadores curado que incentiva o alto desempenho e impede o comportamento
predatório ao nível do validador.
Estas inovações proporcionam ganhos substanciais de desempenho, preservando a
descentralização e a robustez essenciais para uma blockchain de nível 1.

1. Introdução
As redes blockchain enfrentam um desafio contínuo para equilibrar o desempenho com
descentralização e segurança. As blockchains atuais sofrem severas limitações de débito
que as tornam inadequadas para as atividades financeiras globais. O Ethereum processa menos de 50
transações por segundo (TPS) na sua camada base. Mesmo as camadas 2 mais centradas lidam com
menos de 1.000 TPS. Embora a Solana tenha sido concebida para um maior desempenho, as limitações da
diversidade de clientes causam atualmente congestionamento a 5.000 TPS. Em contraste, os sistemas financeiros tradicionais
como a NASDAQ, a CME e a Eurex processam regularmente mais de 100.000 operações por
segundo.
A latência representa outra limitação crítica para os protocolos blockchain descentralizados. Nos
mercados financeiros — especialmente para a descoberta de preços de ativos voláteis — a baixa latência é
essencial para a qualidade e liquidez do mercado. Os participantes tradicionais do mercado operam com latências de ponta a ponta em escalas de milissegundos ou submilissegundos. Estas velocidades só são
alcançáveis quando os participantes do mercado se podem localizar no ambiente de execução devido às restrições da velocidade da luz.
As arquiteturas blockchain tradicionais utilizam conjuntos de validadores distribuídos globalmente que operam
sem consciência geográfica, criando limitações fundamentais de desempenho. A própria luz
demora mais de 130 milissegundos a circum-navegar o globo na linha do Equador, mesmo viajando num
círculo perfeito — e os caminhos de rede do mundo real envolvem distância adicional e atrasos
de infraestruturas. Estas limitações físicas agravam-se quando o consenso exige múltiplas rondas de comunicação entre os validadores. Estas latências inter-regionais agravam-se
quando o consenso exige múltiplas rondas de comunicação entre validadores. Como resultado,
as redes devem implementar tempos de bloco conservadores e atrasos de finalização para manter a
estabilidade. Mesmo em condições ideais, um mecanismo de consenso distribuído globalmente
não consegue ultrapassar estes atrasos básicos de rede.
À medida que as blockchains se integram ainda mais no sistema financeiro global, os utilizadores exigirão
desempenho comparável ao dos sistemas centralizados atuais. Sem um design cuidadoso, a satisfação destas exigências pode comprometer significativamente a descentralização e a resiliência das redes blockchain. Para fazer face a este desafio, propomos a blockchain Fogo de camada um. A filosofia central da Fogo é maximizar a taxa de transferência e minimizar a latência através de duas abordagens principais: em primeiro lugar, utilizar o software cliente com melhor desempenho num conjunto de validadores descentralizado de forma otimizada; e, em segundo lugar, adoptar o consenso colocalizado, preservando a maioria dos benefícios da descentralização do consenso global.

2. Resumo
O artigo está dividido em secções que abrangem as principais decisões de design em torno da Fogo.
A Secção 3 aborda a relação da Fogo com o protocolo blockchain Solana e a sua estratégia em relação à otimização e diversidade de clientes. A Secção 4 aborda o consenso multilocal, a sua implementação prática e as negociações que faz em relação ao consenso global ou local. A Secção 5 aborda a abordagem da Fogo para inicializar e manter o conjunto de validadores. A Secção 6 aborda as extensões prospetivas que podem ser introduzidas após a génese.

3. Protocolo e Clientes
Numa camada base, a Fogo começa por construir sobre o protocolo blockchain de maior desempenho e amplamente utilizado até à data, o Solana. A rede Solana conta já com inúmeras soluções de otimização, tanto em termos de design de protocolos como de implementações de clientes. A Fogo visa a máxima compatibilidade retroativa possível com Solana, incluindo compatibilidade total na camada de execução SVM e estreita compatibilidade com o consenso TowerBFT, propagação de blocos Turbine, rotação de líderes Solana e todos os outros principais componentes das camadas de rede e consenso. Esta compatibilidade permite à Fogo integrar e implementar facilmente programas, ferramentas e infraestruturas existentes do ecossistema Solana, além de beneficiar de melhorias contínuas no upstream da Solana.
No entanto, ao contrário da Solana, a Fogo será executada com um único cliente canónico. Este cliente canónico será o cliente principal com maior desempenho em execução na Solana. Isto permite que a Fogo alcance um desempenho significativamente maior, uma vez que a rede funcionará sempre à velocidade do cliente mais rápida. Enquanto Solana, limitada pela diversidade de clientes, será sempre
gargalada pela velocidade do cliente mais lento. Por enquanto e num futuro próximo, este
cliente canónico será baseado na pilha Firedancer.

3.1 Firedancer
Firedancer é a implementação de cliente de alto desempenho compatível com Solana da Jump Crypto,
apresentando uma taxa de transferência de transações substancialmente mais elevada do que os atuais clientes validadores
através de processamento paralelo otimizado, gestão de memória e instruções SIMD.
Existem duas versões: "Frankendancer", um híbrido que utiliza o motor de processamento do Firedancer com
a pilha de rede do validador Rust, e a implementação completa do Firedancer com uma
reescrita completa da pilha de rede C, atualmente em fase avançada de desenvolvimento.
Ambas as versões mantêm a compatibilidade do protocolo Solana, ao mesmo tempo que maximizam o desempenho.
Uma vez concluída, espera-se que a implementação pura do Firedancer defina novos benchmarks de desempenho,
tornando-a ideal para os requisitos de elevada taxa de transferência do Fogo. O Fogo começará com
uma rede baseada em Frankendancer e, eventualmente, fará a transição para o Firedancer puro.

3.2 Clientes Canónicos vs. Diversidade de Clientes
Os protocolos blockchain operam através de software cliente que implementa as suas regras e especificações. Enquanto os protocolos definem as regras de funcionamento da rede, os clientes traduzem estas especificações em software executável. A relação entre protocolos e clientes segue historicamente modelos diferentes, com algumas redes a promoverem ativamente a diversidade de clientes, enquanto outras convergem naturalmente para implementações canónicas. A diversidade de clientes serve tradicionalmente múltiplos propósitos: fornece redundância de implementação, permite a verificação independente das regras do protocolo e, teoricamente, reduz o risco de vulnerabilidades de software em toda a rede. A rede Bitcoin demonstra um precedente interessante: embora existam múltiplas implementações de clientes, o Bitcoin Core serve como o cliente canónico de facto, fornecendo a implementação de referência que define o comportamento prático da rede. No entanto, nas redes blockchain de alto desempenho, a relação entre o protocolo e a implementação do cliente torna-se mais restrita. Quando um protocolo se aproxima dos limites físicos do hardware de computação e de rede, o espaço para a diversidade de implementação contrai-se naturalmente. Nestes limites de desempenho, as implementações ideais
devem convergir para soluções semelhantes, dado que enfrentam as mesmas limitações físicas e
requisitos de desempenho. Qualquer desvio significativo dos padrões de implementação ideais
resultaria num desempenho degradado, tornando o cliente inviável para
a operação do validador.
Esta dinâmica é particularmente visível em redes que visam tempos de bloco mínimos possíveis
e taxa de transferência máxima de transações. Em tais sistemas, os benefícios teóricos da
diversidade de clientes tornam-se menos relevantes, pois a sobrecarga de manter a compatibilidade entre
diferentes implementações de clientes pode, por si só, tornar-se um estrangulamento de desempenho. Ao
levar o desempenho da blockchain aos limites físicos, as implementações dos clientes necessariamente
partilharão decisões arquitetónicas essenciais, tornando os benefícios de segurança da diversidade de implementações
em grande parte teóricos.

3.3 Incentivos de Protocolo para Clientes de Alto Desempenho
Embora o Fogo permita qualquer implementação de cliente em conformidade, a sua arquitetura naturalmente
incentiva a utilização do cliente de maior desempenho disponível, impulsionado pelas exigências práticas
de operações co-localizadas de alto desempenho.
Ao contrário das redes tradicionais, onde a distância geográfica cria os principais estrangulamentos,
o design co-localizado do Fogo significa que a eficiência da implementação do cliente determina diretamente
o desempenho do validador. Neste ambiente, a latência da rede é mínima, tornando a
velocidade do cliente o fator crítico.
Os parâmetros dinâmicos de tempo e tamanho de bloco da rede criam pressão económica para
maximizar a taxa de transferência. Os validadores devem escolher entre utilizar o cliente mais rapidamente ou arriscar
penalizações e redução de receita. Aqueles que executam clientes mais lentos correm o risco de perder blocos
votar por parâmetros agressivos ou perder receitas votando por parâmetros conservadores.
Isto cria uma seleção natural para a implementação de clientes mais eficiente. No ambiente co-localizado do Fogo,
mesmo pequenas diferenças de desempenho se tornam significativas - um
cliente ligeiramente mais lento terá um desempenho consistentemente inferior, levando à perda de blocos e
penalidades. Esta otimização ocorre por interesse próprio do validador, e não por regras de protocolo.
Embora a escolha do cliente não possa ser imposta directamente pelo protocolo, as pressões económicas naturalmente
direcionam a rede para a implementação mais eficiente, mantendo o desenvolvimento competitivo
do cliente.

4. Consenso Multilocal
O consenso multilocal representa uma nova abordagem ao consenso em blockchain que
equilibra dinamicamente os benefícios de desempenho da co-localização do validador com as vantagens de segurança
da distribuição geográfica. O sistema permite que os validadores coordenem as suas
localizações físicas ao longo dos períodos, mantendo identidades criptográficas distintas para
diferentes zonas, permitindo que a rede atinja um consenso de latência ultrabaixa durante
a operação normal, preservando a capacidade de regressar ao consenso global quando
necessário.
O modelo de consenso multilocal da Fogo inspira-se em práticas estabelecidas em
mercados financeiros tradicionais, particularmente o modelo de negociação "follow the sun" utilizado no câmbio
e outros mercados globais. Nas finanças tradicionais, a formação de mercado e o fornecimento de liquidez migram naturalmente entre os principais centros financeiros à medida que o dia de negociação avança – da Ásia para a Europa e América do Norte – permitindo a operação contínua do mercado, mantendo a liquidez concentrada em regiões geográficas específicas. Este modelo tem-se mostrado eficaz nas finanças tradicionais porque reconhece que, embora os mercados sejam globais, as limitações físicas da rede e os tempos de reação humana tornam necessário algum grau de concentração geográfica para a descoberta ideal dos preços e a eficiência do mercado.

4.1 Zonas e Rotação de Zonas
Uma zona representa uma área geográfica onde os validadores se co-localizam para alcançar o desempenho ideal de consenso. Idealmente, uma zona é um único centro de dados onde a latência da rede entre validadores se aproxima dos limites de hardware. No entanto, as zonas podem expandir-se para abranger regiões maiores quando necessário, trocando algum desempenho por considerações práticas. A definição exata de uma zona surge através do consenso social entre os validadores, em vez de ser estritamente definida no protocolo. Esta flexibilidade permite que a rede se adapte às restrições de infraestrutura do mundo real, mantendo os objetivos de desempenho. A capacidade da rede de alternar entre zonas serve múltiplos propósitos críticos:
1. Descentralização Jurisdicional: A rotação regular de zonas impede a captura de
consenso por uma única jurisdição. Isto mantém a resistência da rede à
pressão regulatória e garante que nenhum governo ou autoridade pode exercer
controlo a longo prazo sobre a operação da rede.
2. Resiliência da Infraestrutura: Os data centers e a infraestrutura regional podem falhar por
inúmeros motivos - desastres naturais, falhas de energia, problemas de rede, falhas de hardware ou requisitos de manutenção. A rotação de zonas garante que a rede não
fique permanentemente dependente de um único ponto de falha. Exemplos históricos de grandes
interrupções de data centers, como as causadas por eventos climáticos severos ou falhas na rede elétrica,
demonstram a importância desta flexibilidade.
3. Otimização Estratégica do Desempenho: As zonas podem ser selecionadas para otimizar
atividades específicas da rede. Por exemplo, durante períodos que contenham eventos financeiros significativos (como anúncios da Reserva Federal, relatórios económicos importantes ou aberturas de mercado), os validadores podem optar por localizar o consenso perto da fonte desta informação sensível ao preço. Esta capacidade permite que a rede minimize a latência para operações críticas, mantendo a flexibilidade para diferentes casos de utilização em diferentes períodos.

4.2 Gestão de Chaves
O protocolo implementa um sistema de gestão de chaves de duas camadas que separa a identidade do validador a longo prazo da participação por consenso específica da zona. Cada validador mantém um par de chaves globais que serve como a sua identidade raiz na rede. Esta chave global é utilizada para operações de alto nível, como a delegação de participação, o registo de zonas e a participação em consensos globais. A chave global deve ser protegida com as medidas de segurança mais elevadas possíveis, uma vez que representa a autoridade máxima do validador na rede. Os validadores podem então delegar autoridade em subchaves específicas da zona através de um programa de registo on-chain. Estas subchaves são especificamente autorizadas para participação por consenso dentro de zonas de colocation designadas. Esta separação serve vários propósitos de segurança: permite aos validadores manter diferentes modelos de segurança para diferentes tipos de chaves, minimiza a exposição das chaves globais, mantendo-as online durante o funcionamento normal, e reduz o risco de comprometimento das chaves durante as transições de infraestruturas físicas entre zonas. A delegação de chaves específicas de zona é gerida através de um programa on-chain que
mantém um registo das chaves de zona autorizadas para cada validador. Embora os validadores possam
registar novas chaves de zona a qualquer momento utilizando a sua chave global, estes registos só entram
em vigor nos limites de época. Este atraso garante que todos os participantes da rede têm tempo para
verificar e registar novas delegações de chaves antes de se tornarem ativas por consenso.

4.3 Proposta e Ativação de Zonas
Novas zonas podem ser propostas através de um mecanismo de governação on-chain utilizando chaves
globais. No entanto, para garantir a estabilidade da rede e dar aos validadores tempo suficiente para preparar
uma infra-estrutura segura, as zonas propostas têm um período de atraso obrigatório antes de se tornarem
elegíveis para seleção. Este atraso, definido como um parâmetro do protocolo, deve ser suficientemente longo para
permitir que os validadores:
● Protejam a infraestrutura física apropriada na nova zona
● Estabeleçam sistemas de gestão de chaves seguros para o novo local
● Configurem e testem a infraestrutura de rede
● Realizem as auditorias de segurança necessárias da nova instalação
● Estabeleçam procedimentos de cópia de segurança e recuperação
O período de atraso serve também como medida de segurança contra potenciais ataques, onde um
ator malicioso pode tentar forçar o consenso numa zona onde possui
vantagens de infraestrutura. Ao exigir um aviso prévio para novas zonas, o protocolo
garante que todos os validadores têm uma oportunidade justa de estabelecer uma presença em qualquer zona que
possa ser selecionada para consenso.
Só após uma zona concluir este período de espera, poderá ser selecionada através do
processo regular de votação por zona para períodos futuros. Esta abordagem cuidadosa para a ativação de zonas ajuda a
manter a segurança e a estabilidade da rede, permitindo ao mesmo tempo a adição de novos locais estratégicos
à medida que os requisitos da rede evoluem.

4.4 Processo de Votação para Seleção de Zona
A seleção das zonas de consenso ocorre através de um mecanismo de votação on-chain que
equilibra a necessidade de movimentação coordenada dos validadores com a segurança da rede. Os validadores
devem atingir quórum na zona de co-localização de cada época futura dentro de um tempo de quórum configurável
antes da transição de época. Na prática, o horário de época pode ser
determinado com algum tempo de antecedência, de modo a que a votação durante a época n selecione a zona a
a época n + k. Os votos são emitidos através de um programa de registo on-chain utilizando as chaves globais
dos validadores, sendo o poder de voto ponderado pela participação. Este processo utiliza chaves globais em vez de chaves de zona,
pois não é sensível à latência e requer a máxima segurança.
O processo de votação requer uma supermaioria de peso de participação para estabelecer quórum, garantindo
que um pequeno grupo de validadores não possa forçar unilateralmente uma mudança de zona. Se os validadores não conseguirem
atingir quórum dentro do prazo designado, a rede regressa automaticamente ao
modo de consenso global para a próxima época. Este mecanismo de fallback garante a continuidade da rede mesmo quando os validadores não conseguem chegar a acordo sobre uma zona de co-localização.
Durante o período de votação, os validadores sinalizam tanto a sua zona preferida para a próxima época
quanto o seu tempo de bloco alvo para essa zona. Esta seleção conjunta de parâmetros de localização e de desempenho permite à rede otimizar tanto as restrições físicas como as capacidades de desempenho de cada zona. É importante realçar que o período de votação proporciona tempo para os validadores prepararem a infra-estrutura na zona seleccionada, incluindo o aquecimento de chaves específicas da zona e
testar a conectividade da rede. Este período de preparação é crucial para manter a estabilidade da rede durante as transições de zona.

4.5 Modo de Consenso Global
O modo de consenso global serve como mecanismo de fallback e característica de segurança fundamental
do protocolo. Embora o Fogo atinja o seu desempenho máximo através do consenso baseado em zonas, a capacidade de regressar ao consenso global garante o funcionamento contínuo da rede em condições adversas. No modo de consenso global, a rede opera com parâmetros conservadores otimizados para validação distribuída globalmente: um tempo de bloco fixo de 400 ms e um tamanho de bloco reduzido para acomodar latências de rede mais elevadas entre validadores geograficamente dispersos.
O protocolo entra no modo de consenso global através de dois caminhos principais:
● Seleção da Zona com Falha: Se os validadores não conseguirem atingir o quórum na zona de consenso da próxima época dentro do período de votação designado, a rede adota automaticamente o consenso global como padrão para essa época.
● Falha de Consenso em Tempo de Execução: Se a zona atual não atingir o propósito do bloco dentro
do seu tempo limite designado durante uma época, o protocolo alterna imediatamente
para o modo de consenso global durante o resto dessa época. Este fallback é "pegajoso" –
uma vez acionado a meio da época, a rede permanece em consenso global até à próxima
transição de época, dando prioridade à estabilidade em detrimento da recuperação do desempenho.
No modo de consenso global, os validadores participam utilizando uma chave designada para
operação global, que pode ou não ser uma das suas chaves específicas de zona, e a rede
mantém as mesmas regras de escolha de bifurcação que o consenso baseado em zonas. Embora este modo sacrifique
a latência ultrabaixa alcançável em zonas colocalizadas, fornece uma base sólida para
a continuidade da rede e demonstra como o Fogo mantém a segurança sem sacrificar
a disponibilidade em condições degradadas.

5. Conjunto de Validadores
Para alcançar um elevado desempenho e mitigar as práticas abusivas de MEV, o Fogo utilizará um
conjunto de validadores selecionado. Isto é necessário porque mesmo uma pequena fracção de nós de validação subprovisionados pode impedir a rede de atingir os seus limites físicos de desempenho.
Inicialmente, a curadoria operará através de prova de autoridade antes de passar para o
permissão direta pelo conjunto de validadores. Ao atribuir a autoridade de curadoria ao conjunto de validadores,
a Fogo pode impor punições na camada social para comportamentos abusivos como um sistema tradicional de prova de autoridade, mas de uma forma não mais centralizada do que o poder de bifurcação que
2/3 da participação já detém em redes PoS tradicionais como a Solana.

5.1 Tamanho e Configuração Inicial
A Fogo mantém um conjunto de validadores com permissão, com um número mínimo e
máximo de validadores imposto pelo protocolo para garantir uma descentralização suficiente e, ao mesmo tempo, otimizar o
desempenho da rede. O tamanho inicial alvo será de aproximadamente 20 a 50 validadores, embora
este limite seja implementado como um parâmetro de protocolo que pode ser ajustado à medida que a rede
amadurece. No genesis, o conjunto inicial de validadores será selecionado por uma autoridade genesis, que
manterá permissões temporárias para gerir a composição do conjunto de validadores durante
os estágios iniciais da rede.

5.2 Governação e Transições
O controlo da autoridade genesis sobre a associação ao conjunto de validadores foi concebido para ser
temporário. Após um período inicial de estabilização da rede, esta autoridade transitará para
o próprio conjunto de validadores. Após esta transição, as alterações na associação ao conjunto de validadores
exigirão uma supermaioria de dois terços de tokens em stake, correspondendo ao mesmo limite
exigido para alterações ao nível do protocolo nas redes de prova de participação.
Para evitar alterações repentinas que possam desestabilizar a rede, os parâmetros do protocolo limitam
as taxas de rotação dos validadores. Não mais do que uma percentagem fixa do conjunto de validadores pode ser
substituída ou ejetada dentro de um determinado período de tempo, em que esta percentagem é um parâmetro de protocolo ajustável.
Isto garante a evolução gradual do conjunto de validadores, mantendo a estabilidade da rede.

5.3 Requisitos de Participação
Os validadores devem cumprir os requisitos mínimos de participação delegada para serem elegíveis para o
conjunto de validadores, mantendo a compatibilidade com o modelo económico da Solana e acrescentando o
componente permitido. Este duplo requisito – participação suficiente e aprovação do conjunto –
garante que os validadores têm tanto participação económica como capacidade operacional
para manter o desempenho da rede.

5.4 Fundamentação e Governação da Rede
O conjunto de validadores permissionados não impacta materialmente a descentralização da rede, dado que em
qualquer rede de prova de participação, uma supermaioria de dois terços de participação já pode efetuar
alterações arbitrárias no protocolo através de bifurcação. Em vez disso, este mecanismo fornece uma
estrutura formal para o conjunto de validadores impor à rede comportamentos benéficos que, de outra forma, poderiam ser difíceis de codificar nas regras do protocolo.
Por exemplo, a capacidade de ejetar validadores permite que a rede responda a:
● Problemas de desempenho persistentes que degradam as capacidades da rede
● Extração abusiva de MEV que prejudica a usabilidade da rede
● Comportamento desestabilizador da rede que não pode ser aplicado diretamente no protocolo, como
lixiviação, mas não encaminhamento, de blocos Turbine
● Outros comportamentos que, embora potencialmente lucrativos para os validadores individuais, prejudicam
o valor da rede a longo prazo
Este mecanismo de governação reconhece que, embora certos comportamentos possam ser lucrativos
a curto prazo, podem prejudicar a viabilidade da rede a longo prazo. Ao permitir que o
conjunto de validadores ponderados pela participação policie tais comportamentos através do controlo de membros, o Fogo
alinha os incentivos dos validadores com a saúde da rede a longo prazo, sem comprometer as
propriedades fundamentais de descentralização inerentes aos sistemas de prova de participação.

6. Extensões Potenciais
Embora as principais inovações da Fogo se concentrem no consenso multilocal, no desempenho do cliente e
gestão de conjuntos de validadores, estão a ser consideradas diversas extensões de protocolo adicionais
para implementação na fase de génese ou pós-lançamento. Estes recursos aprimorariam ainda mais
a funcionalidade da rede, mantendo a compatibilidade com versões anteriores do ecossistema Solana.

6.1 Pagamento da Taxa de Token SPL
Para permitir um acesso mais alargado à rede e melhorar a experiência do utilizador, a Fogo potencialmente
introduzirá um tipo de transação fee_payer_unsigned que permite que as transações sejam executadas
sem SOL na conta de origem. Esta funcionalidade, combinada com um programa de pagamento de taxas on-chain,
permite aos utilizadores pagar taxas de transação usando tokens SPL,
mantendo a segurança do protocolo e a compensação do validador.
O sistema funciona através de um mercado de retransmissores sem permissão fora do protocolo. Os usuários
constroem transações que incluem tanto as operações pretendidas como um pagamento de token SPL
para compensar o eventual pagador da taxa. Estas transações podem ser assinadas validamente
sem especificar um pagador de taxas, permitindo que qualquer parte as conclua, adicionando o seu
subscrição e pagando as taxas de SOL. Este mecanismo separa efetivamente a autorização da transação do pagamento das taxas, permitindo que as contas com saldo SOL zero interajam com
a rede, desde que possuam outros ativos valiosos.
Esta funcionalidade é implementada através de modificações mínimas no protocolo, exigindo apenas a
adição do novo tipo de transação e de um programa on-chain para lidar com a
compensação do retransmissor. O sistema cria um mercado eficiente para serviços de retransmissão de transações,
mantendo as propriedades de segurança do protocolo subjacente. Ao contrário dos sistemas de abstração de taxas mais complexos, esta abordagem não requer alterações nos mecanismos de pagamento do validador
ou nas regras de consenso.

7. Conclusão
Fogo representa uma nova abordagem à arquitetura blockchain que desafia os pressupostos tradicionais
sobre a relação entre desempenho, descentralização e segurança.
Ao combinar a implementação de clientes de alto desempenho com o consenso multilocal dinâmico
e conjuntos de validadores selecionados, o protocolo consegue um desempenho sem precedentes
sem comprometer as propriedades fundamentais de segurança dos sistemas de prova de participação. A
capacidade de realocar o consenso dinamicamente, mantendo a diversidade geográfica, proporciona
tanto a otimização de desempenho como a resiliência sistémica, enquanto os mecanismos de fallback do protocolo
garantem o funcionamento contínuo em condições adversas.
Através de um desenho económico cuidadoso, estes mecanismos surgem naturalmente de incentivos do validador,
em vez da aplicação do protocolo, criando um sistema robusto e
adaptável. À medida que a tecnologia blockchain continua a evoluir, as inovações da Fogo demonstram
como um design de protocolo bem pensado pode expandir os limites do desempenho,
mantendo as propriedades de segurança e descentralização que tornam as redes blockchain
valiosas.
`

// French
const FRENCH_TEXT = `
Fogo : Un protocole SVM hautes performances de couche 1
Version 1.0

Résumé
Cet article présente Fogo, un nouveau protocole blockchain de couche 1 offrant des performances révolutionnaires en matière de débit, de latence et de gestion de la congestion. En tant qu’extension du protocole Solana, Fogo assure une compatibilité totale au niveau de la couche d’exécution SVM, permettant aux programmes, outils et infrastructures Solana existants de migrer en toute transparence, tout en obtenant des performances nettement supérieures et une latence réduite.
Fogo apporte trois innovations :
● Une implémentation client unifiée basée sur Firedancer pur, permettant d’atteindre des niveaux de performance inaccessibles aux réseaux dotés de clients plus lents, y compris Solana.
● Un consensus multilocal avec colocation dynamique, permettant d’obtenir des temps de blocage et des latences bien inférieurs à ceux des principales blockchains.
● Un ensemble de validateurs organisés qui encourage les performances élevées et dissuade les comportements prédateurs au niveau des validateurs. Ces innovations offrent des gains de performance substantiels tout en préservant la décentralisation et la robustesse essentielles à une blockchain de couche 1.

1. Introduction
Les réseaux blockchain sont confrontés à un défi permanent : trouver un équilibre entre performance, décentralisation et sécurité. Les blockchains actuelles sont soumises à d’importantes limitations de débit, ce qui les rend inadaptées à l’activité financière mondiale. Ethereum traite moins de 50 transactions par seconde (TPS) sur sa couche de base. Même les couches 2 les plus centralisées gèrent moins de 1 000 TPS. Bien que Solana ait été conçu pour des performances supérieures, les limitations liées à la diversité des clients entraînent actuellement une congestion à 5 000 TPS. En revanche, les systèmes financiers traditionnels tels que le NASDAQ, le CME et l’Eurex traitent régulièrement plus de 100 000 opérations par seconde.
La latence constitue une autre limitation critique pour les protocoles de blockchain décentralisés. Sur les marchés financiers, en particulier pour la détermination des prix des actifs volatils, une faible latence est essentielle à la qualité et à la liquidité du marché. Les acteurs traditionnels du marché opèrent avec des latences de bout en bout de l'ordre de la milliseconde ou de moins de la milliseconde. Ces vitesses ne sont atteignables que lorsque les acteurs du marché peuvent colocaliser avec l'environnement d'exécution, en raison des contraintes de vitesse de la lumière.
Les architectures blockchain traditionnelles utilisent des ensembles de validateurs distribués à l'échelle mondiale qui fonctionnent sans connaissance géographique, ce qui entraîne des limitations de performances fondamentales. La lumière elle-même met plus de 130 millisecondes pour faire le tour du globe à l'équateur, même en décrivant un cercle parfait. De plus, les chemins réseau réels impliquent des distances et des délais d'infrastructure supplémentaires. Ces limitations physiques s'accentuent lorsque le consensus nécessite plusieurs cycles de communication entre les validateurs. Ces latences interrégionales s'aggravent lorsque le consensus nécessite plusieurs cycles de communication entre les validateurs. Par conséquent, les réseaux doivent mettre en œuvre des temps de bloc et des délais de finalité prudents pour maintenir la stabilité. Même dans des conditions optimales, un mécanisme de consensus distribué à l'échelle mondiale ne peut pas surmonter ces délais réseau fondamentaux.
À mesure que les blockchains s'intègrent davantage au système financier mondial, les utilisateurs exigeront des performances comparables à celles des systèmes centralisés actuels. Sans une conception soignée, répondre à ces exigences pourrait compromettre considérablement la décentralisation et la résilience des réseaux blockchain. Pour relever ce défi, nous proposons la blockchain de couche 1 Fogo. La philosophie fondamentale de Fogo est de maximiser le débit et de minimiser la latence grâce à deux approches clés : premièrement, l'utilisation du logiciel client le plus performant sur un ensemble de validateurs décentralisés de manière optimale ; deuxièmement, l'adoption d'un consensus colocalisé tout en préservant la plupart des avantages de décentralisation du consensus global.

2. Plan
Ce document est divisé en sections couvrant les principales décisions de conception concernant Fogo.
La section 3 présente la relation entre Fogo et le protocole blockchain Solana et sa stratégie en matière d'optimisation et de diversité des clients. La section 4 aborde le consensus multilocal, sa mise en œuvre pratique et les compromis qu'il implique par rapport au consensus global ou local. La section 5 présente l'approche de Fogo pour l'initialisation et la maintenance de l'ensemble de validateurs. La section 6 présente les extensions potentielles qui pourraient être introduites après la genèse.

3. Protocole et clients
Au niveau de la couche de base, Fogo s'appuie sur Solana, le protocole blockchain le plus performant et le plus utilisé à ce jour. Le réseau Solana intègre déjà de nombreuses solutions d'optimisation, tant au niveau de la conception du protocole que des implémentations client. Fogo vise une rétrocompatibilité maximale avec Solana, notamment une compatibilité totale au niveau de la couche d'exécution SVM et une compatibilité étroite avec le consensus TowerBFT, la propagation des blocs Turbine, la rotation des leaders Solana et tous les autres composants majeurs des couches réseau et consensus. Cette compatibilité permet à Fogo d'intégrer et de déployer facilement les programmes, outils et infrastructures existants de l'écosystème Solana, tout en bénéficiant des améliorations continues en amont de Solana.
Cependant, contrairement à Solana, Fogo fonctionnera avec un seul client canonique. Ce client canonique sera le client majeur le plus performant exécuté sur Solana. Cela permet à Fogo d'atteindre des performances nettement supérieures, car le réseau fonctionnera toujours à la vitesse du client le plus rapide. Alors que Solana, limité par la diversité de ses clients, sera toujours limité par la vitesse du client le plus lent, ce client canonique sera basé sur la pile Firedancer pour l'instant et à court terme.

3.1 Firedancer
Firedancer est l'implémentation client hautes performances de Jump Crypto, compatible Solana, affichant un débit de traitement des transactions nettement supérieur à celui des clients validateurs actuels grâce à un traitement parallèle optimisé, une gestion de la mémoire et des instructions SIMD.
Deux versions existent : « Frankendancer », une version hybride utilisant le moteur de traitement de Firedancer avec la pile réseau du validateur Rust, et l'implémentation complète de Firedancer avec une réécriture complète de la pile réseau C, actuellement en phase de développement avancé.
Les deux versions maintiennent la compatibilité avec le protocole Solana tout en optimisant les performances.
Une fois finalisée, l'implémentation Firedancer pure devrait établir de nouveaux critères de performance, la rendant idéale pour les exigences de débit élevé de Fogo. Fogo démarrera avec un réseau basé sur Frankendancer, puis passera progressivement à Firedancer pure. 3.2 Clients canoniques vs. Diversité des clients
Les protocoles blockchain fonctionnent grâce à des logiciels clients qui implémentent leurs règles et spécifications. Tandis que les protocoles définissent les règles de fonctionnement du réseau, les clients traduisent ces spécifications en logiciels exécutables. La relation entre protocoles et clients a historiquement suivi des modèles différents, certains réseaux promouvant activement la diversité des clients, tandis que d'autres convergent naturellement vers des implémentations canoniques.
La diversité des clients a traditionnellement de multiples objectifs : elle assure la redondance des implémentations, permet une vérification indépendante des règles du protocole et réduit théoriquement le risque de vulnérabilités logicielles à l'échelle du réseau. Le réseau Bitcoin constitue un précédent intéressant : alors que de multiples implémentations client existent, Bitcoin Core sert de client canonique de facto, fournissant l'implémentation de référence qui définit le comportement pratique du réseau.
Cependant, dans les réseaux blockchain hautes performances, la relation entre protocole et implémentation client devient plus contrainte. Lorsqu'un protocole approche des limites physiques du matériel informatique et réseau, la marge de manœuvre pour la diversité des implémentations se réduit naturellement. À ces limites de performance, les implémentations optimales doivent converger vers des solutions similaires, car elles sont confrontées aux mêmes limitations physiques et exigences de performance. Tout écart significatif par rapport aux schémas d'implémentation optimaux entraînerait une dégradation des performances, rendant le client non viable pour le fonctionnement du validateur. Cette dynamique est particulièrement visible dans les réseaux visant des temps de bloc minimaux et un débit de transaction maximal. Dans de tels systèmes, les avantages théoriques de la diversité des clients perdent de leur pertinence, car la charge liée au maintien de la compatibilité entre les différentes implémentations client peut elle-même constituer un goulot d'étranglement. Lorsque les performances de la blockchain sont poussées à leurs limites physiques, les implémentations client partageront nécessairement les décisions architecturales fondamentales, rendant les avantages de la diversité des implémentations en matière de sécurité largement théoriques.

3.3 Incitations du protocole pour les clients performants
Bien que Fogo autorise toute implémentation client conforme, son architecture incite naturellement à utiliser le client le plus performant disponible, compte tenu des exigences pratiques des opérations colocalisées à haute performance.
Contrairement aux réseaux traditionnels où la distance géographique constitue le principal goulot d'étranglement, la conception colocalisée de Fogo signifie que l'efficacité de l'implémentation client détermine directement les performances du validateur. Dans cet environnement, la latence du réseau est minimale, ce qui fait de la vitesse du client un facteur critique.
Les paramètres dynamiques de temps et de taille de bloc du réseau créent une pression économique pour maximiser le débit. Les validateurs doivent choisir entre utiliser le client le plus rapide ou risquer des pénalités et une baisse de revenus. Ceux qui utilisent des clients plus lents risquent soit de manquer des blocs en choisissant des paramètres agressifs, soit de perdre des revenus en choisissant des paramètres conservateurs.
Cela crée une sélection naturelle pour l'implémentation client la plus efficace. Dans l'environnement colocalisé de Fogo, même les plus petites différences de performances deviennent significatives : un client légèrement plus lent sera systématiquement moins performant, ce qui entraînera des blocs manqués et des pénalités. Cette optimisation repose sur l'intérêt personnel du validateur, et non sur les règles du protocole.
Bien que le choix du client ne puisse être directement imposé par le protocole, les pressions économiques poussent naturellement le réseau vers l'implémentation la plus efficace tout en maintenant un développement client compétitif.

4. Consensus multilocal
Le consensus multilocal représente une nouvelle approche du consensus blockchain qui équilibre de manière dynamique les avantages de performance de la colocalisation des validateurs avec les avantages de sécurité de la répartition géographique. Ce système permet aux validateurs de coordonner leurs emplacements physiques à travers les époques tout en conservant des identités cryptographiques distinctes pour les différentes zones, permettant ainsi au réseau d'atteindre un consensus à très faible latence en fonctionnement normal, tout en préservant la possibilité de recourir à un consensus global si nécessaire. Le modèle de consensus multilocal de Fogo s'inspire des pratiques établies sur les marchés financiers traditionnels, notamment le modèle de négociation « follow the sun » utilisé sur les marchés des changes et autres marchés mondiaux. En finance traditionnelle, la tenue de marché et l'apport de liquidités migrent naturellement entre les principales places financières au fil de la journée de négociation – de l'Asie à l'Europe en passant par l'Amérique du Nord – permettant ainsi un fonctionnement continu du marché tout en maintenant une liquidité concentrée dans des zones géographiques spécifiques. Ce modèle s'est avéré efficace en finance traditionnelle car il reconnaît que, malgré la mondialisation des marchés, les limitations physiques du réseau et les temps de réaction humains rendent un certain degré de concentration géographique nécessaire à une découverte optimale des prix et à l'efficacité du marché.

4.1 Zones et rotation des zones
Une zone représente une zone géographique où les validateurs se regroupent pour optimiser les performances du consensus. Idéalement, une zone est un centre de données unique où la latence réseau entre les validateurs frôle les limites matérielles. Cependant, les zones peuvent s'étendre pour englober des régions plus vastes si nécessaire, en échangeant une partie des performances contre des considérations pratiques. La définition exacte d'une zone résulte d'un consensus social entre les validateurs, et non d'une définition stricte du protocole. Cette flexibilité permet au réseau de s'adapter aux contraintes d'infrastructure réelles tout en maintenant les objectifs de performance.
La capacité du réseau à alterner entre les zones répond à plusieurs objectifs essentiels :
1. Décentralisation juridictionnelle : La rotation régulière des zones empêche la capture du consensus par une seule juridiction. Cela préserve la résistance du réseau aux pressions réglementaires et garantit qu'aucun gouvernement ni aucune autorité ne puisse exercer un contrôle à long terme sur son fonctionnement.
2. Résilience de l'infrastructure : Les centres de données et les infrastructures régionales peuvent tomber en panne pour de nombreuses raisons : catastrophes naturelles, pannes de courant, problèmes de réseau, pannes matérielles ou besoins de maintenance. La rotation des zones garantit que le réseau ne dépend pas en permanence d'un point de défaillance unique. Des exemples historiques de pannes majeures de centres de données, telles que celles causées par des événements météorologiques extrêmes ou des pannes de réseau électrique, démontrent l'importance de cette flexibilité.
3. Optimisation stratégique des performances : Les zones peuvent être sélectionnées pour optimiser des activités réseau spécifiques. Par exemple, lors d'événements financiers importants (tels que les annonces de la Réserve fédérale, les rapports économiques majeurs ou l'ouverture des marchés), les validateurs peuvent choisir de localiser le consensus à proximité de la source de ces informations sensibles aux prix. Cette capacité permet au réseau de minimiser la latence des opérations critiques tout en préservant la flexibilité pour différents cas d'utilisation d'une époque à l'autre.

4.2 Gestion des clés
Le protocole implémente un système de gestion des clés à deux niveaux qui sépare l'identité du validateur à long terme de la participation au consensus spécifique à une zone. Chaque validateur conserve une paire de clés globale qui lui sert d'identité racine dans le réseau. Cette clé globale est utilisée pour les opérations de haut niveau telles que la délégation d'enjeu, l'enregistrement de zone et la participation au consensus global. La clé globale doit être sécurisée avec les mesures de sécurité les plus strictes, car elle représente l'autorité ultime du validateur sur le réseau.
Les validateurs peuvent ensuite déléguer leur autorité à des sous-clés spécifiques à une zone via un programme de registre en chaîne. Ces sous-clés sont spécifiquement autorisées à participer au consensus dans des zones de colocalisation désignées. Cette séparation répond à de multiples objectifs de sécurité : elle permet aux validateurs de maintenir des modèles de sécurité différents pour différents types de clés, elle minimise l'exposition des clés globales en les gardant hors ligne pendant le fonctionnement normal, et elle réduit le risque de compromission des clés lors des transitions d'infrastructure physique entre les zones. La délégation de clés spécifiques à une zone est gérée par un programme on-chain qui maintient un registre des clés de zone autorisées pour chaque validateur. Bien que les validateurs puissent enregistrer de nouvelles clés de zone à tout moment à l'aide de leur clé globale, ces enregistrements ne prennent effet qu'aux limites des époques. Ce délai permet à tous les participants du réseau de vérifier et d'enregistrer les nouvelles délégations de clés avant qu'elles ne deviennent actives dans le consensus.

4.3 Proposition et activation de zones
De nouvelles zones peuvent être proposées via un mécanisme de gouvernance on-chain utilisant des clés globales. Cependant, afin de garantir la stabilité du réseau et de laisser aux validateurs le temps de préparer une infrastructure sécurisée, les zones proposées sont soumises à un délai obligatoire avant de devenir éligibles à la sélection. Ce délai, défini comme paramètre du protocole, doit être suffisamment long pour permettre aux validateurs de :
● Sécuriser l'infrastructure physique appropriée dans la nouvelle zone ;
● Mettre en place des systèmes sécurisés de gestion des clés pour le nouvel emplacement ;
● Configurer et tester l'infrastructure réseau ;
● Réaliser les audits de sécurité nécessaires du nouveau site ;
● Établir des procédures de sauvegarde et de récupération.
Ce délai constitue également une mesure de sécurité contre d'éventuelles attaques par lesquelles un acteur malveillant pourrait tenter d'imposer un consensus dans une zone où il bénéficie d'avantages infrastructurels. En exigeant un préavis pour l'ouverture de nouvelles zones, le protocole garantit à tous les validateurs une opportunité équitable d'établir leur présence dans toute zone susceptible d'être sélectionnée pour un consensus.
Ce n'est qu'après l'expiration de cette période d'attente qu'une zone peut être sélectionnée par le biais du processus de vote habituel pour les périodes futures. Cette approche prudente de l'activation des zones contribue à maintenir la sécurité et la stabilité du réseau tout en permettant l'ajout de nouveaux emplacements stratégiques à mesure que les besoins du réseau évoluent. 4.4 Processus de vote pour la sélection des zones
La sélection des zones de consensus s'effectue via un mécanisme de vote en chaîne qui concilie la nécessité d'une coordination des mouvements des validateurs avec la sécurité du réseau. Les validateurs doivent atteindre le quorum sur la zone de colocalisation de chaque future époque dans un délai configurable avant la transition d'époque. En pratique, le calendrier des époques peut être déterminé avec un certain délai, de sorte que le vote pendant l'époque n sélectionne la zone pour les époques n + k. Les votes sont exprimés via un programme de registre en chaîne utilisant les clés globales des validateurs, le pouvoir de vote étant pondéré par l'enjeu. Ce processus utilise des clés globales plutôt que des clés de zone, car il n'est pas sensible à la latence et exige une sécurité maximale.
Le processus de vote nécessite une supermajorité de l'enjeu pour établir le quorum, garantissant qu'un petit groupe de validateurs ne puisse pas forcer unilatéralement un changement de zone. Si les validateurs n'atteignent pas le quorum dans le délai imparti, le réseau passe automatiquement en mode consensus global pour l'époque suivante. Ce mécanisme de secours assure la continuité du réseau, même lorsque les validateurs ne parviennent pas à s'accorder sur une zone de colocalisation.
Pendant la période de vote, les validateurs indiquent leur zone préférée pour la prochaine époque
et leur temps de blocage cible pour cette zone. Cette sélection conjointe des paramètres d'emplacement et de performance permet au réseau d'optimiser les contraintes physiques et les performances de chaque zone. Il est important de noter que la période de vote laisse le temps aux validateurs de préparer l'infrastructure de la zone sélectionnée, notamment en préparant les clés spécifiques à la zone et en testant la connectivité réseau. Cette période de préparation est cruciale pour maintenir la stabilité du réseau lors des transitions de zone.

4.5 Mode Consensus Global
Le mode Consensus Global sert à la fois de mécanisme de secours et de fonction de sécurité fondamentale du protocole. Si Fogo atteint ses performances optimales grâce au consensus par zone, la possibilité de revenir au consensus global garantit le fonctionnement continu du réseau dans des conditions difficiles. En mode Consensus Global, le réseau fonctionne avec des paramètres conservateurs optimisés pour une validation distribuée à l'échelle mondiale : un temps de bloc fixe de 400 ms et une taille de bloc réduite pour s'adapter aux latences réseau plus élevées entre les validateurs géographiquement dispersés.
Le protocole entre en mode Consensus Global par deux voies principales :
● Échec de la sélection de zone : si les validateurs ne parviennent pas à atteindre le quorum sur la zone de consensus de l'époque suivante pendant la période de vote définie, le réseau bascule automatiquement par défaut sur le consensus global pour cette époque. ● Échec du consensus d'exécution : Si la zone actuelle ne parvient pas à atteindre la finalité du bloc dans le délai imparti au cours d'une époque, le protocole passe immédiatement en mode consensus global pour le reste de cette époque. Ce repli est « persistant » : une fois déclenché en milieu d'époque, le réseau reste en consensus global jusqu'à la transition d'époque suivante, privilégiant la stabilité à la récupération des performances.
En mode consensus global, les validateurs participent à l'aide d'une clé désignée pour l'opération globale, qui peut être ou non l'une de leurs clés spécifiques à la zone, et le réseau conserve les mêmes règles de choix de fork que le consensus par zone. Bien que ce mode sacrifie la latence ultra-faible réalisable dans les zones colocalisées, il fournit une base solide pour la continuité du réseau et démontre comment Fogo maintient la sécurité sans compromettre la viabilité dans des conditions dégradées.

5. Ensemble de validateurs
Pour atteindre des performances élevées et limiter les pratiques MEV abusives, Fogo utilisera un ensemble de validateurs organisé. Cela est nécessaire, car même une petite fraction de nœuds de validation sous-provisionnés peut empêcher le réseau d'atteindre ses limites de performance physique.
Dans un premier temps, la curation s'effectuera par preuve d'autorité avant de passer à une autorisation directe par l'ensemble de validateurs. En confiant l'autorité de curation à l'ensemble de validateurs,
Fogo peut appliquer une sanction de la couche sociale en cas de comportement abusif, comme un système de preuve d'autorité traditionnel, mais d'une manière qui n'est pas plus centralisée que le pouvoir de fork que détiennent déjà les deux tiers de Stake dans les réseaux PoS traditionnels comme Solana.

5.1 Taille et configuration initiale
Fogo maintient un ensemble de validateurs autorisés avec un nombre minimum et maximum de validateurs imposé par le protocole afin de garantir une décentralisation suffisante tout en optimisant les performances du réseau. La taille cible initiale sera d'environ 20 à 50 validateurs, bien que ce plafond soit implémenté comme un paramètre de protocole pouvant être ajusté à mesure que le réseau évolue. À la genèse, l'ensemble initial de validateurs sera sélectionné par une autorité de genèse, qui conservera des autorisations temporaires pour gérer sa composition pendant les premières phases du réseau.

5.2 Gouvernance et transitions
Le contrôle exercé par l'autorité de genèse sur l'appartenance à l'ensemble de validateurs est conçu pour être temporaire. Après une période initiale de stabilisation du réseau, cette autorité passera à l'ensemble de validateurs lui-même. Suite à cette transition, toute modification de l'appartenance à l'ensemble de validateurs nécessitera une supermajorité des deux tiers des jetons mis en jeu, correspondant au même seuil requis pour les modifications au niveau du protocole dans les réseaux de preuve d'enjeu.
Pour éviter des changements soudains susceptibles de déstabiliser le réseau, les paramètres du protocole limitent le taux de rotation des validateurs. Un pourcentage fixe de l'ensemble de validateurs ne peut être remplacé ou éjecté au cours d'une période donnée, ce pourcentage étant un paramètre de protocole ajustable. Cela garantit une évolution progressive de l'ensemble de validateurs tout en préservant la stabilité du réseau. 5.3 Conditions de participation
Les validateurs doivent respecter les exigences minimales de participation déléguée pour être éligibles à l'ensemble de validateurs, tout en maintenant la compatibilité avec le modèle économique de Solana et en ajoutant le composant autorisé. Cette double exigence – participation suffisante et approbation de l'ensemble – garantit que les validateurs disposent à la fois d'un enjeu économique et des capacités opérationnelles nécessaires pour maintenir les performances du réseau.

5.4 Justification et gouvernance du réseau
L'ensemble de validateurs autorisés n'a pas d'impact significatif sur la décentralisation du réseau. En effet, dans tout réseau de preuve d'enjeu, une supermajorité des deux tiers des participants peut déjà apporter des modifications arbitraires au protocole par le biais d'un fork. Ce mécanisme fournit plutôt un cadre formel permettant à l'ensemble de validateurs d'imposer des comportements bénéfiques au réseau, qui pourraient autrement être difficiles à coder dans les règles du protocole. Par exemple, la possibilité d'éjecter des validateurs permet au réseau de réagir à :
● Des problèmes de performances persistants qui dégradent les capacités du réseau ;
● Une extraction MEV abusive qui nuit à la convivialité du réseau ;
● Des comportements déstabilisants du réseau qui ne peuvent être appliqués directement dans le protocole, comme la lixiviation sans transfert de blocs Turbine ;
● D'autres comportements qui, bien que potentiellement rentables pour les validateurs individuels, nuisent à la valeur à long terme du réseau.
Ce mécanisme de gouvernance reconnaît que, si certains comportements peuvent être rentables à court terme, ils peuvent nuire à la viabilité à long terme du réseau. En permettant à l'ensemble de validateurs pondérés par les enjeux de contrôler ces comportements via le contrôle des membres, Fogo
aligne les incitations des validateurs sur la santé à long terme du réseau sans compromettre les propriétés de décentralisation fondamentales inhérentes aux systèmes de preuve d'enjeu. 6. Extensions potentielles
Si les principales innovations de Fogo se concentrent sur le consensus multilocal, les performances client et la gestion des validateurs, plusieurs extensions de protocole supplémentaires sont à l'étude, soit pour une implémentation initiale, soit après le lancement. Ces fonctionnalités amélioreraient encore les fonctionnalités du réseau tout en maintenant la rétrocompatibilité avec l'écosystème Solana.

6.1 Paiement des frais par jeton SPL
Afin d'élargir l'accès au réseau et d'améliorer l'expérience utilisateur, Fogo pourrait introduire un type de transaction fee_payer_unsigned permettant d'exécuter des transactions sans SOL sur le compte d'origine. Cette fonctionnalité, combinée à un programme de paiement des frais on-chain, permet aux utilisateurs de payer les frais de transaction avec des jetons SPL tout en préservant la sécurité du protocole et la rémunération des validateurs.
Le système fonctionne via une place de marché de relais hors protocole sans autorisation. Les utilisateurs créent des transactions qui incluent à la fois les opérations prévues et un paiement par jeton SPL pour rémunérer le payeur final des frais. Ces transactions peuvent être valablement signées sans spécifier de payeur de frais, permettant à toute partie de les finaliser en apposant sa signature et en payant les frais SOL. Ce mécanisme sépare efficacement l'autorisation de transaction du paiement des frais, permettant aux comptes dont le solde SOL est nul d'interagir avec le réseau tant qu'ils possèdent d'autres actifs de valeur.
Cette fonctionnalité est implémentée grâce à des modifications minimales du protocole, ne nécessitant que l'ajout du nouveau type de transaction et d'un programme on-chain pour gérer la rémunération du relais. Le système crée un marché efficace pour les services de relais de transactions tout en préservant les propriétés de sécurité du protocole sous-jacent. Contrairement aux systèmes d'abstraction de frais plus complexes, cette approche ne nécessite aucune modification des mécanismes de paiement des validateurs ni des règles de consensus.

7. Conclusion
Fogo représente une approche novatrice de l'architecture blockchain qui remet en question les hypothèses traditionnelles sur la relation entre performance, décentralisation et sécurité.
En combinant une implémentation client haute performance avec un consensus multilocal dynamique et des ensembles de validateurs organisés, le protocole atteint des performances sans précédent sans compromettre les propriétés de sécurité fondamentales des systèmes de preuve d'enjeu. La capacité à relocaliser dynamiquement le consensus tout en préservant la diversité géographique offre à la fois une optimisation des performances et une résilience systémique, tandis que les mécanismes de secours du protocole garantissent un fonctionnement continu dans des conditions défavorables. Grâce à une conception économique rigoureuse, ces mécanismes émergent naturellement des incitations des validateurs plutôt que de l'application du protocole, créant ainsi un système robuste et adaptable. À mesure que la technologie blockchain évolue, les innovations de Fogo démontrent comment une conception réfléchie des protocoles peut repousser les limites des performances tout en préservant les propriétés de sécurité et de décentralisation qui font la valeur des réseaux blockchain.
`

// Turkish
const TURKISH_TEXT = `
Fogo: Yüksek Performanslı Bir SVM Katman 1
Sürüm 1.0

Özet
Bu makale, verimlilik, gecikme ve tıkanıklık yönetiminde çığır açan bir performans sunan yeni bir katman 1 blok zinciri protokolü olan Fogo'yu tanıtmaktadır. Solana protokolünün bir uzantısı olan Fogo, SVM yürütme katmanında tam uyumluluğu koruyarak mevcut Solana programlarının, araçlarının ve altyapısının sorunsuz bir şekilde taşınmasını sağlarken önemli ölçüde daha yüksek performans ve daha düşük gecikme süresi sağlar. Fogo üç yeni inovasyona katkıda bulunur:
● Saf Firedancer tabanlı birleşik bir istemci uygulaması, Solana'nın kendisi de dahil olmak üzere daha yavaş istemcilere sahip ağların ulaşamayacağı performans seviyelerinin kilidini açar.
● Dinamik eş yerleştirme ile çok yerel mutabakat, herhangi bir büyük blok zincirinin çok altında blok süreleri ve gecikme süreleri sağlar.
● Yüksek performansı teşvik eden ve doğrulayıcı düzeyinde saldırgan davranışları caydıran, özenle seçilmiş bir doğrulayıcı seti. Bu yenilikler, 1. katman blok zinciri için gerekli olan merkeziyetsizlik ve sağlamlığı korurken önemli performans kazanımları sağlar.

1. Giriş
Blok zinciri ağları, performansı merkeziyetsizlik ve güvenlikle dengeleme konusunda devam eden bir zorlukla karşı karşıyadır. Günümüz blok zincirleri, onları küresel finansal faaliyetler için uygunsuz hale getiren ciddi işlem hacmi sınırlamalarıyla karşı karşıyadır. Ethereum, temel katmanında saniyede 50'den az işlem (TPS) gerçekleştirir. En merkezi 2. katmanlar bile saniyede 1.000'den az işlem gerçekleştirir. Solana daha yüksek performans için tasarlanmış olsa da, istemci çeşitliliğinden kaynaklanan sınırlamalar şu anda saniyede 5.000 işlem hızında tıkanıklığa neden olmaktadır. Buna karşılık, NASDAQ, CME ve Eurex gibi geleneksel finansal sistemler düzenli olarak saniyede 100.000'den fazla işlem gerçekleştirir. Gecikme, merkezi olmayan blok zinciri protokolleri için bir diğer kritik sınırlamadır. Finans piyasalarında -özellikle değişken varlıklarda fiyat keşfi için- düşük gecikme, piyasa kalitesi ve likidite için olmazsa olmazdır. Geleneksel piyasa katılımcıları, milisaniye veya milisaniyenin altında ölçeklerde uçtan uca gecikmelerle çalışır. Bu hızlara, piyasa katılımcıları ışık hızı kısıtlamaları nedeniyle yürütme ortamıyla aynı yerde bulunabildiğinde ulaşılabilir. Geleneksel blok zinciri mimarileri, coğrafi farkındalık olmadan çalışan küresel olarak dağıtılmış doğrulayıcı kümeleri kullanır ve bu da temel performans sınırlamaları yaratır. Işığın kendisi, mükemmel bir daire çizerek bile olsa, ekvatorda dünyayı dolaşması 130 milisaniyeden fazla sürer ve gerçek dünyadaki ağ yolları ek mesafe ve altyapı gecikmeleri içerir. Bu fiziksel sınırlamalar, konsensüsün doğrulayıcılar arasında birden fazla iletişim turu gerektirmesi durumunda daha da artar. Konsensüsün doğrulayıcılar arasında birden fazla iletişim turu gerektirmesi durumunda ise bu bölgeler arası gecikmeler daha da artar. Sonuç olarak, ağlar istikrarı korumak için muhafazakar blok süreleri ve kesinlik gecikmeleri uygulamalıdır. En uygun koşullar altında bile, küresel olarak dağıtılmış bir konsensüs mekanizması bu temel ağ gecikmelerinin üstesinden gelemez. Blok zincirleri küresel finans sistemiyle daha fazla bütünleştikçe, kullanıcılar günümüzün merkezi sistemlerine benzer bir performans talep edecektir. Dikkatli bir tasarım olmadan, bu taleplerin karşılanması blok zinciri ağlarının merkeziyetsizliğini ve dayanıklılığını önemli ölçüde tehlikeye atabilir. Bu zorluğun üstesinden gelmek için, Fogo birinci katman blok zincirini öneriyoruz. Fogo'nun temel felsefesi, iki temel yaklaşımla verimi en üst düzeye çıkarmak ve gecikmeyi en aza indirmektir: birincisi, en iyi şekilde merkeziyetsizleştirilmiş bir doğrulayıcı kümesinde en yüksek performanslı istemci yazılımını kullanmak; ikincisi, küresel konsensüsün merkeziyetsizlik avantajlarının çoğunu korurken aynı yerde bulunan konsensüsü benimsemek. 

2. Ana Hatlar
Makale, Fogo ile ilgili temel tasarım kararlarını kapsayan bölümlere ayrılmıştır.

3. Bölüm, Fogo'nun Solana blok zinciri protokolüyle ilişkisini ve istemci optimizasyonu ve çeşitliliğiyle ilgili stratejisini ele almaktadır. 4. Bölüm, çok yerel konsensüsü, pratik uygulamasını ve küresel veya yerel konsensüse göre yaptığı takasları ele almaktadır. 5. Bölüm, Fogo'nun doğrulayıcı kümesini başlatma ve sürdürme yaklaşımını ele almaktadır. Bölüm 6, oluşumdan sonra getirilebilecek olası uzantıları kapsamaktadır.

3. Protokol ve İstemciler
Fogo, temel katmanda bugüne kadarki en yüksek performanslı, yaygın olarak kullanılan blok zinciri protokolü Solana'nın üzerine inşa ederek başlar. Solana ağı, hem protokol tasarımı hem de istemci uygulamaları açısından çok sayıda optimizasyon çözümüyle birlikte gelir. Fogo, SVM yürütme katmanında tam uyumluluk ve TowerBFT konsensüsü, Türbin blok yayılımı, Solana lider rotasyonu ve ağ ve konsensüs katmanlarının diğer tüm önemli bileşenleriyle yakın uyumluluk dahil olmak üzere Solana ile mümkün olan en yüksek geriye dönük uyumluluğu hedefler. Bu uyumluluk, Fogo'nun Solana ekosistemindeki mevcut programları, araçları ve altyapıyı kolayca entegre edip dağıtmasına ve Solana'daki sürekli yukarı akış iyileştirmelerinden yararlanmasına olanak tanır. Ancak Solana'nın aksine, Fogo tek bir standart istemciyle çalışır. Bu standart istemci, Solana üzerinde çalışan en yüksek performanslı ana istemci olacaktır. Bu, ağ her zaman en hızlı istemcinin hızında çalışacağı için Fogo'nun önemli ölçüde daha yüksek performans elde etmesini sağlar. İstemci çeşitliliğiyle sınırlı olan Solana, her zaman en yavaş istemcinin hızıyla darboğaz yaşayacaktır. Şimdilik ve öngörülebilir gelecekte bu standart istemci Firedancer yığınını temel alacaktır.

3.1 Firedancer
Firedancer, Jump Crypto'nun yüksek performanslı Solana uyumlu istemci uygulamasıdır ve optimize edilmiş paralel işleme, bellek yönetimi ve SIMD talimatlarıyla mevcut doğrulayıcı istemcilerinden önemli ölçüde daha yüksek işlem işleme verimliliği sunar.
İki sürüm mevcuttur: Firedancer'ın işleme motorunu Rust doğrulayıcısının ağ yığınıyla kullanan bir hibrit olan "Frankendancer" ve şu anda geliştirmenin son aşamasında olan, eksiksiz bir C ağ yığını yeniden yazımına sahip tam Firedancer uygulaması.
Her iki sürüm de performansı en üst düzeye çıkarırken Solana protokol uyumluluğunu korur.
Tamamlandığında, saf Firedancer uygulamasının yeni performans ölçütleri belirlemesi ve Fogo'nun yüksek verimlilik gereksinimleri için ideal hale gelmesi beklenmektedir. Fogo, Frankendancer tabanlı bir ağ ile başlayacak ve ardından saf Firedancer'a geçiş yapacaktır.

3.2 Kanonik İstemciler ve İstemci Çeşitliliği
Blockchain protokolleri, kurallarını ve özelliklerini uygulayan istemci yazılımları aracılığıyla çalışır. Protokoller ağ işletim kurallarını tanımlarken, istemciler bu özellikleri çalıştırılabilir yazılımlara dönüştürür. Protokoller ve istemciler arasındaki ilişki tarihsel olarak farklı modeller izlemiştir; bazı ağlar istemci çeşitliliğini aktif olarak desteklerken, diğerleri doğal olarak kanonik uygulamalarda birleşir.
İstemci çeşitliliği geleneksel olarak birden fazla amaca hizmet eder: uygulama yedekliliği sağlar, protokol kurallarının bağımsız olarak doğrulanmasını sağlar ve teorik olarak ağ genelinde yazılım güvenlik açığı riskini azaltır. Bitcoin ağı ilginç bir örnek teşkil eder - birden fazla istemci uygulaması mevcut olsa da, Bitcoin Core fiili kanonik istemci olarak hizmet eder ve pratik ağ davranışını tanımlayan referans uygulamasını sağlar.
Ancak, yüksek performanslı blok zinciri ağlarında protokol ve istemci uygulaması arasındaki ilişki daha kısıtlı hale gelir. Bir protokol, bilgi işlem ve ağ donanımının fiziksel sınırlarına yaklaştığında, uygulama çeşitliliği için alan doğal olarak daralır. Bu performans sınırlarında, optimal uygulamalar, aynı fiziksel sınırlamalar ve performans gereksinimleriyle karşılaştıkları için benzer çözümlerde birleşmelidir. Optimal uygulama kalıplarından herhangi bir önemli sapma, istemciyi doğrulayıcı işlemi için uygunsuz hale getiren düşük performansa neden olur. Bu dinamik, özellikle mümkün olan en düşük blok sürelerini ve maksimum işlem hacmini hedefleyen ağlarda belirgindir. Bu tür sistemlerde, istemci çeşitliliğinin teorik faydaları daha az önemli hale gelir, çünkü farklı istemci uygulamaları arasında uyumluluğu sürdürmenin ek yükü başlı başına bir performans darboğazı haline gelebilir. Blockchain performansı fiziksel sınırlara zorlandığında, istemci uygulamaları zorunlu olarak temel mimari kararları paylaşacak ve uygulama çeşitliliğinin güvenlik avantajlarını büyük ölçüde teorik hale getirecektir.

3.3 Performanslı İstemciler için Protokol Teşvikleri
Fogo, herhangi bir uyumlu istemci uygulamasına izin verirken, mimarisi doğal olarak, yüksek performanslı eş-konumlu operasyonların pratik gereksinimleri tarafından yönlendirilen, mevcut en yüksek performanslı istemcinin kullanılmasını teşvik eder.
Coğrafi mesafenin ana darboğazları oluşturduğu geleneksel ağların aksine, Fogo'nun eş-konumlu tasarımı, istemci uygulama verimliliğinin doğrulayıcı performansını doğrudan belirlediği anlamına gelir. Bu ortamda, ağ gecikmesi minimumdur ve bu da istemci hızını kritik faktör haline getirir.
Ağın dinamik blok süresi ve boyut parametreleri, verimi en üst düzeye çıkarmak için ekonomik baskı yaratır. Doğrulayıcılar, en hızlı istemciyi kullanmak ile ceza ve gelir kaybı riski arasında seçim yapmak zorundadır. Daha yavaş istemciler çalıştıranlar, agresif parametrelere oy vererek blokları kaçırma riskini alır veya muhafazakar parametrelere oy vererek gelir kaybederler.
Bu, en verimli istemci uygulaması için doğal bir seçilim yaratır. Fogo'nun ortak yerleşimli ortamında, küçük performans farklılıkları bile önemli hale gelir; biraz daha yavaş bir istemci sürekli olarak düşük performans gösterir ve bu da blokların atlanmasına ve cezalara yol açar. Bu optimizasyon, protokol kurallarıyla değil, doğrulayıcının kişisel çıkarlarıyla gerçekleşir. İstemci seçimi doğrudan protokol tarafından dayatılamazken, ekonomik baskılar doğal olarak ağı rekabetçi istemci gelişimini korurken en verimli uygulamaya yönlendirir. 4. Çok Yerel Mutabakat
Çok yerel mutabakat, doğrulayıcı ortak yerleşiminin performans avantajlarını coğrafi dağıtımın güvenlik avantajlarıyla dinamik olarak dengeleyen yeni bir blok zinciri mutabakat yaklaşımını temsil eder. Sistem, doğrulayıcıların farklı bölgeler için farklı kriptografik kimlikler korurken fiziksel konumlarını farklı dönemlerde koordine etmelerine olanak tanır ve böylece ağın normal çalışma sırasında ultra düşük gecikmeli mutabakat elde etmesini ve gerektiğinde küresel mutabakata geri dönme yeteneğini korumasını sağlar. Fogo'nun çok yerel mutabakat modeli, geleneksel finans piyasalarındaki yerleşik uygulamalardan, özellikle de döviz ve diğer küresel piyasalarda kullanılan "güneşi takip et" işlem modelinden ilham alır. Geleneksel finansta, piyasa yapıcılığı ve likidite tedariki, işlem günü ilerledikçe büyük finans merkezleri arasında doğal olarak hareket eder - Asya'dan Avrupa'ya ve Kuzey Amerika'ya - ve belirli coğrafi bölgelerde yoğun likiditeyi korurken sürekli piyasa operasyonuna olanak tanır. Bu model, geleneksel finansta etkili olduğunu kanıtlamıştır çünkü piyasalar küresel olsa da, ağ oluşturmanın fiziksel sınırlamaları ve insan tepki sürelerinin, optimum fiyat keşfi ve piyasa verimliliği için bir dereceye kadar coğrafi yoğunlaşmayı gerekli kıldığını kabul eder.

4.1 Bölgeler ve Bölge Rotasyonu
Bir bölge, doğrulayıcıların optimum mutabakat performansına ulaşmak için birlikte konumlandığı coğrafi bir alanı temsil eder. İdeal olarak, bir bölge, doğrulayıcılar arasındaki ağ gecikmesinin donanım sınırlarına yaklaştığı tek bir veri merkezidir. Ancak, bölgeler gerektiğinde daha geniş bölgeleri kapsayacak şekilde genişleyebilir ve pratik hususlar için bir miktar performanstan ödün verebilir. Bir bölgenin kesin tanımı, protokolde kesin olarak tanımlanmak yerine, doğrulayıcılar arasındaki sosyal mutabakatla ortaya çıkar. Bu esneklik, ağın performans hedeflerini korurken gerçek dünyadaki altyapı kısıtlamalarına uyum sağlamasını sağlar. Ağın bölgeler arasında dönüşüm yapabilmesi, birçok kritik amaca hizmet eder: 1. Yetki Alanında Merkeziyetsizlik: Düzenli bölge rotasyonu, tek bir yargı bölgesinin mutabakat sağlamasını önler. Bu, ağın düzenleyici baskılara karşı direncini korur ve hiçbir hükümet veya otoritenin ağ işletimi üzerinde uzun vadeli kontrol uygulayamamasını sağlar. 2. Altyapı Dayanıklılığı: Veri merkezleri ve bölgesel altyapılar, doğal afetler, elektrik kesintileri, ağ sorunları, donanım arızaları veya bakım gereksinimleri gibi çeşitli nedenlerle arızalanabilir. Bölge rotasyonu, ağın tek bir arıza noktasına kalıcı olarak bağımlı olmamasını sağlar. Şiddetli hava olayları veya elektrik şebekesi arızaları gibi büyük veri merkezi kesintilerinin tarihsel örnekleri, bu esnekliğin önemini göstermektedir. 3. Stratejik Performans Optimizasyonu: Belirli ağ etkinlikleri için optimizasyon yapmak üzere bölgeler seçilebilir. Örneğin, önemli finansal olaylar (Federal Rezerv duyuruları, önemli ekonomik raporlar veya piyasa açılışları gibi) içeren dönemlerde, doğrulayıcılar fikir birliğini bu fiyata duyarlı bilginin kaynağına yakın bir yere yerleştirmeyi tercih edebilir. Bu özellik, ağın farklı dönemlerdeki farklı kullanım durumları için esnekliği korurken kritik işlemler için gecikmeyi en aza indirmesini sağlar.

4.2 Anahtar Yönetimi
Protokol, uzun vadeli doğrulayıcı kimliğini bölgeye özgü mutabakat katılımından ayıran iki katmanlı bir anahtar yönetim sistemi uygular. Her doğrulayıcı, ağda kök kimliği olarak hizmet veren bir küresel anahtar çifti tutar. Bu küresel anahtar, hisse devri, bölge kaydı ve küresel mutabakat katılımı gibi üst düzey işlemler için kullanılır. Küresel anahtar, doğrulayıcının ağdaki nihai yetkisini temsil ettiği için mümkün olan en yüksek güvenlik önlemleriyle güvence altına alınmalıdır. Doğrulayıcılar daha sonra yetkiyi, zincir üstü bir kayıt programı aracılığıyla bölgeye özgü alt anahtarlara devredebilir. Bu alt anahtarlar, belirlenmiş ortak yerleşim bölgelerinde mutabakat katılımı için özel olarak yetkilendirilmiştir. Bu ayrım, birden fazla güvenlik amacına hizmet eder: doğrulayıcıların farklı anahtar türleri için farklı güvenlik modelleri sürdürmesine olanak tanır, normal çalışma sırasında küresel anahtarların çevrimiçi kalmasını sağlayarak bunların açığa çıkma riskini en aza indirir ve bölgeler arasındaki fiziksel altyapı geçişleri sırasında anahtarların tehlikeye girme riskini azaltır. Bölgeye özgü anahtarların devri, her doğrulayıcı için yetkili bölge anahtarlarının kaydını tutan bir zincir üstü program aracılığıyla yönetilir. Doğrulayıcılar, küresel anahtarlarını kullanarak istedikleri zaman yeni bölge anahtarları kaydedebilseler de, bu kayıtlar yalnızca dönem sınırlarında geçerli olur. Bu gecikme, tüm ağ katılımcılarının, mutabakat halinde aktif hale gelmeden önce yeni anahtar devirlerini doğrulamak ve kaydetmek için zamana sahip olmasını sağlar.

4.3 Bölge Önerisi ve Etkinleştirme
Yeni bölgeler, küresel anahtarlar kullanılarak bir zincir üstü yönetişim mekanizması aracılığıyla önerilebilir. Ancak, ağ istikrarını sağlamak ve doğrulayıcılara güvenli altyapıyı hazırlamaları için yeterli zaman vermek amacıyla, önerilen bölgelerin seçilmeye uygun hale gelmeden önce zorunlu bir gecikme süresi vardır. Protokol parametresi olarak ayarlanan bu gecikme, doğrulayıcıların şunları yapmasına olanak sağlayacak kadar uzun olmalıdır:
● Yeni bölgede uygun fiziksel altyapıyı güvence altına almak
● Yeni konum için güvenli anahtar yönetim sistemleri kurmak
● Ağ altyapısını kurmak ve test etmek
● Yeni tesis için gerekli güvenlik denetimlerini gerçekleştirmek
● Yedekleme ve kurtarma prosedürlerini oluşturmak
Gecikme süresi aynı zamanda kötü niyetli bir aktörün, altyapısal avantajlara sahip olduğu bir bölgeye fikir birliğini zorlamaya çalışabileceği olası saldırılara karşı bir güvenlik önlemi görevi görür. Protokol, yeni bölgeler için önceden bildirim gerektirmesiyle, tüm doğrulayıcıların fikir birliği için seçilebilecek herhangi bir bölgede varlık göstermeleri için adil bir fırsata sahip olmalarını sağlar. Bir bölge ancak bu bekleme süresini tamamladıktan sonra, gelecekteki dönemler için düzenli bölge oylama süreciyle seçilebilir. Bölge aktivasyonuna yönelik bu dikkatli yaklaşım, ağ güvenliği ve istikrarının korunmasına yardımcı olurken, ağ gereksinimleri geliştikçe yeni stratejik konumların eklenmesine de olanak tanır. 4.4 Bölge Seçimi Oylaması Süreci
Uzlaşma bölgelerinin seçimi, koordineli doğrulayıcı hareketi ihtiyacını ağ güvenliğiyle dengeleyen bir zincir içi oylama mekanizması aracılığıyla gerçekleşir. Doğrulayıcılar, dönem geçişinden önce yapılandırılabilir bir çoğunluk süresi içinde her bir gelecek dönemin ortak yerleşim bölgesinde yeter sayıya ulaşmalıdır. Uygulamada, dönem çizelgesi, n dönemi sırasında oylamanın n + k dönemi için bölgeyi seçmesi gibi belirli bir ön süre ile belirlenebilir. Oylar, doğrulayıcıların küresel anahtarları kullanılarak bir zincir içi kayıt programı aracılığıyla verilir ve oylama gücü hisseye göre ağırlıklandırılır. Bu süreç, gecikmeye duyarlı olmadığı ve maksimum güvenlik gerektirdiği için bölge anahtarları yerine küresel anahtarlar kullanır. Oylama süreci, yeter sayıyı oluşturmak için hisse ağırlığının büyük çoğunluğunu gerektirir ve bu da küçük bir doğrulayıcı grubunun tek taraflı olarak bir bölge değişikliğini zorlayamayacağı anlamına gelir. Doğrulayıcılar belirlenen zaman dilimi içinde yeter sayıya ulaşamazsa, ağ otomatik olarak bir sonraki dönem için küresel fikir birliği moduna geçer. Bu geri dönüş mekanizması, doğrulayıcılar bir ortak yerleşim bölgesi üzerinde anlaşamasa bile ağ sürekliliğini sağlar. Oylama süresi boyunca, doğrulayıcılar hem bir sonraki dönem için tercih ettikleri bölgeyi hem de o bölge için hedef blok süresini işaretler. Konum ve performans parametrelerinin bu şekilde ortak seçilmesi, ağın her bölgenin hem fiziksel kısıtlamalarına hem de performans yeteneklerine göre optimizasyon yapmasını sağlar. Daha da önemlisi, oylama süresi, doğrulayıcılara seçilen bölgedeki altyapıyı hazırlamaları, bölgeye özgü anahtarları ısıtmaları ve ağ bağlantısını test etmeleri için zaman sağlar. Bu hazırlık süresi, bölge geçişleri sırasında ağ kararlılığını korumak için çok önemlidir.

4.5 Küresel Mutabakat Modu
Küresel mutabakat modu, protokolün hem bir geri dönüş mekanizması hem de temel bir güvenlik özelliği olarak hizmet eder. Fogo, bölge tabanlı mutabakat yoluyla en yüksek performansına ulaşırken, küresel mutabakat moduna geri dönme yeteneği, ağın olumsuz koşullar altında çalışmaya devam etmesini sağlar. Küresel mutabakat modunda, ağ, küresel olarak dağıtılmış doğrulama için optimize edilmiş muhafazakar parametrelerle çalışır: sabit 400 ms blok süresi ve coğrafi olarak dağıtılmış doğrulayıcılar arasındaki daha yüksek ağ gecikmelerini karşılamak için azaltılmış blok boyutu. Protokol, küresel mutabakat moduna iki ana yoldan girer:
● Başarısız Bölge Seçimi: Doğrulayıcılar, belirlenen oylama süresi içinde bir sonraki dönemin mutabakat bölgesinde yeter sayıya ulaşamazsa, ağ otomatik olarak o dönem için küresel mutabakat moduna geçer. ● Çalışma Zamanı Konsensüs Hatası: Mevcut bölge, bir dönem boyunca belirlenen zaman aşımı süresi içinde blok kesinliğine ulaşamazsa, protokol o dönemin geri kalanı için derhal genel konsensüs moduna geçer. Bu geri dönüş "sabittir" - bir dönemin ortasında tetiklendiğinde, ağ bir sonraki dönem geçişine kadar genel konsensüs modunda kalır ve performans iyileştirme yerine kararlılığa öncelik verir. Genel konsensüs modunda, doğrulayıcılar, genel işlem için belirlenmiş bir anahtar kullanarak katılırlar; bu anahtar, kendi bölgelerine özgü anahtarlarından biri olabilir veya olmayabilir ve ağ, bölge tabanlı konsensüsle aynı çatal seçim kurallarını korur. Bu mod, eş konumlu bölgelerde elde edilebilen ultra düşük gecikmeden ödün verirken, ağ sürekliliği için sağlam bir temel sağlar ve Fogo'nun düşük koşullar altında canlılıktan ödün vermeden güvenliği nasıl koruduğunu gösterir.

5. Doğrulayıcı Seti
Yüksek performans elde etmek ve kötüye kullanılan MEV uygulamalarını azaltmak için Fogo, düzenlenmiş bir doğrulayıcı seti kullanacaktır. Bu gereklidir, çünkü yetersiz sağlanan doğrulama düğümlerinin küçük bir kısmı bile ağın fiziksel performans sınırlarına ulaşmasını engelleyebilir. Başlangıçta, küratörlük, doğrulayıcı kümesi tarafından doğrudan izin vermeye geçmeden önce yetki kanıtı aracılığıyla çalışacaktır. Küratörlük yetkisini doğrulayıcı kümesine yerleştirerek, Fogo, geleneksel bir yetki kanıtı sistemi gibi kötüye kullanım davranışlarının sosyal katmanda cezalandırılmasını sağlayabilir, ancak bu, Solana gibi geleneksel PoS ağlarında hisselerin 2/3'ünün zaten sahip olduğu çatal gücünden daha merkezi olmayan bir şekilde yapılır.

5.1 Boyut ve İlk Yapılandırma
Fogo, ağ performansını optimize ederken yeterli merkeziyetsizliği sağlamak için protokol tarafından zorunlu kılınan minimum ve maksimum sayıda doğrulayıcıya sahip, izinli bir doğrulayıcı kümesi sağlar. Başlangıçtaki hedef boyut yaklaşık 20-50 doğrulayıcı olacaktır, ancak bu sınır, ağ olgunlaştıkça ayarlanabilen bir protokol parametresi olarak uygulanır. Genesis aşamasında, ilk doğrulayıcı seti, ağın erken aşamalarında doğrulayıcı seti bileşimini yönetmek için geçici izinlere sahip olacak bir genesis yetkilisi tarafından seçilecektir.

5.2 Yönetişim ve Geçişler
Genesis yetkilisinin doğrulayıcı seti üyeliği üzerindeki kontrolü geçici olarak tasarlanmıştır. Ağın ilk istikrar döneminden sonra, bu yetki doğrulayıcı setinin kendisine geçecektir. Bu geçişin ardından, doğrulayıcı seti üyeliğindeki değişiklikler, hisse senedine yatırılmış tokenların üçte ikilik çoğunluğunu gerektirecektir ve bu da hisse kanıtı ağlarındaki protokol düzeyindeki değişiklikler için gereken eşiğe denk gelir.
Ağı istikrarsızlaştırabilecek ani değişiklikleri önlemek için protokol parametreleri doğrulayıcı devir oranlarını sınırlar. Doğrulayıcı setinin belirli bir süre içinde sabit bir yüzdesinden fazlası değiştirilemez veya çıkarılamaz; bu yüzde ayarlanabilir bir protokol parametresidir. Bu, ağ istikrarını korurken doğrulayıcı setinin kademeli olarak gelişmesini sağlar. 

5.3 Katılım Koşulları
Doğrulayıcılar, doğrulayıcı setine katılabilmek için minimum devredilen hisse gereksinimlerini karşılamalı ve Solana'nın ekonomik modeliyle uyumluluğu korurken izin verilen bileşeni eklemelidir. Bu ikili gereklilik - yeterli hisse ve set onayı - doğrulayıcıların hem oyunda ekonomik güce hem de ağ performansını sürdürmek için operasyonel yeteneklere sahip olmasını sağlar.

5.4 Gerekçe ve Ağ Yönetişimi
İzin verilen doğrulayıcı seti, ağ merkeziyetsizliğini önemli ölçüde etkilemez; çünkü herhangi bir hisse ispatı ağında, hisselerin üçte ikilik bir çoğunluğu, çatallanma yoluyla protokolde keyfi değişiklikler yapabilir. Bunun yerine, bu mekanizma, doğrulayıcı setinin, protokol kurallarına kodlanması zor olabilecek faydalı ağ davranışlarını uygulaması için resmi bir çerçeve sağlar. Örneğin, doğrulayıcıları çıkarma yeteneği, ağın şunlara yanıt vermesini sağlar:
● Ağ yeteneklerini düşüren kalıcı performans sorunları
● Ağ kullanılabilirliğine zarar veren kötüye kullanılan MEV çıkarımı
● Protokolde doğrudan uygulanamayan, ağ istikrarsızlaştırıcı davranışlar, örneğin Türbin bloklarını sızdırmak ancak iletmemek
● Bireysel doğrulayıcılar için potansiyel olarak karlı olsa da ağın uzun vadeli değerine zarar veren diğer davranışlar
● Bu yönetişim mekanizması, belirli davranışların kısa vadede karlı olabileceğini, ancak ağın uzun vadeli sürdürülebilirliğine zarar verebileceğini kabul eder. Fogo, hisse ağırlıklı doğrulayıcı setinin üyelik kontrolü yoluyla bu tür davranışları denetlemesini sağlayarak, doğrulayıcı teşviklerini, hisse ispatı sistemlerinin doğasında bulunan temel merkeziyetsizlik özelliklerinden ödün vermeden ağın uzun vadeli sağlığıyla uyumlu hale getirir. 6. Muhtemel Uzantılar
Fogo'nun temel yenilikleri çok yerel mutabakat, istemci performansı ve doğrulayıcı seti yönetimine odaklanırken, başlangıç veya lansman sonrası uygulama için birkaç ek protokol uzantısı değerlendirilmektedir. Bu özellikler, Solana ekosistemiyle geriye dönük uyumluluğu korurken ağ işlevselliğini daha da artıracaktır.

6.1 SPL Token Ücret Ödemesi
Daha geniş bir ağ erişimi sağlamak ve kullanıcı deneyimini iyileştirmek için Fogo, potansiyel olarak, kaynak hesapta SOL olmadan işlemlerin yürütülmesine olanak tanıyan bir fee_payer_unsigned işlem türü sunacaktır. Bu özellik, zincir içi bir ücret ödeme programıyla birleştirildiğinde, kullanıcıların protokol güvenliğini ve doğrulayıcı tazminatını korurken SPL token'ları kullanarak işlem ücretlerini ödemelerine olanak tanır.
Sistem, protokol dışı, izinsiz bir aktarıcı pazar yeri aracılığıyla çalışır. Kullanıcılar, hem amaçladıkları işlemleri hem de nihai ücret ödeyen kişiyi tazmin etmek için bir SPL token ödemesini içeren işlemler oluşturur. Bu işlemler, bir ücret ödeyen belirtilmeden geçerli bir şekilde imzalanabilir ve böylece herhangi bir taraf imzasını ekleyerek ve SOL ücretlerini ödeyerek işlemleri tamamlayabilir. Bu mekanizma, işlem yetkilendirmesini ücret ödemesinden etkili bir şekilde ayırarak, sıfır SOL bakiyesi olan hesapların, diğer değerli varlıklara sahip oldukları sürece ağ ile etkileşime girmelerini sağlar. Bu özellik, yalnızca yeni işlem türünün eklenmesini ve aktarıcı tazminatını işleyecek bir zincir içi program gerektiren minimum protokol değişiklikleriyle uygulanır. Sistem, altta yatan protokolün güvenlik özelliklerini korurken, işlem aktarma hizmetleri için verimli bir pazar oluşturur. Daha karmaşık ücret soyutlama sistemlerinin aksine, bu yaklaşım doğrulayıcı ödeme mekanizmalarında veya fikir birliği kurallarında herhangi bir değişiklik gerektirmez.

7. Sonuç
Fogo, performans, merkeziyetsizlik ve güvenlik arasındaki ilişki hakkındaki geleneksel varsayımlara meydan okuyan, blok zinciri mimarisine yeni bir yaklaşım sunar. Yüksek performanslı istemci uygulamasını dinamik çok yerel mutabakat ve özenle seçilmiş doğrulayıcı setleriyle birleştiren protokol, hisse ispatı sistemlerinin temel güvenlik özelliklerinden ödün vermeden benzeri görülmemiş bir performansa ulaşır. Coğrafi çeşitliliği korurken mutabakatı dinamik olarak yeniden konumlandırma yeteneği, hem performans optimizasyonu hem de sistemik dayanıklılık sağlarken, protokolün yedek mekanizmaları olumsuz koşullar altında kesintisiz çalışmayı garanti eder. Dikkatli ekonomik tasarım sayesinde, bu mekanizmalar protokol yaptırımı yerine doğrulayıcı teşviklerinden doğal olarak ortaya çıkar ve sağlam ve uyarlanabilir bir sistem oluşturur. Blok zinciri teknolojisi gelişmeye devam ettikçe, Fogo'nun yenilikleri, düşünceli protokol tasarımının, blok zinciri ağlarını değerli kılan güvenlik ve merkeziyetsizlik özelliklerini korurken performans sınırlarını nasıl zorlayabileceğini göstermektedir.
`

// Russian

const RUSSIAN_TEXT = `
Фого: Высокопроизводительный СВМ уровня 1
Версия 1.0

Аннотация
В представленной статье Fogo, новый светодиод-протокол уровня 1, обеспечивающий революционную производительность.
в плане управления пропускной функцией, задержками и перегрузками. Фого, являясь расширением
протокол Solana, поддерживает полную совместимость на уровне выполнения SVM, запускает
Существующим программам, инструментам и инфраструктуре Solana легко мигрировать, достигнув при этом значительно более высокой производительности и меньшей задержки.
Fogo предлагает три новых нововведения:
● Унифицированная поставка клиенту на основе чистой Firedancer, обеспечение уровней производительности,
Недостижимые сети с более слабыми клиентами, включая Солану.
● Мультилокальный консенсус с активным размещением, позволяющий ограничить время блока и задержек,
значительно меньше, чем в любом крупном здании.
● Специально подобранный набор валидаторов, который стимулирует производительность труда и собственное хищническое поведение.
на уровне валидаторов.
Эти инновации обеспечивают существенный прирост производительности, сохраняя при этом децентрализацию и надежность, необходимые для проживания первого уровня.

1. Введение
Сети кондиционеров постоянно сталкиваются с проблемой баланса между производительностью, децентрализацией и безопасностью. Современные условия испытывают серьезные ограничения пропускной способности, которые делают их непригодными для глобальной финансовой деятельности. Эфириум обрабатывает менее 50 транзакций в секунду (TPS) на своем базовом уровне. Даже самые централизованные кондиционеры второго уровня обрабатывают менее 1000 транзакций в секунду. Хотя Solana была разработана для более высокой производительности, ограничения, связанные с разнообразием клиентов, в настоящее время приводят к перегрузке при 5000 транзакций в секунду. В отличие от этого, традиционные финансовые системы, такие как NASDAQ, CME и Eurex, регулярно обрабатывают более 100 000 операций в секунду.
Задержка представляет собой ещё одно критическое ограничение для децентрализованных электронных протоколов. На финансовых рынках, особенно для определения цен на волатильные активы, обеспечение поддержки имеет решающее значение для качества и ликвидности рынка. Традиционные участники рынка работают со сквозными задержками в миллисекундном или субмиллисекундном масштабе. Такая скорость достигается только
когда участники рынка могут совместно работать, чтобы обеспечить выполнение
ограничение скорости света.
Традиционные архитектуры домашних зданий используют глобально распределенные наборы валидаторов, которые работают.
без учета географических положений, что создает фундаментальные ограничения производительности. Самому свету
требуется более 130 миллисекунд, чтобы обогнуть земной шар по экватору, даже описывая
идеальная окружность, реальный сетевой путь требуют дополнительных расстояний и инфраструктурных возможностей.
задержек. Эти ограничения усугубляются, когда консенсус требует нескольких
раундов связи между валидаторами. Эти межрегиональные задержки усугубляются, когда консенсус требует нескольких
раундов связи между валидаторами. В результате
сети должны реализовывать наблюдательные временные интервалы блоков и задержки для поддержания
стабильность. Даже в оптимальных условиях глобального распределенного механизма консенсуса
Не можете игнорировать эти базовые сетевые задержки.
По мере дальнейшего сотрудничества с пользователями мировой финансовой системы будут требоваться
производительности, прогрессивной с современными централизованными жизнью. Без тщательного планирования учет этих требований может существенно подорвать децентрализацию и
устойчивость сетей отопления. Для решения этой проблемы мы предлагаем подвесной светильник Fogo первого уровня. Основная философия Фого заключается в максимизации пропускной способности и минимизации задержек с помощью двух символов.
подходы: во-первых, использование максимально производительного клиентского программного обеспечения на децентрализованном режиме.
набор валидаторов; и, во-вторых, использование совместного консенсуса с сохранением большинства
преимущества децентрализации, достигнутые глобальным консенсусом.

2. План
Документ разбит на разделы, посвященные основным проектным решениям, касающимся Фого.
В разделе 3 поиск взаимосвязи Fogo с протоколом кабеля Solana и его
стратегия в отношении оптимизации и разнообразия клиентов. В разделе 4 эффект мультилокальный
консенсус, его практическая реализация и компромиссы, которые он обеспечивает по сравнению с глобальными или
локальным консенсусом. В разделе 5 Поиск подхода Fogo к структуризации и поддержке
набор валидаторов. В разделе 6 приведены потенциальные расширения, которые могут быть включены после
генезиса.

3.3 Стимулирование протоколов для производительных клиентов
Хотя Fogo допускает любую соответствующую реализацию клиента, его архитектура естественным образом
стимулирует использование наиболее производительного клиента из доступных, что обусловлено практическими требованиями
высокопроизводительных совместно размещенных операций.
В отличие от традиционных сетей, где географическая удаленность создает основные узкие места,
совместная архитектура Fogo означает, что эффективность реализации клиента напрямую определяет
производительность валидатора. В этой среде задержка сети минимальна, что делает скорость клиента
критическим фактором.
Динамические параметры времени и размера блока сети создают экономическое давление, требующее
максимизации пропускной способности. Валидаторы должны выбирать между использованием самого быстрого клиента и риском штрафов и снижения дохода. Те, кто использует более медленные клиенты, либо рискуют пропустить блоки, голосуя за агрессивные параметры, либо теряют доход, голосуя за консервативные.
Это создает естественный отбор для наиболее эффективной реализации клиента. В
совместно размещенной среде Fogo даже небольшие различия в производительности становятся значительными —
немного более медленный клиент будет постоянно работать хуже, что приведет к пропуску блоков и
штрафам. Эта оптимизация происходит благодаря собственным интересам валидатора, а не правилам протокола.
Хотя выбор клиента не может быть напрямую обусловлен протоколом, экономическое давление естественным образом
подталкивает сеть к наиболее эффективной реализации, поддерживая при этом конкурентоспособную
разработку клиентов.

4. Мультилокальный консенсус
Мультилокальный консенсус представляет собой новый подход к консенсусу блокчейна, который
динамически балансирует преимущества производительности совместного размещения валидаторов с преимуществами безопасности
географического распределения. Система позволяет валидаторам координировать свое
физическое местоположение в разных эпохах, сохраняя при этом отдельные криптографические идентификаторы для
разных зон, что позволяет сети достигать консенсуса со сверхнизкой задержкой во время
нормальной работы, сохраняя при этом возможность отката к глобальному консенсусу при
необходимости. Мультилокальная модель консенсуса Fogo черпает вдохновение из устоявшейся практики традиционных финансовых рынков, в частности, торговой модели «следуй за солнцем», используемой на валютном рынке и других глобальных рынках. В традиционных финансах маркет-мейкинг и обеспечение ликвидности естественным образом перемещаются между основными финансовыми центрами в течение торгового дня – из Азии в Европу и Северную Америку, – что позволяет поддерживать непрерывную работу рынка, поддерживая при этом концентрированную ликвидность в определенных географических регионах. Эта модель доказала свою эффективность в традиционных финансах, поскольку она учитывает, что, несмотря на глобальный характер рынков, физические ограничения сетей и время реакции человека делают определённую степень географической концентрации необходимой для оптимального ценообразования и эффективности рынка.

4.1 Зоны и ротация зон
Зона представляет собой географическую область, где валидаторы совместно размещаются для достижения оптимальной
консенсусной производительности. В идеале зона представляет собой один центр обработки данных, где сетевая задержка
между валидаторами приближается к аппаратным пределам. Однако при необходимости зоны могут расширяться для охвата более крупных регионов, жертвуя производительностью ради практических
соображений. Точное определение зоны определяется социальным консенсусом среди
валидаторов, а не строго определяется протоколом. Эта гибкость позволяет
сети адаптироваться к реальным ограничениям инфраструктуры, сохраняя при этом
целевые показатели производительности.
Способность сети чередоваться между зонами служит нескольким критически важным целям:
1. Юрисдикционная децентрализация: Регулярная ротация зон предотвращает достижение
консенсуса какой-либо одной юрисдикцией. Это поддерживает устойчивость сети к
регулирующему давлению и гарантирует, что ни одно правительство или орган власти не сможет осуществлять
долгосрочный контроль над работой сети.
2. Устойчивость инфраструктуры: Центры обработки данных и региональная инфраструктура могут выходить из строя по
множеству причин: стихийные бедствия, отключения электроэнергии, сетевые проблемы, сбои оборудования или необходимость технического обслуживания. Ротация зон гарантирует, что сеть не
постоянно зависит от какой-либо одной точки отказа. Исторические примеры крупных
сбоев в работе центров обработки данных, например, вызванных экстремальными погодными явлениями или сбоями в электросети, демонстрируют важность этой гибкости. 3. Стратегическая оптимизация производительности: зоны могут быть выбраны для оптимизации под конкретные сетевые активности. Например, в эпохи, содержащие важные финансовые события (такие как заявления Федеральной резервной системы, важные экономические отчеты или открытие рынка), валидаторы могут выбрать размещение консенсуса вблизи источника этой ценочувствительной информации. Эта возможность позволяет сети минимизировать задержку для критически важных операций, сохраняя при этом гибкость для различных вариантов использования в разных эпохах.

4.2 Управление ключами
Протокол реализует двухуровневую систему управления ключами, которая отделяет долгосрочную идентификацию валидатора от участия в консенсусе, специфичном для зоны. Каждый валидатор поддерживает глобальную пару ключей, которая служит его корневым идентификатором в сети. Этот глобальный ключ используется для высокоуровневых операций, таких как делегирование долей, регистрация в зоне и участие в глобальном консенсусе. Глобальный ключ должен быть защищен максимально возможными мерами безопасности, поскольку он представляет собой высшие полномочия валидатора в сети.
Затем валидаторы могут делегировать полномочия подключевым ключам, специфичным для зоны, через программу реестра в цепочке. Эти подключи специально авторизованы для участия в консенсусе
в пределах назначенных зон совместного размещения. Такое разделение служит нескольким целям безопасности: оно
позволяет валидаторам поддерживать различные модели безопасности для различных типов ключей, минимизирует
раскрытие глобальных ключей, сохраняя их в автономном режиме во время нормальной работы, и снижает риск компрометации ключей при переходе физической инфраструктуры между
зонами. Делегирование ключей, специфичных для зоны, управляется через ончейн-программу, которая
ведет реестр авторизованных ключей зоны для каждого валидатора. Хотя валидаторы могут
регистрировать новые ключи зоны в любое время, используя свой глобальный ключ, эти регистрации вступают в силу только на границах эпох. Эта задержка гарантирует, что у всех участников сети будет время для проверки и регистрации новых делегированных ключей, прежде чем они станут активными в консенсусе.

4.3 Предложение и активация зоны
Новые зоны могут быть предложены через ончейн-механизм управления с использованием глобальных
ключей. Однако, чтобы обеспечить стабильность сети и дать валидаторам достаточно времени для подготовки
безопасной инфраструктуры, предлагаемые зоны имеют обязательный период задержки, прежде чем они станут
подходящими для выбора. Эта задержка, заданная как параметр протокола, должна быть достаточно длительной, чтобы
позволить валидаторам:
● Обеспечить соответствующую физическую инфраструктуру в новой зоне
● Установить безопасные системы управления ключами для нового местоположения
● Настроить и протестировать сетевую инфраструктуру
● Провести необходимые проверки безопасности нового объекта
● Установить процедуры резервного копирования и восстановления
Период задержки также служит мерой защиты от потенциальных атак, когда
злоумышленник может попытаться принудительно добиться консенсуса в зоне, где у него есть
инфраструктурные преимущества. Требуя предварительного уведомления о новых зонах, протокол
гарантирует всем валидаторам справедливую возможность установить присутствие в любой зоне,
которая может быть выбрана для консенсуса.
Только после того, как зона завершит этот период ожидания, она может быть выбрана посредством обычного
процесса голосования по зонам для будущих эпох. Такой тщательный подход к активации зоны помогает
поддерживать безопасность и стабильность сети, одновременно позволяя добавлять новые стратегические
локации по мере развития требований к сети. 4.4 Процесс голосования при выборе зоны
Выбор зон консенсуса происходит посредством механизма голосования в цепочке, который
балансирует необходимость скоординированного перемещения валидаторов с безопасностью сети. Валидаторы
должны достичь кворума в зоне совместного размещения каждой будущей эпохи в течение настраиваемого
времени кворума до перехода эпохи. На практике расписание эпох может быть
определено с некоторым опережением, так что голосование в эпоху n выбирает зону для
эпохи n + k. Голосование осуществляется через программу реестра в цепочке с использованием глобальных
ключей валидаторов, при этом право голоса взвешивается по доле. Этот процесс использует глобальные ключи, а не ключи зоны, поскольку он не чувствителен к задержке и требует максимальной безопасности.
Процесс голосования требует квалифицированного большинства веса доли для установления кворума, что гарантирует,
что небольшая группа валидаторов не сможет в одностороннем порядке принудительно изменить зону. Если валидаторам не удается достичь кворума в течение заданного периода времени, сеть автоматически переходит в режим глобального консенсуса для следующей эпохи. Этот резервный механизм обеспечивает непрерывность сети, даже если валидаторы не могут договориться о зоне совместного размещения. В течение периода голосования валидаторы сообщают как предпочтительную зону для следующей эпохи, так и целевое время блока для этой зоны. Этот совместный выбор местоположения и параметров производительности позволяет сети оптимизироваться как с учетом физических ограничений, так и с учетом производительности каждой зоны. Важно отметить, что период голосования предоставляет валидаторам время для подготовки инфраструктуры в выбранной зоне, включая прогрев ключей, специфичных для зоны, и тестирование сетевого подключения. Этот подготовительный период имеет решающее значение для поддержания стабильности сети при переходе между зонами.

4.5 Режим глобального консенсуса
Режим глобального консенсуса служит как механизмом отката, так и основополагающей функцией безопасности протокола. Хотя Fogo достигает максимальной производительности благодаря зонному
консенсусу, возможность перехода к глобальному консенсусу обеспечивает непрерывную
работу сети в неблагоприятных условиях. В режиме глобального консенсуса сеть работает с
консервативными параметрами, оптимизированными для глобально распределенной валидации: фиксированное время блока 400 мс и уменьшенный размер блока для компенсации более высоких сетевых задержек между
географически распределенными валидаторами.
Протокол переходит в режим глобального консенсуса двумя основными путями:
● Неудачный выбор зоны: если валидаторам не удается достичь кворума в зоне консенсуса следующей эпохи в течение назначенного периода голосования, сеть автоматически
переходит к глобальному консенсусу по умолчанию для этой эпохи.
● Сбой консенсуса во время выполнения: если текущая зона не может достичь финализации блока в течение
заданного периода ожидания в течение эпохи, протокол немедленно переключается
в режим глобального консенсуса на оставшуюся часть этой эпохи. Этот резервный режим является «липким»:
после срабатывания в середине эпохи сеть остается в режиме глобального консенсуса до следующего
перехода эпох, отдавая приоритет стабильности над восстановлением производительности.
В режиме глобального консенсуса валидаторы участвуют, используя назначенный ключ для глобальной
работы, который может быть или не быть одним из ключей, специфичных для зоны, и сеть
поддерживает те же правила выбора ветвления, что и консенсус на основе зоны. Хотя этот режим жертвует
сверхнизкой задержкой, достижимой в совмещенных зонах, он обеспечивает надежную основу для
непрерывности сети и демонстрирует, как Fogo поддерживает безопасность, не жертвуя
жизнеспособностью в условиях ухудшения.

5. Набор валидаторов
Для достижения высокой производительности и предотвращения злоупотреблений MEV Fogo будет использовать
специализированный набор валидаторов. Это необходимо, поскольку даже небольшая доля недостаточно обеспеченных валидирующих узлов может помешать сети достичь пределов физической производительности.
Изначально курирование будет осуществляться через Proof-of-Authority, а затем перейдет к прямому
выдаче разрешений набором валидаторов. Передавая полномочия курирования набору валидаторов,
Fogo может применять наказание на социальном уровне за злоупотребления, как и традиционная
система Proof-of-Authority, но не более централизованно, чем сила форка, которая
уже составляет 2/3 доли в традиционных сетях PoS, таких как Solana.

5.1 Размер и начальная конфигурация
Fogo поддерживает набор валидаторов с ограниченным количеством валидаторов, определяемым протоколом, с минимальным и
максимальным количеством валидаторов для обеспечения достаточной децентрализации при оптимизации
производительности сети. Начальный целевой размер будет составлять примерно 20-50 валидаторов, хотя
это ограничение реализовано как параметр протокола, который может корректироваться по мере развития сети. На этапе генезиса начальный набор валидаторов будет выбран центром генезиса, который
сохранит временные разрешения на управление составом набора валидаторов на ранних этапах развития сети.

5.2 Управление и переходы
Контроль центра генезиса над составом набора валидаторов является временным. После начального периода стабилизации сети этот контроль перейдет к самому набору валидаторов. После этого перехода для изменения состава набора валидаторов потребуется квалифицированное большинство в две трети застейканных токенов, что соответствует пороговому значению, необходимому для изменений на уровне протокола в сетях Proof-of-Stake.
Чтобы предотвратить внезапные изменения, которые могут дестабилизировать сеть, параметры протокола ограничивают
скорость смены валидаторов. В течение заданного периода времени можно заменить или удалить не более фиксированного процента набора валидаторов, который является настраиваемым параметром протокола. Это обеспечивает постепенное развитие набора валидаторов при сохранении стабильности сети. 

5.3 Требования к участию
Валидаторы должны соответствовать минимальным требованиям к делегированному стейку, чтобы иметь право на участие в
наборе валидаторов, сохраняя совместимость с экономической моделью Solana и добавляя
разрешённый компонент. Это двойное требование – достаточный стейк и одобрение набора –
гарантирует валидаторам как экономическую заинтересованность в игре, так и операционные
возможности для поддержания производительности сети.

5.4 Обоснование и управление сетью
Набор валидаторов с разрешённым доступом не оказывает существенного влияния на децентрализацию сети, поскольку в
любой сети с доказательством доли владения (PoS) квалифицированное большинство в две трети участников уже может вносить
произвольные изменения в протокол посредством разветвления. Вместо этого этот механизм предоставляет
формальную основу для набора валидаторов, чтобы обеспечить выполнение полезных сетевых действий, которые в противном случае было бы сложно закодировать в правилах протокола.
Например, возможность удаления валидаторов позволяет сети реагировать на:
● Постоянные проблемы с производительностью, которые ухудшают возможности сети
● Злоупотребление извлечением MEV, которое ухудшает удобство использования сети
● Дестабилизирующее поведение сети, которое невозможно реализовать напрямую в протоколе, например,
вымывание, но не пересылка блоков Turbine
● Другие виды поведения, которые, хотя и потенциально прибыльны для отдельных валидаторов, наносят ущерб
долгосрочной ценности сети
Этот механизм управления учитывает, что, хотя определенные виды поведения могут быть прибыльными в краткосрочной перспективе, они могут нанести ущерб долгосрочной жизнеспособности сети. Включая
набор валидаторов с весовыми коэффициентами для контроля такого поведения посредством контроля членства, Fogo
согласует стимулы валидаторов с долгосрочным состоянием сети, не ставя под угрозу
фундаментальные свойства децентрализации, присущие системам Proof-of-Stake. 6. Перспективные расширения
В то время как основные инновации Fogo сосредоточены на мультилокальном консенсусе, производительности клиента и
управлении набором валидаторов, рассматривается несколько дополнительных расширений протокола
для реализации на этапе генезиса или после запуска. Эти функции дополнительно улучшат
функциональность сети, сохраняя обратную совместимость с экосистемой Solana.

6.1 Оплата комиссии токеном SPL
Для расширения доступа к сети и улучшения пользовательского опыта Fogo потенциально
введет тип транзакции fee_payer_unsigned, который позволит выполнять транзакции
без SOL на исходном счете. Эта функция в сочетании с программой оплаты комиссий внутри сети
позволяет пользователям оплачивать комиссии за транзакции токенами SPL,
сохраняя при этом безопасность протокола и компенсацию валидаторам.
Система работает через внепротокольную торговую площадку ретранслятора, не требующую разрешения. Пользователи
создают транзакции, которые включают как предполагаемые операции, так и оплату токеном SPL
для компенсации конечному плательщику комиссии. Эти транзакции могут быть подписаны
без указания плательщика комиссии, что позволяет любой стороне завершить их, добавив свою
подпись и оплатив комиссию SOL. Этот механизм эффективно разделяет
авторизацию транзакций
от оплаты комиссии, позволяя счетам с нулевым балансом SOL взаимодействовать с
сетью, пока у них есть другие ценные активы.
Эта функция реализуется с помощью минимальных изменений протокола, требующих только
добавления нового типа транзакции и программы на цепочке для обработки компенсации ретранслятора. Система создает эффективный рынок для услуг ретрансляции транзакций, сохраняя при этом свойства безопасности базового протокола. В отличие от более сложных систем абстракции комиссий, этот подход не требует изменений в механизмах оплаты валидатора
или правилах консенсуса.

7. Заключение
Fogo представляет собой новый подход к архитектуре блокчейна, который бросает вызов традиционным
предположениям о взаимосвязи между производительностью, децентрализацией и безопасностью.
Объединяя высокопроизводительную реализацию клиента с динамическим мультилокальным консенсусом и курируемыми наборами валидаторов, протокол достигает беспрецедентной производительности, не ставя под угрозу фундаментальные свойства безопасности систем Proof-of-Stake. Возможность динамического перемещения консенсуса при сохранении географического разнообразия обеспечивает как оптимизацию производительности, так и системную устойчивость, в то время как резервные механизмы протокола гарантируют непрерывную работу в неблагоприятных условиях. Благодаря тщательному экономическому проектированию эти механизмы естественным образом возникают из стимулов валидаторов, а не из-за принудительного исполнения протокола, создавая надежную и адаптируемую систему. По мере развития технологии блокчейн инновации Fogo демонстрируют, как продуманная разработка протокола может расширить границы производительности, сохраняя при этом свойства безопасности и децентрализации, которые делают сети блокчейнов ценными.
`

// Hausa
const HAUSA_TEXT = `
Fogo: SVM Layer 1
Shafin 1.0

Abstract
Wannan takarda ta gabatar da Fogo, wani sabon salo Layer 1 blockchain protocol isar da nasara
aiki a cikin kayan sarrafawa, latency, da sarrafa cunkoso. A matsayin kari na
Solana yarjejeniya, Fogo yana kula da cikakkiyar daidaituwa a Layer na kisa na SVM, yana ba da izini
shirye-shiryen Solana da ke akwai, kayan aiki, da ababen more rayuwa don ƙaura ba tare da wata matsala ba yayin da
samun gagarumin aiki mafi girma da ƙananan latency.
Fogo yana ba da gudummawar sababbin sababbin abubuwa guda uku:
● Haɗin aiwatar da abokin ciniki bisa tsantsar Firedancer, buɗe aikin
matakan da ba za a iya samun su ta hanyar sadarwa tare da abokan ciniki a hankali ba - ciki har da Solana kanta.
● Yarjejeniya ta cikin gida da yawa tare da canza launi, cimma lokutan toshewa da latencies
mai nisa ƙasa da na kowane babban blockchain.
● Saitin ingantaccen aiki wanda ke ƙarfafa babban aiki kuma yana hana farauta
hali a matakin inganci.
Waɗannan sabbin sabbin abubuwa suna ba da fa'idar aiki mai mahimmanci yayin adana abubuwan
rarrabuwar kawuna da ƙarfi mai mahimmanci ga toshewar Layer 1.

1. Gabatarwa
Cibiyoyin sadarwar blockchain suna fuskantar ƙalubale mai gudana don daidaita aiki tare da
mulkin kai da tsaro. Blockchains na yau suna da iyakacin abubuwan da suka dace
wanda ya sa ba su dace da ayyukan kudi na duniya ba. Ethereum yana aiwatar da ƙasa da 50
ma'amaloli a sakan daya (TPS) akan layin tushe. Ko da mafi Karkasa Layer 2s rike
kasa da 1,000 TPS. Yayin da aka tsara Solana don yin aiki mafi girma, iyakancewa daga
bambancin abokin ciniki a halin yanzu yana haifar da cunkoso a 5,000 TPS. Sabanin haka, kudi na gargajiya
tsarin kamar NASDAQ, CME, da Eurex akai-akai suna aiwatar da ayyuka sama da 100,000 kowanne
na biyu.
Latency yana gabatar da wani ƙayyadaddun ƙayyadaddun ƙayyadaddun ƙa'idodin blockchain. A ciki
kasuwannin hada-hadar kudi-musamman don gano farashi akan kadarorin da ba su da tabbas — rashin jinkiri shine
muhimmanci ga ingancin kasuwa da kuma liquidity. Masu halartar kasuwar gargajiya suna aiki tare da
Ƙarshe-zuwa-ƙarshe a ma'auni na millise seconds ko sub-millise seconds. Waɗannan saurin gudu ne kawai
mai yiwuwa lokacin da mahalarta kasuwa zasu iya haɗin gwiwa tare da yanayin kisa saboda
gudun ƙuntatawar haske.
Gine-ginen blockchain na gargajiya suna amfani da saitin ingantattun rarrabawar duniya waɗanda ke aiki
ba tare da sanin ƙasa ba, ƙirƙirar ƙayyadaddun ƙayyadaddun ayyuka. Haske kanta
yana ɗaukar sama da mil 130 don kewaya duniya a ma'aunin ma'aunin zafi da sanyio, har ma da tafiya a cikin wata ƙasa.
cikakkiyar da'irar-da hanyoyin sadarwar duniya ta hakika sun ƙunshi ƙarin nesa da ababen more rayuwa
jinkiri. Waɗannan iyakoki na jiki suna haɗuwa lokacin da yarjejeniya ta buƙaci da yawa
zagayen sadarwa tsakanin masu inganci. Wadannan latencies tsakanin yankuna
lokacin da yarjejeniya ta buƙaci zagayen sadarwa da yawa tsakanin masu inganci. Saboda,
cibiyoyin sadarwa dole ne su aiwatar da lokutan toshe masu ra'ayin mazan jiya da jinkirin ƙarshe don kiyayewa
kwanciyar hankali. Ko da a ƙarƙashin ingantattun yanayi, tsarin yarda da aka rarraba a duniya
ba zai iya shawo kan waɗannan jinkirin hanyoyin sadarwa na asali ba.
Kamar yadda blockchains ke haɓaka haɓakawa tare da tsarin kuɗi na duniya, masu amfani za su buƙaci
aiki mai kwatankwacin tsarin yau da kullun. Ba tare da tsari mai kyau ba, taro
waɗannan buƙatun na iya yin tasiri sosai ga haɓaka hanyoyin sadarwar blockchain da kuma
juriya. Don magance wannan ƙalubalen, muna ba da shawarar Fogo Layer blockchain ɗaya. Fogo ta
Babban falsafar ita ce haɓaka kayan aiki da rage latency ta hanyar maɓalli biyu
Hanyoyi: na farko, ta yin amfani da software na abokin ciniki mafi ƙwaƙƙwara akan mafi kyawun rarraba
saitin mai inganci; da na biyu, rungumar yarjejeniya tare tare da kiyaye yawancin abubuwan
ribar da ake samu na samun daidaito a duniya.

2. Shaci
An rarraba takardar zuwa sassan da ke rufe manyan yanke shawara na ƙira a kusa da Fogo.
Sashe na 3 ya ƙunshi alaƙar Fogo zuwa ka'idar toshewar Solana da ta
dabarun da ya shafi inganta abokin ciniki da bambancin. Sashi na 4 ya ƙunshi mahalli da yawa
ijma'i, aiwatar da shi a aikace, da kasuwancin da yake yi dangane da duniya ko
yarjejeniya gida. Sashi na 5 ya ƙunshi tsarin Fogo don farawa da kiyayewa
saitin tabbatarwa. Sashe na 6 ya ƙunshi ƙarin abubuwan da za a iya gabatarwa bayan
asali.

3. Protocol da Abokan ciniki
A gindin tushe Fogo yana farawa da ginawa a saman mafi yawan wasan kwaikwayon da ake amfani da shi
blockchain yarjejeniya har zuwa yau, Solana. Cibiyar sadarwar Solana ta riga ta zo da yawa
mafita ingantawa, duka dangane da ƙirar yarjejeniya da aiwatar da abokin ciniki. Fogo
suna hari iyakar yiwuwar dacewa da baya tare da Solana, gami da cikakke
dacewa a Layer na kisa na SVM da kusanci kusa da TowerBFT
yarjejeniya, Turbine block yaduwa, Solana shugaban juyawa da duk sauran manyan
abubuwan da ke cikin hanyoyin sadarwar da yarjejeniya. Wannan dacewa tana bawa Fogo damar
a sauƙaƙe haɗawa da tura shirye-shiryen da ake da su, kayan aiki da abubuwan more rayuwa daga Solana
yanayin muhalli; da kuma amfana daga ci gaba da ingantawa a cikin Solana.
Koyaya, ba kamar Solana ba, Fogo zai gudana tare da abokin ciniki guda ɗaya na canonical. Wannan abokin ciniki na canonical
zai zama babban abokin ciniki mafi girma da ke gudana akan Solana. Wannan yana bawa Fogo damar
cimma gagarumin aiki mafi girma saboda hanyar sadarwa koyaushe za ta gudana a cikin
gudun abokin ciniki mafi sauri. Ganin cewa Solana, iyakance ta bambancin abokin ciniki zai kasance koyaushe
ƙugiya ta hanyar saurin abokin ciniki a hankali. Don yanzu da kuma nan gaba wannan
abokin ciniki na canonical zai dogara ne akan tarin Firedancer.

3.1 Mai kashe wuta
Firedancer shine babban aikin Solana mai dacewa da abokin ciniki na Jump Crypto,
yana nuna mafi girman aikin sarrafa ma'amala fiye da mai inganci na yanzu
abokan ciniki ta hanyar ingantattun sarrafa layi ɗaya, sarrafa ƙwaƙwalwar ajiya, da SIMD
umarnin.
Akwai nau'i biyu: "Frankendancer," matasan da ke amfani da injin sarrafa Firedancer tare da
tarawar hanyar sadarwar mai ingancin tsatsa, da cikakken aiwatar da Firedancer tare da a
sake rubuta tari na hanyar sadarwa ta C, a halin yanzu yana cikin ci gaba na ƙarshen zamani.
Dukansu nau'ikan biyu suna kiyaye daidaituwar ƙa'idar Solana yayin haɓaka aiki.
Da zarar an gama, ana sa ran aiwatar da aikin Firedancer mai tsabta zai saita sabon aiki
ma'auni, yana mai da shi manufa don manyan buƙatun kayan aiki na Fogo. Fogo zai fara da
cibiyar sadarwa ta Frankendancer sannan daga ƙarshe ta canza zuwa tsantsar Firedancer.

3.2 Canonical Client vs. Abokin ciniki Diversity
Ka'idojin Blockchain suna aiki ta hanyar software na abokin ciniki wanda ke aiwatar da ka'idojin su da
ƙayyadaddun bayanai. Yayin da ƙa'idodi ke bayyana ƙa'idodin aikin hanyar sadarwa, abokan ciniki suna fassara
waɗannan ƙayyadaddun bayanai cikin software masu aiwatarwa. Dangantaka tsakanin ladabi da
abokan ciniki a tarihi sun bi tsarin ƙira, tare da wasu cibiyoyin sadarwa suna haɓaka rayayye
bambance-bambancen abokin ciniki yayin da wasu a zahiri suka haɗu akan aiwatar da canonical.
Bambancin abokin ciniki bisa ga al'ada yana ba da dalilai da yawa: yana ba da aiwatarwa
sakewa, yana ba da damar tabbatarwa mai zaman kansa na ƙa'idodin yarjejeniya, kuma a ƙa'ida yana ragewa
kasadar rashin lafiyar software mai fa'ida. Cibiyar sadarwa ta Bitcoin tana nuna wani
abin sha'awa mai ban sha'awa - yayin da yawancin aiwatarwar abokin ciniki ke wanzu, Bitcoin Core yana aiki azaman
abokin ciniki na de facto canonical, samar da aiwatar da tunani wanda ke bayyana
m cibiyar sadarwa hali.
Koyaya, a cikin cibiyoyin sadarwar blockchain masu girma, alaƙar da ke tsakanin yarjejeniya
kuma aiwatar da abokin ciniki ya zama mafi ƙuntata. Lokacin da yarjejeniya ta kusanci
iyakoki na zahiri na kwamfuta da na'urorin sadarwar sadarwa, sarari don aiwatarwa
bambancin halitta kwangila. A waɗannan iyakoki na aiki, aiwatarwa mafi kyau
dole ne su haɗu a kan mafita iri ɗaya yayin da suke fuskantar iyakokin jiki iri ɗaya da
bukatun aiki. Duk wani muhimmin karkata daga aiwatarwa mafi kyau
alamu za su haifar da rashin aikin yi wanda zai sa abokin ciniki ba zai iya yiwuwa ba
aiki mai inganci.
Ana iya ganin wannan ƙarfin gaske a cikin cibiyoyin sadarwa masu niyya mafi ƙarancin lokutan toshewa
da matsakaicin hanyar ciniki. A irin waɗannan tsarin, fa'idodin ka'idar abokin ciniki
bambance-bambancen ya zama ƙasa da dacewa, kamar yadda babban abin da ke riƙe dacewa tsakanin
aiwatar da abokin ciniki na yau da kullun na iya zama da kansa ya zama cikas. Yaushe
tura aikin blockchain zuwa iyakoki na jiki, aiwatar da abokin ciniki dole ne
raba ainihin yanke shawara na gine-gine, yin fa'idodin tsaro na aiwatarwa
bambanta sun fi mayar msar tambayar.

3.3 Ƙwararrun Ƙarfafawa ga Abokan Ciniki
Yayin da Fogo ke ba da damar kowane aiwatar da abokin ciniki mai dacewa, tsarin gine-ginen sa ta halitta
yana ƙarfafawa ta yin amfani da mafi girman aiki da ake samu, wanda buƙatu masu amfani ke tafiyar da su
na high-performance co-located ayyuka.
Ba kamar hanyoyin sadarwa na gargajiya ba inda nisan yanki ke haifar da manyan ƙullun,
Tsarin haɗin gwiwa na Fogo yana nufin ingantaccen aiwatar da abokin ciniki yana ƙayyade kai tsaye
ingantaccen aiki. A cikin wannan mahallin, jinkirin hanyar sadarwa ba shi da ƙaranci, yin abokin ciniki
gudun m factor.
Lokacin toshewar cibiyar sadarwa da sigogin girman suna haifar da matsin tattalin arziki zuwa
ƙara yawan kayan aiki. Masu tabbatarwa dole ne su zaɓi tsakanin amfani da abokin ciniki mafi sauri ko haɗari
azabtarwa da rage kudaden shiga. Waɗanda ke tafiyar da a hankali abokan ciniki ko dai suna haɗarin ɓarna ta hanyar
jefa kuri'a don ma'auni masu tayar da hankali ko rasa kudaden shiga ta hanyar jefa kuri'a ga masu ra'ayin mazan jiya.
Wannan yana haifar da zaɓi na halitta don ingantaccen aiwatar da abokin ciniki. A cikin Fogo
mahalli tare, har ma da ƙananan ayyukan aiki sun zama mahimmanci - a
dan kadan a hankali abokin ciniki zai ci gaba da yin ƙasa da ƙasa, yana haifar da ɓangarorin da aka rasa kuma
hukunci. Wannan haɓakawa yana faruwa ta hanyar mai tabbatar da son kai, ba ƙa'idodin ƙa'ida ba.
Yayin da zaɓin abokin ciniki ba za a iya aiwatar da shi kai tsaye ta hanyar yarjejeniya ba, matsin tattalin arziki a zahiri
fitar da hanyar sadarwa zuwa ga mafi inganci aiwatarwa yayin da ake ci gaba da yin gasa
ci gaban abokin ciniki.

4. Yarjejeniya ta Yankuna da yawa
Multi-local yarjejeniya wakiltar wani sabon tsarin kula da blockchain yarjejeniya cewa
da ƙarfi yana daidaita fa'idodin aikin haɗin gwiwa tare da tsaro
abũbuwan amfãni na yanki rarraba. Tsarin yana ba masu inganci damar daidaita su
wurare na zahiri a cikin zamanin zamani yayin da ake kiyaye keɓantattun bayanan sirri don
yankuna daban-daban, suna ba da damar hanyar sadarwa don cimma yarjejeniya mara ƙarancin ƙarancin lokaci
aiki na yau da kullun yayin kiyaye ikon komawa zuwa yarjejeniya ta duniya lokacin
ake bukata.
Samfurin ijma'i na gida da yawa na Fogo yana jawo wahayi daga kafaffen ayyuka a cikin
kasuwannin hada-hadar kudi na gargajiya, musamman tsarin kasuwancin “bi rana” da ake amfani da shi a kasashen waje
musayar da sauran kasuwannin duniya. A cikin kuɗin gargajiya, yin kasuwa da kuma yawan kuɗi
tanadi yana ƙaura ta halitta tsakanin manyan cibiyoyin kuɗi yayin da ranar ciniki ke ci gaba
- daga Asiya zuwa Turai zuwa Arewacin Amurka - ba da izinin ci gaba da aiki na kasuwa yayin
kiyaye yawan ruwa a cikin takamaiman yankuna na yanki. Wannan samfurin ya tabbatar
m a gargajiya kudi domin ya gane cewa yayin da kasuwanni ne na duniya, da
gazawar jiki na sadarwar sadarwar da lokutan amsawar ɗan adam suna yin ɗan matakin
Matsayin yanki mai mahimmanci don mafi kyawun gano farashi da ingantaccen kasuwa.

4.1 Yankuna da Juyawar Yanki
Yanki yana wakiltar yanki na yanki inda masu haɓakawa ke haɗuwa don cimma mafi kyau
aiki yarjejeniya. Da kyau, yanki shine cibiyar bayanai guda ɗaya inda latency cibiyar sadarwa
tsakanin masu tabbatarwa suna fuskantar iyakokin hardware. Koyaya, yankuna na iya fadada zuwa
kewaye yankuna mafi girma idan ya cancanta, musayar wasu ayyuka don aiki
la'akari. Haƙiƙanin ma'anar yanki yana fitowa ta hanyar ijma'in zamantakewa tsakanin
masu inganci maimakon a fayyace su sosai a cikin yarjejeniya. Wannan sassauci yana ba da damar
hanyar sadarwa don daidaitawa zuwa ƙaƙƙarfan abubuwan more rayuwa na gaske yayin da ake ci gaba da aiki
manufofi.
Ƙarfin hanyar sadarwar don juyawa tsakanin yankuna yana yin amfani da dalilai masu mahimmanci da yawa:
1. Rarraba Hukunce-hukunce: Juyawan yanki na yau da kullun yana hana kamawa
ijma'i ta kowace hukuma guda. Wannan yana kiyaye juriyar hanyar sadarwa zuwa
matsin lamba na tsari da kuma tabbatar da cewa babu wata gwamnati ko hukuma da za ta iya aiwatarwa
iko na dogon lokaci akan aikin cibiyar sadarwa.
2. Resilience Infrastructure: Cibiyoyin bayanai da kayan aikin yanki na iya kasawa don
dalilai masu yawa - bala'o'i, katsewar wutar lantarki, batutuwan sadarwar, hardware
kasawa, ko bukatun kiyayewa. Juyawar yanki yana tabbatar da cewa hanyar sadarwa ba ta wanzu
dogara har abada ga kowane batu na gazawa. Misalai na tarihi na manyan
katsewar cibiyar bayanai, kamar waɗanda ke haifar da mummunan yanayin yanayi ko grid ɗin wuta
kasawa, nuna mahimmancin wannan sassauci.
3. Haɓaka Ayyukan Dabaru: Za'a iya zaɓar yankuna don ingantawa
takamaiman ayyukan cibiyar sadarwa. Alal misali, a lokacin zamanin da ke ɗauke da mahimmanci
al'amuran kudi (kamar sanarwar Tarayyar Tarayya, manyan tattalin arziki
rahotanni, ko kasuwa ya buɗe), masu inganci za su iya zaɓar su nemo yarjejeniya kusa da
tushen wannan bayanin mai saurin farashi. Wannan damar tana ba da damar hanyar sadarwa
rage jinkiri don ayyuka masu mahimmanci yayin da suke riƙe da sassauci don amfani na yau da kullun
lokuta a fadin zamani.

4.2 Mahimmin Gudanarwa
Yarjejeniyar tana aiwatar da tsarin sarrafa maɓalli mai hawa biyu wanda ke raba dogon lokaci
tabbatarwa ainihi daga yanki na musamman na ijma'i. Kowane mai tabbatarwa yana kiyaye a
maɓalli na duniya waɗanda ke aiki azaman tushen asalinsu a cikin hanyar sadarwa. Ana amfani da wannan maɓalli na duniya don
ayyuka masu girma kamar wakilan hannun jari, rajistar yanki, da shiga cikin
yarjejeniya ta duniya. Ya kamata a kiyaye maɓalli na duniya tare da mafi girman tsaro mai yuwuwa
matakan, kamar yadda yake wakiltar ikon ƙarshe na mai inganci a cikin hanyar sadarwa.
Masu tabbatarwa za su iya ba da izini ga takamaiman maɓallan yanki ta hanyar sarkar
shirin yin rajista. Waɗannan ƙananan maɓallan an ba su izini musamman don halartar yarjejeniya
a cikin yankunan haɗin gwiwa da aka keɓance. Wannan rabuwa tana yin amfani da dalilai na tsaro da yawa: shi
yana ba masu inganci damar kiyaye samfuran tsaro daban-daban don nau'ikan maɓalli daban-daban, yana rage girmansa
fallasa maɓallan duniya ta hanyar ajiye su oline yayin aiki na yau da kullun, da shi
yana rage haɗarin maɓalli na sasantawa yayin sauye-sauyen abubuwan more rayuwa na zahiri tsakanin
yankuna.
Ana gudanar da tawaga na takamaiman maɓallan yanki ta hanyar shirin kan sarkar wanda
yana kiyaye rajista na maɓallan yanki masu izini ga kowane mai inganci. Yayin da masu tabbatarwa zasu iya
yi rijistar sabbin maɓallan yanki a kowane lokaci ta amfani da maɓallinsu na duniya, waɗannan rajistar suna ɗauka ne kawai
a cikin iyakokin zamanin zamani. Wannan jinkirin yana tabbatar da cewa duk mahalarta cibiyar sadarwa suna da lokacin zuwa
tabbatar da yin rikodin sabbin wakilai masu mahimmanci kafin su fara aiki cikin yarjejeniya.

4.3 Shawarar Yanki da Kunnawa
Ana iya samar da sabbin yankuna ta hanyar tsarin gudanarwa ta hanyar amfani da duniya
makullai. Koyaya, don tabbatar da kwanciyar hankali na cibiyar sadarwa da ba masu inganci isasshen lokaci don shiryawa
amintattun ababen more rayuwa, yankunan da aka tsara suna da lokacin jinkiri na wajibi kafin su zama
cancantar zaɓi. Wannan jinkirin, wanda aka saita azaman ma'auni, dole ne ya yi tsayi sosai
ba da izini ga masu tabbatarwa:
● Tabbatar da kayan aikin jiki masu dacewa a cikin sabon yanki
● Kafa amintattun tsarin sarrafa maɓalli don sabon wurin
● Saita da gwada kayan aikin sadarwar
● Yi bincike mai mahimmanci na tsaro na sabon wurin
● Kafa hanyoyin wariyar ajiya da dawo da su
Lokacin jinkiri kuma yana aiki azaman matakan tsaro akan yuwuwar harin inda a
miyagu na iya ƙoƙarin tilasta yarjejeniya cikin yankin da suke da shi
ababen more rayuwa. Ta hanyar buƙatar sanarwar gaba don sababbin yankuna, yarjejeniya
yana tabbatar da cewa duk masu fa'ida suna da damar da za su iya tabbatar da kasancewarsu a kowane yanki wanda
za a iya zaɓa don yarjejeniya.
Sai bayan yanki ya kammala wannan lokacin jira za a iya zaɓar ta ta hanyar yau da kullun
Tsarin zaɓen yanki na zamani na gaba. Wannan hanya mai hankali don kunna yankin yana taimakawa
kiyaye tsaro na cibiyar sadarwa da kwanciyar hankali yayin da har yanzu ba da izinin ƙarin sabbin dabaru
wurare yayin da buƙatun cibiyar sadarwa ke tasowa.

4.4 Tsarin Zaɓen Yanki
Zaɓin yankunan yarjejeniya yana faruwa ne ta hanyar tsarin kada kuri'a a kan sarkar wanda
yana daidaita buƙatar haɗin gwiwar motsi mai inganci tare da tsaro na cibiyar sadarwa. Masu tabbatarwa
dole ne a sami adadin ƙididdiga a kowane yanki na haɗin gwiwa na zamani na gaba a cikin daidaitacce
lokacin ƙuruciya kafin canjin zamanin. A aikace, jadawalin zamanin na iya zama
An ƙaddara tare da wasu lokacin jagora, kamar cewa zaɓe a lokacin zamanin n yana zaɓar yankin don
zamanin n +k. Ana kada kuri'a ta hanyar tsarin yin rajista ta hanyar amfani da masu inganci na duniya
maɓallai, tare da ma'aunin ikon jefa ƙuri'a ta hanyar gungumen azaba. Wannan tsari yana amfani da maɓallan duniya maimakon yanki
maɓallai tunda ba latency ba ne kuma yana buƙatar matsakaicin tsaro.
Tsarin jefa ƙuri'a yana buƙatar mafi girman nauyin hannun jari don tabbatar da ƙima, tabbatarwa
cewa ƙaramin rukuni na masu inganci ba za su iya tilasta canjin yanki gaba ɗaya ba. Idan masu tabbatarwa sun kasa
cim ma ƙima a cikin ƙayyadaddun lokaci, hanyar sadarwar ta ɓace ta atomatik zuwa
Yanayin yarjejeniya na duniya don zamani na gaba. Wannan tsarin koma baya yana tabbatar da hanyar sadarwa
ci gaba ko da a lokacin da masu inganci ba za su iya yarda kan yankin haɗin gwiwa ba.
A lokacin zaɓe, masu inganci suna yin alama ga yankin da suka fi so na zamani na gaba
da manufar toshe lokacin wannan yanki. Wannan zaɓin haɗin gwiwa na wuri da aiki
sigogi suna ba da damar cibiyar sadarwa don ingantawa duka biyun ƙuntatawar jiki da aiki
iyawar kowane yanki. Mahimmanci, lokacin jefa ƙuri'a yana ba da lokaci don ingantawa
shirya abubuwan more rayuwa a cikin yankin da aka zaɓa, gami da dumama takamaiman maɓallan yanki da
gwada haɗin yanar gizo. Wannan lokacin shiri yana da mahimmanci don kiyaye hanyar sadarwa
kwanciyar hankali yayin canjin yanki.

4.5 Yanayin Yarjejeniyar Duniya
Yanayin yarjejeniya na duniya yana aiki azaman tsarin koma baya da aminci na tushe
fasali na yarjejeniya. Yayin da Fogo ke samun mafi girman aikinsa ta hanyar tushen yanki
ijma'i, ikon komawa zuwa yarjejeniya ta duniya yana tabbatar da ci gaba da hanyar sadarwa
aiki a ƙarƙashin yanayi mara kyau. A cikin yanayin yarjejeniya ta duniya, hanyar sadarwar tana aiki tare da
sigogi masu ra'ayin mazan jiya waɗanda aka inganta don ingantaccen rarrabawar duniya: ƙayyadadden toshe 400ms
lokaci da rage girman toshe don ɗaukar manyan latencies na cibiyar sadarwa tsakanin
tarwatsa masu inganci a yanayin ƙasa.
Yarjejeniyar tana shiga yanayin yarjejeniya ta duniya ta hanyoyi biyu na farko:
Zaɓin Yanki da Ba a yi nasara ba: Idan masu inganci sun kasa cimma adadin ƙididdiga na zamani na gaba
yankin yarjejeniya tsakanin lokacin da aka keɓe, cibiyar sadarwa ta atomatik
rashin daidaituwa ga yarjejeniya ta duniya don wancan zamanin.
● Kasawar Yarjejeniyar Runtime: Idan yankin na yanzu ya kasa cimma nasarar toshewa a ciki
lokacin da aka ayyana lokacin kayyade lokacinsa, ƙa'idar ta canza nan da nan
zuwa yanayin ijma'i na duniya na sauran zamanin. Wannan koma baya yana "mai ɗaure" -
da zarar ya haifar da tsakiyar zamani, hanyar sadarwar ta kasance cikin yarjejeniya ta duniya har zuwa na gaba
canjin zamani, yana ba da fifikon kwanciyar hankali akan dawo da aiki.
A cikin yanayin yarjejeniya ta duniya, masu inganci suna shiga ta amfani da maɓalli da aka keɓance don duniya
aiki, wanda maiyuwa ko bazai zama ɗaya daga cikin takamaiman maɓallan yankin su ba, da kuma hanyar sadarwa
yana kiyaye ƙa'idodin zaɓin cokali mai yatsa iri ɗaya kamar yarjejeniya ta tushen yanki. Duk da yake wannan yanayin yana sadaukarwa
rashin jinkirin da ake iya samu a yankunan da ke tare, yana ba da tushe mai ƙarfi ga
ci gaban cibiyar sadarwa da nuna yadda Fogo ke kiyaye aminci ba tare da sadaukarwa ba
rayuwa a ƙarƙashin gurɓataccen yanayi.

5. Saitin Tabbatarwa
Don cimma babban aiki da rage munanan ayyuka na MEV, Fogo zai yi amfani da a
saitin ingantacce. Wannan ya zama dole saboda ko da ɗan ƙaramin juzu'i na ƙarancin samarwa
ingantattun nodes na iya hana hanyar sadarwa ta kai ga iyakan aikinta na zahiri.
Da farko, curation zai yi aiki ta hanyar tabbatar da izini kafin canzawa zuwa kai tsaye
izini daga saitin mai inganci. Ta hanyar sanya ikon sarrafawa tare da saitin ingantacce,
Fogo na iya aiwatar da hukuncin zaman jama'a na zagi kamar na gargajiya
tsarin tabbatarwa, amma ta hanyar da ba ta da ƙarfi fiye da ikon cokali mai yatsa wanda
2/3 na hannun jari ya riga ya riƙe a cikin hanyoyin sadarwar PoS na gargajiya kamar Solana.

5.1 Girma da Tsarin Farko
Fogo yana kula da saitin ingantacciyar izini tare da mafi ƙarancin aiwatar da yarjejeniya da
matsakaicin adadin masu inganci don tabbatar da ingantacciyar rarrabawa yayin ingantawa don
aikin cibiyar sadarwa. Girman maƙasudin farko zai kasance kusan masu inganci 20-50, kodayake
Ana aiwatar da wannan hula a matsayin siga na yarjejeniya wanda za'a iya daidaita shi azaman hanyar sadarwa
balagagge. A genesis, za a zaɓi saitin mai inganci na farko ta wata hukuma ta asali, wanda
zai riƙe izini na wucin gadi don sarrafa abun da aka saita mai inganci yayin lokacin
matakan farko na cibiyar sadarwa.

5.2 Mulki da Sauye-sauye
An tsara ikon ikon genesis akan saitin memba na mai inganci don zama
wucin gadi. Bayan farkon lokacin daidaita hanyar sadarwa, wannan ikon zai canza zuwa
mai inganci saita kanta. Bayan wannan canji, canje-canje ga saitin memba na mai inganci zai
na buƙatar kashi biyu bisa uku na manyan alamomin da aka haɗa, wanda ya yi daidai da kofa ɗaya
da ake buƙata don sauye-sauyen matakin ƙa'idodin ƙa'ida a cikin hanyoyin sadarwar shaida.
Don hana canje-canje kwatsam waɗanda zasu iya lalata hanyar sadarwa, ƙayyadaddun ƙa'idodin ƙa'ida
madaidaitan juzu'i. Ba zai iya zama sama da ƙayyadadden adadin saitin mai inganci ba
maye gurbin ko fitar da shi a cikin wani lokacin da aka ba da shi, inda wannan kashi ya kasance ƙa'idar daidaitawa
siga. Wannan yana tabbatar da juyin halitta a hankali na saitin mai inganci yayin kiyaye hanyar sadarwa
kwanciyar hankali.

5.3 Bukatun Shiga
Masu tabbatarwa dole ne su cika mafi ƙarancin buƙatun hannun jari don su cancanci shiga
saitin tabbatarwa, kiyaye dacewa tare da tsarin tattalin arzikin Solana yayin ƙarawa
bangaren izini. Wannan buƙatu biyu - isasshiyar hannun jari da saita yarda -
yana tabbatar da cewa masu inganci suna da fata na tattalin arziki a cikin wasan da kuma aiki
iyawa don kula da aikin cibiyar sadarwa.

5.4 Hankali da Gudanarwar Sadarwa
Saitin mai inganci da aka ba da izini ba ya yin tasiri da zahirin rarraba cibiyar sadarwa, kamar a cikin
kowace hanyar sadarwa ta tabbatar da hannun jari, kashi biyu bisa uku na babban rabo na iya riga ya fara aiki
canje-canje na sabani ga yarjejeniya ta hanyar cokali mai yatsa. Maimakon haka, wannan tsarin yana ba da a
tsari na yau da kullun don saita mai inganci don aiwatar da halayen cibiyar sadarwa masu fa'ida waɗanda zasu iya
in ba haka ba, yi la'akari don yin rikodin a cikin ƙa'idodin ladabi.
Misali, ikon fitar da masu inganci yana bawa cibiyar sadarwa damar amsawa:
● Matsalolin aiki na dindindin waɗanda ke lalata ƙarfin cibiyar sadarwa
● Zagin MEV wanda ke lalata amfani da hanyar sadarwa
● Hali na lalata hanyar sadarwa wanda ba za a iya aiwatar da shi kai tsaye a cikin yarjejeniya ba, kamar
leaching amma ba tura Turbine tubalan
● Wasu ɗabi'un da, yayin da suke iya samun riba ga masu tabbatar da daidaikun mutane, suna cutar da su
ƙimar cibiyar sadarwa ta dogon lokaci
Wannan tsarin mulki yana gane cewa yayin da wasu halaye na iya samun riba a ciki
na ɗan gajeren lokaci, za su iya lalata dawwama na dogon lokaci na hanyar sadarwa. Ta hanyar kunna
Ingantacciyar ma'auni mai nauyi saita ga 'yan sanda irin waɗannan halayen ta hanyar sarrafa membobinsu, Fogo
daidaita abubuwan ƙarfafawa masu inganci tare da lafiyar dogon lokaci na hanyar sadarwa ba tare da yin lahani ba
mahimman kaddarorin rarrabawa waɗanda ke tattare da tsarin tabbatar da hannun jari.

6. Tsare-tsare masu yiwuwa
Yayin da ainihin sabbin abubuwan da Fogo ke mayar da hankali kan haɗin kai tsakanin yankuna da yawa, aikin abokin ciniki, da
sarrafa saitin mai tabbatarwa, ana yin la'akari da ƙarin ƙarin ƙarin ƙa'idodi
don ko dai genesis ko aiwatarwa bayan ƙaddamarwa. Waɗannan fasalulluka za su ƙara haɓaka
ayyukan cibiyar sadarwa yayin da ake kiyaye dacewa da baya tare da Solana
yanayin muhalli.

Biyan Kuɗi na Token SPL 6.1
Don ba da damar shiga cibiyar sadarwa mai faɗi da haɓaka ƙwarewar mai amfani, Fogo zai yuwu
gabatar da nau'in ciniki na fee_payer_un sa hannu wanda ke ba da damar yin ciniki
ba tare da SOL a cikin asusun asali ba. Wannan fasalin, haɗe tare da kuɗin kan-sarkar
shirin biyan kuɗi, yana bawa masu amfani damar biyan kuɗin ma'amala ta amfani da alamun SPL yayin
kiyaye tsaro na yarjejeniya da diyya mai inganci.
Tsarin yana aiki ta hanyar kasuwan mai ba da izini mara izini mara izini. Masu amfani
gina ma'amaloli waɗanda suka haɗa da ayyukan da aka nufa da su da alamar SPL
biya don rama mai biyan kuɗi na ƙarshe. Ana iya sanya hannu kan waɗannan ma'amaloli da inganci
ba tare da tantance mai biyan kuɗi ba, ba da damar kowane ɓangare ya kammala su ta hanyar ƙara nasu
sa hannu da biyan kuɗin SOL. Wannan tsarin yana raba ciniki sosai
izini daga biyan kuɗi, ba da damar asusu tare da ma'auni na SOL don yin hulɗa da su
hanyar sadarwa matukar sun mallaki wasu kadarori masu kima.
Ana aiwatar da wannan fasalin ta hanyar ƙaramin gyare-gyaren yarjejeniya, yana buƙatar kawai
ƙari na sabon nau'in ma'amala da shirin kan-sarkar don sarrafa relayer
diyya. Tsarin yana haifar da ingantacciyar kasuwa don sabis na isar da ma'amala yayin
kiyaye kaddarorin tsaro na ƙa'idar ƙa'idar. Sabanin ƙarin hadaddun kuɗi
tsarin abstraction, wannan hanyar ba ta buƙatar canje-canje ga ingantattun hanyoyin biyan kuɗi
ko dokokin yarjejeniya.

7. Kammalawa
Fogo yana wakiltar wata sabuwar hanya ce ta gine-ginen blockchain wacce ke ƙalubalantar gargajiya
zato game da alakar da ke tsakanin aiki, rarrabawa, da tsaro.
Ta hanyar haɗa babban aiwatar da abokin ciniki tare da ɗimbin yawa na gida mai ƙarfi
yarjejeniya da gyare-gyaren ingantattun saiti, ƙa'idar ta cimma aikin da ba a taɓa yin irinsa ba
ba tare da ɓata mahimman abubuwan tsaro na tsarin tabbatar da hannun jari ba. The
iyawa don ƙaura ra'ayi a hankali yayin kiyaye bambancin yanki yana samarwa
duka inganta aikin da juriya na tsari, yayin da ka'idar ta koma baya
hanyoyin tabbatar da ci gaba da aiki a ƙarƙashin yanayi mara kyau.
Ta hanyar ƙirƙira tattalin arziƙi a hankali, waɗannan hanyoyin suna fitowa ta halitta daga masu inganci
abubuwan ƙarfafawa maimakon ta hanyar aiwatar da yarjejeniya, ƙirƙirar ƙarfi da daidaitawa
tsarin. Kamar yadda fasahar blockchain ke ci gaba da haɓakawa, sabbin abubuwan da Fogo ke nunawa
yadda tsarin ƙira mai tunani zai iya tura iyakokin aiki yayin
kiyaye tsaro da kaddarorin rarrabawa waɗanda ke yin hanyoyin sadarwar blockchain
m.
`

// Spanish
const SPANISH_TEXT = `
Fogo: Una SVM de Capa 1 de Alto Rendimiento
Versión 1.0

Resumen
Este artículo presenta Fogo, un novedoso protocolo de blockchain de capa 1 que ofrece un rendimiento excepcional en rendimiento, latencia y gestión de la congestión. Como extensión del protocolo Solana, Fogo mantiene total compatibilidad en la capa de ejecución de la SVM, lo que permite que los programas, herramientas e infraestructura de Solana existentes migren sin problemas, a la vez que se logra un rendimiento significativamente mayor y una latencia menor.
Fogo aporta tres innovaciones:
● Una implementación de cliente unificada basada en Firedancer puro, que alcanza niveles de rendimiento inalcanzables para redes con clientes más lentos, incluyendo la propia Solana.
● Consenso multilocal con coubicación dinámica, que logra tiempos de bloque y latencias muy inferiores a los de cualquier blockchain principal.
● Un conjunto de validadores seleccionados que incentiva el alto rendimiento y disuade el comportamiento predatorio a nivel de validador. Estas innovaciones ofrecen mejoras sustanciales en el rendimiento, a la vez que preservan la descentralización y la robustez esenciales para una blockchain de capa

1. Introducción
Las redes blockchain se enfrentan al desafío constante de equilibrar el rendimiento con la descentralización y la seguridad. Las blockchains actuales sufren graves limitaciones de rendimiento que las hacen inadecuadas para la actividad financiera global. Ethereum procesa menos de 50 transacciones por segundo (TPS) en su capa base. Incluso las blockchains de capa 2 más centralizadas gestionan menos de 1000 TPS. Si bien Solana fue diseñado para un mayor rendimiento, las limitaciones derivadas de la diversidad de clientes actualmente causan congestión a 5000 TPS. En contraste, los sistemas financieros tradicionales como NASDAQ, CME y Eurex procesan regularmente más de 100 000 operaciones por segundo.
La latencia representa otra limitación crítica para los protocolos de blockchain descentralizados. En los mercados financieros, especialmente para el descubrimiento de precios de activos volátiles, una baja latencia es esencial para la calidad y la liquidez del mercado. Los participantes tradicionales del mercado operan con latencias de extremo a extremo en escalas de milisegundos o submilisegundos. Estas velocidades solo se alcanzan cuando los participantes del mercado pueden coubicarse con el entorno de ejecución debido a las limitaciones de la velocidad de la luz.
Las arquitecturas tradicionales de blockchain utilizan conjuntos de validadores distribuidos globalmente que operan sin conocimiento geográfico, lo que genera limitaciones fundamentales de rendimiento. La propia luz tarda más de 130 milisegundos en circunnavegar el globo por el ecuador, incluso viajando en un círculo perfecto, y las rutas de red del mundo real implican distancia adicional y retrasos de infraestructura. Estas limitaciones físicas se agravan cuando el consenso requiere múltiples rondas de comunicación entre validadores. Estas latencias interregionales se agravan cuando el consenso requiere múltiples rondas de comunicación entre validadores. Como resultado, las redes deben implementar tiempos de bloque y retrasos de finalización conservadores para mantener la estabilidad. Incluso en condiciones óptimas, un mecanismo de consenso distribuido globalmente no puede superar estos retrasos básicos de red.
A medida que las blockchains se integran más con el sistema financiero global, los usuarios exigirán un rendimiento comparable al de los sistemas centralizados actuales. Sin un diseño cuidadoso, satisfacer estas demandas podría comprometer significativamente la descentralización y la resiliencia de las redes blockchain. Para abordar este desafío, proponemos la blockchain de capa uno de Fogo. La filosofía central de Fogo es maximizar el rendimiento y minimizar la latencia mediante dos enfoques clave: primero, utilizar el software de cliente de mayor rendimiento en un conjunto de validadores óptimamente descentralizado; y segundo, adoptar el consenso coubicado, preservando la mayoría de los beneficios de descentralización del consenso global.

2. Resumen
El documento se divide en secciones que abarcan las principales decisiones de diseño en torno a Fogo.
La sección 3 aborda la relación de Fogo con el protocolo blockchain de Solana y su estrategia en cuanto a la optimización y diversidad de clientes. La sección 4 aborda el consenso multilocal, su implementación práctica y las transacciones que realiza en relación con el consenso global o local. La sección 5 aborda el enfoque de Fogo para la inicialización y el mantenimiento del conjunto de validadores. La sección 6 aborda las posibles extensiones que se puedan introducir tras su génesis.

3. Protocolo y clientes
En la capa base, Fogo comienza a construir sobre Solana, el protocolo blockchain de mayor rendimiento y ampliamente utilizado hasta la fecha. La red Solana ya incluye numerosas soluciones de optimización, tanto en términos de diseño de protocolo como de implementación de clientes. Fogo busca la máxima compatibilidad con Solana, incluyendo compatibilidad total en la capa de ejecución de SVM y una estrecha compatibilidad con el consenso TowerBFT, la propagación de bloques Turbine, la rotación de líderes de Solana y todos los demás componentes principales de las capas de red y consenso. Esta compatibilidad permite a Fogo integrar e implementar fácilmente los programas, herramientas e infraestructura existentes del ecosistema Solana, así como beneficiarse de las continuas mejoras ascendentes de Solana.
Sin embargo, a diferencia de Solana, Fogo se ejecutará con un único cliente canónico. Este cliente canónico será el cliente principal de mayor rendimiento que se ejecute en Solana. Esto permite a Fogo lograr un rendimiento significativamente mayor, ya que la red siempre se ejecutará a la velocidad del cliente más rápido. Mientras que Solana, limitada por la diversidad de clientes, siempre se verá limitada por la velocidad del cliente más lento. Por ahora y en el futuro previsible, este cliente canónico se basará en la pila Firedancer.

3.1 Firedancer
Firedancer es la implementación de cliente de alto rendimiento de Jump Crypto, compatible con Solana, que muestra un rendimiento de procesamiento de transacciones sustancialmente mayor que el de los clientes validadores actuales gracias al procesamiento paralelo optimizado, la gestión de memoria y las instrucciones SIMD.
Existen dos versiones: "Frankendancer", un híbrido que utiliza el motor de procesamiento de Firedancer con la pila de red del validador Rust, y la implementación completa de Firedancer con una reescritura completa de la pila de red en C, actualmente en fase avanzada de desarrollo.
Ambas versiones mantienen la compatibilidad con el protocolo Solana a la vez que maximizan el rendimiento.
Una vez completada, se espera que la implementación pura de Firedancer establezca nuevos estándares de rendimiento, lo que la hace ideal para los requisitos de alto rendimiento de Fogo. Fogo comenzará con una red basada en Frankendancer y luego, eventualmente, realizará la transición a Firedancer puro.

3.2 Clientes Canónicos vs. Diversidad de Clientes
Los protocolos blockchain operan mediante software cliente que implementa sus reglas y especificaciones. Mientras que los protocolos definen las reglas de operación de la red, los clientes traducen estas especificaciones en software ejecutable. La relación entre protocolos y clientes ha seguido históricamente diferentes modelos: algunas redes promueven activamente la diversidad de clientes, mientras que otras convergen naturalmente en implementaciones canónicas.
La diversidad de clientes tradicionalmente cumple múltiples propósitos: proporciona redundancia de implementación, permite la verificación independiente de las reglas del protocolo y, en teoría, reduce el riesgo de vulnerabilidades de software en toda la red. La red Bitcoin demuestra un precedente interesante: si bien existen múltiples implementaciones de clientes, Bitcoin Core actúa como el cliente canónico de facto, proporcionando la implementación de referencia que define el comportamiento práctico de la red.
Sin embargo, en redes blockchain de alto rendimiento, la relación entre el protocolo y la implementación del cliente se vuelve más limitada. Cuando un protocolo se acerca a los límites físicos del hardware informático y de red, el espacio para la diversidad de implementación se reduce naturalmente. En estos límites de rendimiento, las implementaciones óptimas deben converger en soluciones similares, ya que enfrentan las mismas limitaciones físicas y requisitos de rendimiento. Cualquier desviación significativa de los patrones de implementación óptimos resultaría en una degradación del rendimiento que haría que el cliente no fuera viable para la operación del validador. Esta dinámica es particularmente visible en redes que buscan minimizar los tiempos de bloque posibles y maximizar el rendimiento de las transacciones. En estos sistemas, los beneficios teóricos de la diversidad de clientes pierden relevancia, ya que la sobrecarga de mantener la compatibilidad entre diferentes implementaciones de clientes puede convertirse en un cuello de botella en el rendimiento. Al llevar el rendimiento de la cadena de bloques a límites físicos, las implementaciones de clientes necesariamente compartirán decisiones arquitectónicas fundamentales, lo que hace que los beneficios de seguridad de la diversidad de implementaciones sean en gran medida teóricos.

3.3 Incentivos de Protocolo para Clientes de Alto Rendimiento
Si bien Fogo permite la implementación de cualquier cliente conforme, su arquitectura incentiva naturalmente el uso del cliente de mayor rendimiento disponible, impulsado por las exigencias prácticas de las operaciones coubicadas de alto rendimiento.
A diferencia de las redes tradicionales, donde la distancia geográfica crea los principales cuellos de botella, el diseño coubicado de Fogo implica que la eficiencia de la implementación del cliente determina directamente el rendimiento del validador. En este entorno, la latencia de la red es mínima, lo que convierte la velocidad del cliente en un factor crítico.
Los parámetros dinámicos de tiempo y tamaño de bloque de la red generan presión económica para maximizar el rendimiento. Los validadores deben elegir entre usar el cliente más rápido o arriesgarse a penalizaciones y una reducción de ingresos. Quienes utilizan clientes más lentos corren el riesgo de perder bloques al optar por parámetros agresivos o de perder ingresos al optar por parámetros conservadores.
Esto crea una selección natural para la implementación del cliente más eficiente. En el entorno de coubicación de Fogo, incluso las pequeñas diferencias de rendimiento se vuelven significativas: un cliente ligeramente más lento tendrá un rendimiento inferior al esperado, lo que provocará la pérdida de bloques y penalizaciones. Esta optimización se produce por interés propio del validador, no por las reglas del protocolo.
Si bien la elección del cliente no puede ser impuesta directamente por el protocolo, las presiones económicas impulsan naturalmente a la red hacia la implementación más eficiente, manteniendo al mismo tiempo un desarrollo competitivo de clientes.

4. Consenso Multilocal
El consenso multilocal representa un enfoque novedoso para el consenso en blockchain que equilibra dinámicamente las ventajas de rendimiento de la coubicación del validador con las ventajas de seguridad de la distribución geográfica. El sistema permite a los validadores coordinar sus ubicaciones físicas en diferentes épocas, manteniendo identidades criptográficas distintas para las diferentes zonas, lo que permite a la red lograr un consenso de latencia ultrabaja durante el funcionamiento normal, preservando al mismo tiempo la capacidad de recurrir al consenso global cuando sea necesario. El modelo de consenso multilocal de Fogo se inspira en las prácticas establecidas en los mercados financieros tradicionales, en particular el modelo de negociación "seguir el sol" utilizado en divisas y otros mercados globales. En las finanzas tradicionales, la creación de mercado y la provisión de liquidez migran naturalmente entre los principales centros financieros a medida que avanza la jornada bursátil, de Asia a Europa y a Norteamérica, lo que permite una operación continua del mercado y, al mismo tiempo, mantiene la liquidez concentrada en regiones geográficas específicas. Este modelo ha demostrado ser eficaz en las finanzas tradicionales porque reconoce que, si bien los mercados son globales, las limitaciones físicas de las redes y los tiempos de reacción humana hacen necesario cierto grado de concentración geográfica para un descubrimiento óptimo de precios y la eficiencia del mercado.

4.1 Zonas y rotación de zonas
Una zona representa un área geográfica donde los validadores se ubican conjuntamente para lograr un rendimiento de consenso óptimo. Idealmente, una zona es un único centro de datos donde la latencia de red entre validadores se acerca a los límites del hardware. Sin embargo, las zonas pueden expandirse para abarcar regiones más grandes cuando sea necesario, sacrificando parte del rendimiento por consideraciones prácticas. La definición exacta de una zona surge del consenso social entre los validadores, en lugar de estar estrictamente definida en el protocolo. Esta flexibilidad permite que la red se adapte a las limitaciones reales de la infraestructura, manteniendo al mismo tiempo los objetivos de rendimiento.
La capacidad de la red para rotar entre zonas cumple múltiples propósitos críticos:
1. Descentralización jurisdiccional: La rotación regular de zonas impide que una sola jurisdicción logre el consenso. Esto mantiene la resistencia de la red a la presión regulatoria y garantiza que ningún gobierno o autoridad pueda ejercer control a largo plazo sobre su funcionamiento.
2. Resiliencia de la infraestructura: Los centros de datos y la infraestructura regional pueden fallar por diversas razones: desastres naturales, cortes de energía, problemas de red, fallas de hardware o requisitos de mantenimiento. La rotación de zonas garantiza que la red no dependa permanentemente de un único punto de fallo. Los ejemplos históricos de interrupciones importantes en centros de datos, como las causadas por fenómenos meteorológicos severos o fallas en la red eléctrica, demuestran la importancia de esta flexibilidad. 3. Optimización estratégica del rendimiento: Se pueden seleccionar zonas para optimizar actividades específicas de la red. Por ejemplo, durante épocas con eventos financieros significativos (como anuncios de la Reserva Federal, informes económicos importantes o aperturas de mercado), los validadores podrían optar por ubicar el consenso cerca de la fuente de esta información sensible al precio. Esta capacidad permite a la red minimizar la latencia de las operaciones críticas, manteniendo al mismo tiempo la flexibilidad para diferentes casos de uso en diferentes épocas.

4.2 Gestión de claves
El protocolo implementa un sistema de gestión de claves de dos niveles que separa la identidad del validador a largo plazo de la participación en el consenso específico de la zona. Cada validador mantiene un par de claves globales que actúa como su identidad raíz en la red. Esta clave global se utiliza para operaciones de alto nivel, como la delegación de participación, el registro de zonas y la participación en el consenso global. La clave global debe protegerse con las máximas medidas de seguridad posibles, ya que representa la máxima autoridad del validador en la red.
Los validadores pueden delegar autoridad en subclaves específicas de la zona a través de un programa de registro en cadena. Estas subclaves están específicamente autorizadas para la participación en el consenso dentro de las zonas de coubicación designadas. Esta separación cumple múltiples propósitos de seguridad: permite a los validadores mantener diferentes modelos de seguridad para distintos tipos de claves, minimiza la exposición de las claves globales al mantenerlas fuera de línea durante el funcionamiento normal y reduce el riesgo de vulneración de claves durante las transiciones de la infraestructura física entre zonas. La delegación de claves específicas de zona se gestiona mediante un programa en cadena que mantiene un registro de claves de zona autorizadas para cada validador. Si bien los validadores pueden registrar nuevas claves de zona en cualquier momento utilizando su clave global, estos registros solo surten efecto en los límites de época. Este retraso garantiza que todos los participantes de la red tengan tiempo para verificar y registrar las nuevas delegaciones de claves antes de que se activen en el consenso.

4.3 Propuesta y activación de zonas
Se pueden proponer nuevas zonas mediante un mecanismo de gobernanza en cadena utilizando claves globales. Sin embargo, para garantizar la estabilidad de la red y dar a los validadores tiempo suficiente para preparar una infraestructura segura, las zonas propuestas tienen un período de retraso obligatorio antes de que sean elegibles para la selección. Este retraso, establecido como parámetro del protocolo, debe ser lo suficientemente largo para permitir a los validadores:
● Asegurar la infraestructura física adecuada en la nueva zona
● Establecer sistemas seguros de gestión de claves para la nueva ubicación
● Configurar y probar la infraestructura de red
● Realizar las auditorías de seguridad necesarias de las nuevas instalaciones
● Establecer procedimientos de respaldo y recuperación
El período de retraso también sirve como medida de seguridad contra posibles ataques donde un agente malicioso podría intentar forzar el consenso en una zona donde tiene ventajas de infraestructura. Al requerir un aviso previo para nuevas zonas, el protocolo garantiza que todos los validadores tengan una oportunidad justa de establecer presencia en cualquier zona que pueda ser seleccionada para el consenso.
Solo después de que una zona haya completado este período de espera, puede ser seleccionada mediante el proceso regular de votación de zonas para futuras épocas. Este enfoque cuidadoso para la activación de zonas ayuda a mantener la seguridad y la estabilidad de la red, a la vez que permite la adición de nuevas ubicaciones estratégicas a medida que evolucionan los requisitos de la red. 4.4 Proceso de votación para la selección de zonas
La selección de zonas de consenso se realiza mediante un mecanismo de votación en cadena que equilibra la necesidad de un movimiento coordinado de validadores con la seguridad de la red. Los validadores deben alcanzar el quórum en la zona de coubicación de cada época futura dentro de un plazo configurable antes de la transición de época. En la práctica, el calendario de épocas puede determinarse con cierta antelación, de modo que la votación durante la época n seleccione la zona para la época n + k. Los votos se emiten a través de un programa de registro en cadena que utiliza las claves globales de los validadores, con un poder de voto ponderado por la participación. Este proceso utiliza claves globales en lugar de claves de zona, ya que no es sensible a la latencia y requiere la máxima seguridad.
El proceso de votación requiere una supermayoría del peso de la participación para establecer el quórum, lo que garantiza que un pequeño grupo de validadores no pueda forzar unilateralmente un cambio de zona. Si los validadores no alcanzan el quórum dentro del plazo designado, la red pasa automáticamente al modo de consenso global para la siguiente época. Este mecanismo de respaldo garantiza la continuidad de la red incluso cuando los validadores no pueden ponerse de acuerdo sobre una zona de coubicación.
Durante el periodo de votación, los validadores indican su zona preferida para la siguiente época y el tiempo de bloque objetivo para dicha zona. Esta selección conjunta de parámetros de ubicación y rendimiento permite que la red optimice tanto las limitaciones físicas como las capacidades de rendimiento de cada zona. Es importante destacar que el periodo de votación proporciona tiempo a los validadores para preparar la infraestructura en la zona seleccionada, incluyendo el calentamiento de las claves específicas de la zona y las pruebas de conectividad de la red. Este periodo de preparación es crucial para mantener la estabilidad de la red durante las transiciones de zona.

4.5 Modo de Consenso Global
El modo de consenso global funciona como mecanismo de respaldo y como característica fundamental de seguridad del protocolo. Si bien Fogo alcanza su máximo rendimiento mediante el consenso basado en zonas, la capacidad de recurrir al consenso global garantiza el funcionamiento continuo de la red en condiciones adversas. En el modo de consenso global, la red opera con parámetros conservadores optimizados para la validación distribuida globalmente: un tiempo de bloque fijo de 400 ms y un tamaño de bloque reducido para adaptarse a mayores latencias de red entre validadores geográficamente dispersos.
El protocolo entra en modo de consenso global a través de dos vías principales:
● Selección de Zona Fallida: Si los validadores no logran el quórum en la zona de consenso de la siguiente época dentro del período de votación designado, la red automáticamente utiliza el consenso global para esa época. ● Fallo de consenso en tiempo de ejecución: Si la zona actual no logra la finalización del bloque dentro del tiempo de espera designado durante una época, el protocolo cambia inmediatamente al modo de consenso global por el resto de esa época. Esta alternativa es persistente: una vez activada a mitad de la época, la red permanece en consenso global hasta la siguiente transición de época, priorizando la estabilidad sobre la recuperación del rendimiento.
En el modo de consenso global, los validadores participan utilizando una clave designada para la operación global, que puede ser o no una de sus claves específicas de zona, y la red mantiene las mismas reglas de elección de bifurcación que el consenso basado en zonas. Si bien este modo sacrifica la latencia ultrabaja que se puede lograr en zonas coubicadas, proporciona una base sólida para la continuidad de la red y demuestra cómo Fogo mantiene la seguridad sin sacrificar la actividad en condiciones degradadas.

5. Conjunto de validadores
Para lograr un alto rendimiento y mitigar las prácticas abusivas de MEV, Fogo utilizará un conjunto de validadores cuidadosamente seleccionado. Esto es necesario porque incluso una pequeña fracción de nodos de validación con un aprovisionamiento insuficiente puede impedir que la red alcance sus límites físicos de rendimiento.
Inicialmente, la curación operará mediante prueba de autoridad antes de pasar a la autorización directa del conjunto de validadores. Al otorgar la autoridad de curación al conjunto de validadores, Fogo puede imponer sanciones en la capa social ante comportamientos abusivos como un sistema tradicional de prueba de autoridad, pero de una manera no más centralizada que el poder de bifurcación que dos tercios de la participación ya poseen en redes PoS tradicionales como Solana.

5.1 Tamaño y configuración inicial
Fogo mantiene un conjunto de validadores con permisos, con un número mínimo y máximo de validadores impuesto por el protocolo para garantizar una descentralización suficiente y optimizar el rendimiento de la red. El tamaño objetivo inicial será de aproximadamente 20 a 50 validadores, aunque este límite se implementa como un parámetro de protocolo que puede ajustarse a medida que la red madura. En la fase génesis, el conjunto inicial de validadores será seleccionado por una autoridad de génesis, la cual conservará permisos temporales para gestionar la composición del conjunto durante las etapas iniciales de la red.

5.2 Gobernanza y transiciones
El control de la autoridad de génesis sobre la composición del conjunto de validadores es temporal. Tras un período inicial de estabilización de la red, esta autoridad pasará al propio conjunto de validadores. Tras esta transición, los cambios en la composición del conjunto de validadores requerirán una supermayoría de dos tercios de los tokens en staking, lo que coincide con el mismo umbral requerido para los cambios a nivel de protocolo en las redes de prueba de participación.
Para evitar cambios repentinos que podrían desestabilizar la red, los parámetros del protocolo limitan la rotación de validadores. No se puede reemplazar ni expulsar más de un porcentaje fijo del conjunto de validadores dentro de un período determinado, siendo este porcentaje un parámetro de protocolo ajustable. Esto garantiza la evolución gradual del conjunto de validadores, manteniendo al mismo tiempo la estabilidad de la red. 

5.3 Requisitos de Participación
Los validadores deben cumplir con los requisitos mínimos de participación delegada para ser elegibles para el conjunto de validadores, manteniendo la compatibilidad con el modelo económico de Solana y añadiendo el componente de permisos. Este doble requisito (participación suficiente y aprobación del conjunto) garantiza que los validadores tengan tanto la participación económica como la capacidad operativa para mantener el rendimiento de la red.

5.4 Justificación y Gobernanza de la Red
El conjunto de validadores con permisos no afecta significativamente la descentralización de la red, ya que en cualquier red de prueba de participación, una supermayoría de dos tercios de la participación ya puede efectuar cambios arbitrarios en el protocolo mediante bifurcaciones. En cambio, este mecanismo proporciona un marco formal para que el conjunto de validadores aplique comportamientos beneficiosos de la red que, de otro modo, serían difíciles de codificar en las reglas del protocolo. Por ejemplo, la capacidad de expulsar validadores permite a la red responder a:
● Problemas persistentes de rendimiento que degradan las capacidades de la red
● Extracción abusiva de MEV que perjudica la usabilidad de la red
● Comportamiento desestabilizador de la red que no se puede implementar directamente en el protocolo, como la extracción, pero no el reenvío, de bloques de Turbine
● Otros comportamientos que, si bien son potencialmente rentables para los validadores individuales, perjudican el valor a largo plazo de la red

Este mecanismo de gobernanza reconoce que, si bien ciertos comportamientos pueden ser rentables a corto plazo, pueden perjudicar la viabilidad de la red a largo plazo. Al permitir que el conjunto de validadores ponderados por participación supervise dichos comportamientos mediante el control de membresía, Fogo alinea los incentivos de los validadores con la salud a largo plazo de la red sin comprometer las propiedades fundamentales de descentralización inherentes a los sistemas de prueba de participación.

6. Posibles extensiones
Si bien las principales innovaciones de Fogo se centran en el consenso multilocal, el rendimiento del cliente y la gestión del conjunto de validadores, se están considerando varias extensiones de protocolo adicionales para su implementación inicial o posterior al lanzamiento. Estas características mejorarían aún más la funcionalidad de la red, manteniendo la retrocompatibilidad con el ecosistema Solana.

6.1 Pago de la tarifa del token SPL
Para ampliar el acceso a la red y mejorar la experiencia del usuario, Fogo podría introducir un tipo de transacción fee_payer_unsigned que permite ejecutar transacciones sin SOL en la cuenta de origen. Esta función, combinada con un programa de pago de tarifas en cadena, permite a los usuarios pagar las tarifas de transacción utilizando tokens SPL, manteniendo la seguridad del protocolo y la compensación del validador.
El sistema funciona a través de un mercado de retransmisores sin permisos fuera del protocolo. Los usuarios construyen transacciones que incluyen tanto las operaciones previstas como el pago de un token SPL para compensar al eventual pagador de la tarifa. Estas transacciones pueden firmarse válidamente sin especificar un pagador de tarifas, lo que permite que cualquier parte las complete añadiendo su firma y pagando las tarifas SOL. Este mecanismo separa eficazmente la autorización de la transacción del pago de la tarifa, lo que permite que las cuentas con saldo SOL cero interactúen con la red siempre que posean otros activos valiosos.
Esta característica se implementa mediante modificaciones mínimas del protocolo, que solo requieren la adición del nuevo tipo de transacción y un programa en cadena para gestionar la compensación del retransmisor. El sistema crea un mercado eficiente para los servicios de retransmisión de transacciones, manteniendo al mismo tiempo las propiedades de seguridad del protocolo subyacente. A diferencia de los sistemas de abstracción de tarifas más complejos, este enfoque no requiere cambios en los mecanismos de pago del validador ni en las reglas de consenso.

7. Conclusión
Fogo representa un enfoque novedoso para la arquitectura blockchain que desafía las suposiciones tradicionales sobre la relación entre rendimiento, descentralización y seguridad.
Al combinar la implementación de clientes de alto rendimiento con consenso multilocal dinámico y conjuntos de validadores seleccionados, el protocolo logra un rendimiento sin precedentes sin comprometer las propiedades de seguridad fundamentales de los sistemas de prueba de participación. La capacidad de reubicar dinámicamente el consenso, manteniendo la diversidad geográfica, proporciona optimización del rendimiento y resiliencia sistémica, mientras que los mecanismos de respaldo del protocolo garantizan un funcionamiento continuo en condiciones adversas.
Mediante un cuidadoso diseño económico, estos mecanismos surgen naturalmente de los incentivos del validador, en lugar de la aplicación del protocolo, creando un sistema robusto y adaptable. A medida que la tecnología blockchain continúa evolucionando, las innovaciones de Fogo demuestran cómo un diseño de protocolos meticuloso puede ampliar los límites del rendimiento, manteniendo al mismo tiempo las propiedades de seguridad y descentralización que hacen valiosas las redes blockchain.
`

// Bengali
const BENGALI_TEXT = `
ফোগো: একটি উচ্চ-কার্যক্ষমতা সম্পন্ন SVM স্তর ১
সংস্করণ ১.০
সারাংশ
এই গবেষণাপত্রে ফোগোর পরিচয় দেওয়া হয়েছে, যা একটি অভিনব স্তর ১ ব্লকচেইন প্রোটোকল যা থ্রুপুট, ল্যাটেন্সি এবং কনজেশন ব্যবস্থাপনায় যুগান্তকারী পারফরম্যান্স প্রদান করে। সোলানা প্রোটোকলের একটি সম্প্রসারণ হিসেবে, ফোগো SVM এক্সিকিউশন লেয়ারে সম্পূর্ণ সামঞ্জস্য বজায় রাখে, যার ফলে বিদ্যমান সোলানা প্রোগ্রাম, টুলিং এবং অবকাঠামো নির্বিঘ্নে স্থানান্তরিত হতে পারে এবং উল্লেখযোগ্যভাবে উচ্চতর পারফরম্যান্স এবং কম ল্যাটেন্সি অর্জন করতে পারে।
ফোগো তিনটি অভিনব উদ্ভাবনের অবদান রাখে:
● বিশুদ্ধ ফায়ারড্যান্সারের উপর ভিত্তি করে একটি একীভূত ক্লায়েন্ট বাস্তবায়ন, ধীরগতির ক্লায়েন্ট সহ নেটওয়ার্কগুলির দ্বারা অপ্রাপ্য কর্মক্ষমতা স্তরগুলি আনলক করে—যার মধ্যে সোলানা নিজেই অন্তর্ভুক্ত।

গতিশীল সমষ্টির সাথে বহু-স্থানীয় ঐক্যমত্য, ব্লক সময় এবং ল্যাটেন্সি অর্জন
যেকোনো প্রধান ব্লকচেইনের তুলনায় অনেক কম।

একটি কিউরেটেড ভ্যালিডেটর সেট যা উচ্চ কর্মক্ষমতাকে উৎসাহিত করে এবং ভ্যালিডেটর স্তরে শিকারী
আচরণকে প্রতিরোধ করে।
এই উদ্ভাবনগুলি উল্লেখযোগ্য কর্মক্ষমতা লাভ প্রদান করে, একই সাথে স্তর ১ ব্লকচেইনের জন্য অপরিহার্য বিকেন্দ্রীকরণ এবং দৃঢ়তা সংরক্ষণ করে।
১. ভূমিকা
ব্লকচেইন নেটওয়ার্কগুলি বিকেন্দ্রীকরণ এবং নিরাপত্তার সাথে কর্মক্ষমতা ভারসাম্য বজায় রাখার ক্ষেত্রে একটি চলমান চ্যালেঞ্জের মুখোমুখি হয়। আজকের ব্লকচেইনগুলি গুরুতর থ্রুপুট সীমাবদ্ধতার সম্মুখীন হয়
যা তাদের বিশ্বব্যাপী আর্থিক কার্যকলাপের জন্য অনুপযুক্ত করে তোলে। ইথেরিয়াম তার বেস লেয়ারে প্রতি সেকেন্ডে ৫০টিরও কম লেনদেন (TPS) প্রক্রিয়া করে। এমনকি সবচেয়ে কেন্দ্রীভূত স্তর ২গুলিও ১,০০০ টিপিএসেরও কম পরিচালনা করে। যদিও সোলানা উচ্চতর কর্মক্ষমতার জন্য ডিজাইন করা হয়েছিল, ক্লায়েন্ট বৈচিত্র্যের সীমাবদ্ধতা বর্তমানে ৫,০০০ টিপিএসে যানজট সৃষ্টি করে। বিপরীতে, NASDAQ, CME এবং Eurex এর মতো ঐতিহ্যবাহী আর্থিক ব্যবস্থাগুলি নিয়মিতভাবে প্রতি সেকেন্ডে ১০০,০০০ এরও বেশি ক্রিয়াকলাপ প্রক্রিয়া করে।
বিকেন্দ্রীভূত ব্লকচেইন প্রোটোকলের জন্য লেটেন্সি আরেকটি গুরুত্বপূর্ণ সীমাবদ্ধতা উপস্থাপন করে।
আর্থিক বাজারে—বিশেষ করে অস্থির সম্পদের মূল্য আবিষ্কারের জন্য—বাজারের গুণমান এবং তরলতার জন্য কম লেটেন্সি অপরিহার্য। ঐতিহ্যবাহী বাজার অংশগ্রহণকারীরা মিলিসেকেন্ড বা সাব-মিলিসেকেন্ড স্কেলে এন্ড-টু-এন্ড ল্যাটেন্সি দিয়ে কাজ করে। এই গতিগুলি কেবল তখনই অর্জন করা সম্ভব যখন বাজার অংশগ্রহণকারীরা আলোর সীমাবদ্ধতার কারণে কার্যকর পরিবেশের সাথে সহ-অবস্থান করতে পারে।

ঐতিহ্যবাহী ব্লকচেইন আর্কিটেকচারগুলি বিশ্বব্যাপী বিতরণ করা বৈধকরণকারী সেট ব্যবহার করে যা ভৌগোলিক সচেতনতা ছাড়াই কাজ করে, মৌলিক কর্মক্ষমতা সীমাবদ্ধতা তৈরি করে। আলো নিজেই নিরক্ষরেখায় পৃথিবী প্রদক্ষিণ করতে 130 মিলিসেকেন্ডেরও বেশি সময় নেয়, এমনকি একটি নিখুঁত বৃত্তেও ভ্রমণ করে—এবং বাস্তব-বিশ্ব নেটওয়ার্ক পাথগুলিতে অতিরিক্ত দূরত্ব এবং অবকাঠামোগত বিলম্ব জড়িত। এই ভৌত সীমাবদ্ধতাগুলি তখন আরও জটিল হয় যখন ঐক্যমত্যের জন্য বৈধকরণকারীদের মধ্যে একাধিক যোগাযোগ রাউন্ডের প্রয়োজন হয়। এই আন্তঃ-আঞ্চলিক বিলম্বগুলি আরও জটিল হয়
যখন ঐক্যমত্যের জন্য বৈধকরণকারীদের মধ্যে একাধিক যোগাযোগ রাউন্ডের প্রয়োজন হয়। ফলস্বরূপ,
স্থিতিশীলতা বজায় রাখার জন্য
নেটওয়ার্কগুলিকে রক্ষণশীল ব্লক সময় এবং চূড়ান্ত বিলম্ব বাস্তবায়ন করতে হবে। এমনকি সর্বোত্তম পরিস্থিতিতেও, একটি বিশ্বব্যাপী বিতরণ করা ঐক্যমত্য প্রক্রিয়া
এই মৌলিক নেটওয়ার্কিং বিলম্বগুলি কাটিয়ে উঠতে পারে না।

ব্লকচেইনগুলি বিশ্বব্যাপী আর্থিক ব্যবস্থার সাথে আরও সংহত হওয়ার সাথে সাথে, ব্যবহারকারীরা
আজকের কেন্দ্রীভূত সিস্টেমের সাথে তুলনীয় কর্মক্ষমতা দাবি করবে। যত্নশীল নকশা ছাড়া, পূরণ করা
এই চাহিদাগুলি ব্লকচেইন নেটওয়ার্কগুলির বিকেন্দ্রীকরণ এবং
স্থিতিস্থাপকতাকে উল্লেখযোগ্যভাবে আপস করতে পারে। এই চ্যালেঞ্জ মোকাবেলা করার জন্য, আমরা ফোগো স্তর ওয়ান ব্লকচেইন প্রস্তাব করি। ফোগোর মূল দর্শন হল দুটি মূল পদ্ধতির মাধ্যমে থ্রুপুট সর্বাধিক করা এবং বিলম্ব কমানো: প্রথমত, একটি সর্বোত্তম বিকেন্দ্রীভূত
যাচাইকারী সেটে সর্বাধিক কার্যক্ষম ক্লায়েন্ট সফ্টওয়্যার ব্যবহার করা; এবং দ্বিতীয়ত, বিশ্বব্যাপী ঐকমত্যের বেশিরভাগ
বিকেন্দ্রীকরণ সুবিধা সংরক্ষণ করে সহ-অবস্থিত ঐকমত্য গ্রহণ করা।
2. রূপরেখা
প্রবন্ধটি ফোগোর চারপাশে প্রধান নকশা সিদ্ধান্তগুলি কভার করে এমন বিভাগগুলিতে বিভক্ত।

ধারা 3 সোলানা ব্লকচেইন প্রোটোকলের সাথে ফোগোর সম্পর্ক এবং ক্লায়েন্ট অপ্টিমাইজেশন এবং বৈচিত্র্যের সাথে এর
কৌশল কভার করে। ধারা 4 বহু-স্থানীয়
ঐকমত্য, এর ব্যবহারিক বাস্তবায়ন এবং বিশ্বব্যাপী বা
স্থানীয় ঐকমত্যের সাথে এটি যে ট্রেডো তৈরি করে তা কভার করে। ধারা 5
বৈধকরণ সেট শুরু এবং বজায় রাখার জন্য ফোগোর পদ্ধতি কভার করে। ধারা 6 সম্ভাব্য এক্সটেনশনগুলিকে কভার করে যা
উৎপত্তির পরে চালু করা যেতে পারে।
৩. প্রোটোকল এবং ক্লায়েন্ট
একটি বেস লেয়ারে, ফোগো এখন পর্যন্ত সর্বাধিক কার্যকরী বহুল ব্যবহৃত
ব্লকচেইন প্রোটোকল, সোলানার উপরে তৈরি করে শুরু করে। সোলানা নেটওয়ার্ক ইতিমধ্যেই প্রোটোকল ডিজাইন এবং ক্লায়েন্ট বাস্তবায়ন উভয় ক্ষেত্রেই অসংখ্য
অপ্টিমাইজেশন সমাধান নিয়ে আসে। ফোগো
সোলানার সাথে সর্বাধিক সম্ভাব্য ব্যাকওয়ার্ড সামঞ্জস্য লক্ষ্য করে, যার মধ্যে রয়েছে SVM এক্সিকিউশন লেয়ারে সম্পূর্ণ
সামঞ্জস্যতা এবং TowerBFT এর সাথে ঘনিষ্ঠ সামঞ্জস্য
ঐকমত্য, টারবাইন ব্লক প্রচার, সোলানা লিডার রোটেশন এবং নেটওয়ার্কিং এবং কনসেনসাস লেয়ারের অন্যান্য সমস্ত প্রধান
উপাদান। এই সামঞ্জস্যতা ফোগোকে সোলানা
ইকোসিস্টেম থেকে বিদ্যমান প্রোগ্রাম, টুলিং এবং অবকাঠামো সহজেই একীভূত এবং স্থাপন করতে দেয়; সেইসাথে সোলানায় ক্রমাগত আপস্ট্রিম উন্নতি থেকে উপকৃত হতে পারে।
তবে সোলানার বিপরীতে, ফোগো একটি একক ক্যানোনিকাল ক্লায়েন্টের সাথে চলবে। এই ক্যানোনিকাল ক্লায়েন্ট
সোলানায় চলমান সর্বোচ্চ কর্মক্ষমতা সম্পন্ন প্রধান ক্লায়েন্ট হবে। এটি ফোগোকে
উল্লেখযোগ্যভাবে উচ্চতর কর্মক্ষমতা অর্জন করতে দেয় কারণ নেটওয়ার্ক সর্বদা দ্রুততম ক্লায়েন্টের গতিতে চলবে। যেখানে ক্লায়েন্ট বৈচিত্র্যের কারণে সীমাবদ্ধ সোলানা সর্বদা
সবচেয়ে ধীর ক্লায়েন্টের গতির দ্বারা বাধাগ্রস্ত হবে। আপাতত এবং অদূর ভবিষ্যতের জন্য এই
ক্যানোনিকাল ক্লায়েন্টটি ফায়ারড্যান্সার স্ট্যাকের উপর ভিত্তি করে তৈরি হবে।

৩.১ ফায়ারড্যান্সার
ফায়ারড্যান্সার হল জাম্প ক্রিপ্টোর উচ্চ-কার্যক্ষমতাসম্পন্ন সোলানা-সামঞ্জস্যপূর্ণ ক্লায়েন্ট বাস্তবায়ন,
অপ্টিমাইজড প্যারালাল প্রসেসিং, মেমরি ম্যানেজমেন্ট এবং SIMD
নির্দেশনার মাধ্যমে বর্তমান ভ্যালিডেটর
ক্লায়েন্টদের তুলনায় উল্লেখযোগ্যভাবে উচ্চতর লেনদেন প্রক্রিয়াকরণ থ্রুপুট দেখায়।

দুটি সংস্করণ বিদ্যমান: "ফ্র্যাঙ্কএন্ড্যান্সার," একটি হাইব্রিড যা ফায়ারড্যান্সারের প্রসেসিং ইঞ্জিন ব্যবহার করে
রাস্ট ভ্যালিডেটরের নেটওয়ার্কিং স্ট্যাক, এবং সম্পূর্ণ ফায়ারড্যান্সার বাস্তবায়ন
সম্পূর্ণ সি নেটওয়ার্কিং স্ট্যাক পুনর্লিখন সহ, বর্তমানে দেরী-পর্যায়ে উন্নয়নে।

উভয় সংস্করণই কর্মক্ষমতা সর্বাধিক করার সময় সোলানা প্রোটোকল সামঞ্জস্য বজায় রাখে।

সম্পূর্ণ হয়ে গেলে, বিশুদ্ধ ফায়ারড্যান্সার বাস্তবায়ন নতুন কর্মক্ষমতা
বেঞ্চমার্ক স্থাপন করবে বলে আশা করা হচ্ছে, যা এটিকে ফোগোর উচ্চ-থ্রুপুট প্রয়োজনীয়তার জন্য আদর্শ করে তুলবে। ফোগো
একটি ফ্র্যাঙ্কএন্ড্যান্সার ভিত্তিক নেটওয়ার্ক দিয়ে শুরু করবে এবং অবশেষে বিশুদ্ধ ফায়ারড্যান্সারে রূপান্তরিত হবে।
৩.২ ক্যানোনিকাল ক্লায়েন্ট বনাম ক্লায়েন্ট ডাইভারসিটি
ব্লকচেইন প্রোটোকলগুলি ক্লায়েন্ট সফ্টওয়্যারের মাধ্যমে কাজ করে যা তাদের নিয়ম এবং স্পেসিফিকেশন বাস্তবায়ন করে। প্রোটোকলগুলি নেটওয়ার্ক পরিচালনার নিয়মগুলি সংজ্ঞায়িত করলেও, ক্লায়েন্টরা এই স্পেসিফিকেশনগুলিকে এক্সিকিউটেবল সফ্টওয়্যারে অনুবাদ করে। প্রোটোকল এবং ক্লায়েন্টদের মধ্যে সম্পর্ক ঐতিহাসিকভাবে বিভিন্ন মডেল অনুসরণ করেছে, কিছু নেটওয়ার্ক সক্রিয়ভাবে ক্লায়েন্ট বৈচিত্র্যকে প্রচার করে যখন অন্যরা স্বাভাবিকভাবেই ক্যানোনিকাল বাস্তবায়নের উপর একত্রিত হয়।
ক্লায়েন্ট বৈচিত্র্য ঐতিহ্যগতভাবে একাধিক উদ্দেশ্যে কাজ করে: এটি বাস্তবায়ন
অপ্রয়োজনীয়তা প্রদান করে, প্রোটোকল নিয়মগুলির স্বাধীন যাচাইকরণ সক্ষম করে এবং তাত্ত্বিকভাবে নেটওয়ার্ক-ব্যাপী সফ্টওয়্যার দুর্বলতার ঝুঁকি হ্রাস করে। বিটকয়েন নেটওয়ার্ক একটি
আকর্ষণীয় নজির প্রদর্শন করে - একাধিক ক্লায়েন্ট বাস্তবায়ন বিদ্যমান থাকা সত্ত্বেও, বিটকয়েন কোর
ডি ফ্যাক্টো ক্যানোনিকাল ক্লায়েন্ট হিসেবে কাজ করে, যা রেফারেন্স বাস্তবায়ন প্রদান করে যা
ব্যবহারিক নেটওয়ার্ক আচরণকে সংজ্ঞায়িত করে।
তবে, উচ্চ-কার্যক্ষমতাসম্পন্ন ব্লকচেইন নেটওয়ার্কগুলিতে, প্রোটোকল
এবং ক্লায়েন্ট বাস্তবায়নের মধ্যে সম্পর্ক আরও সীমাবদ্ধ হয়ে পড়ে। যখন একটি প্রোটোকল
কম্পিউটিং এবং নেটওয়ার্কিং হার্ডওয়্যারের
ভৌত সীমার কাছে পৌঁছায়, তখন বাস্তবায়ন
বৈচিত্র্যের স্থান স্বাভাবিকভাবেই সংকুচিত হয়। এই কর্মক্ষমতা সীমানায়, সর্বোত্তম বাস্তবায়ন
অনুরূপ সমাধানগুলিতে একত্রিত হতে হবে কারণ তারা একই শারীরিক সীমাবদ্ধতা এবং
কর্মক্ষমতা প্রয়োজনীয়তার মুখোমুখি হয়। সর্বোত্তম বাস্তবায়নের ধরণ থেকে যেকোনো উল্লেখযোগ্য বিচ্যুতির ফলে কর্মক্ষমতা হ্রাস পাবে যা ক্লায়েন্টকে বৈধকরণকারীর ক্রিয়াকলাপের জন্য অযোগ্য করে তুলবে।
এই গতিশীলতা বিশেষ করে ন্যূনতম সম্ভাব্য ব্লক সময় এবং সর্বাধিক লেনদেন থ্রুপুট লক্ষ্য করে নেটওয়ার্কগুলিতে দৃশ্যমান। এই ধরনের সিস্টেমে, ক্লায়েন্টের বৈচিত্র্যের তাত্ত্বিক সুবিধাগুলি কম প্রাসঙ্গিক হয়ে ওঠে, কারণ বিভিন্ন ক্লায়েন্ট বাস্তবায়নের মধ্যে সামঞ্জস্য বজায় রাখার ওভারহেড নিজেই একটি কর্মক্ষমতা বাধা হয়ে দাঁড়াতে পারে। ব্লকচেইনের কর্মক্ষমতাকে ভৌত সীমাতে ঠেলে দেওয়ার সময়, ক্লায়েন্ট বাস্তবায়নগুলি অবশ্যই মূল স্থাপত্য সিদ্ধান্তগুলি ভাগ করে নেবে, যা বাস্তবায়নের নিরাপত্তা সুবিধাগুলিকে মূলত তাত্ত্বিক করে তুলবে।
বৈচিত্র্য।
৩.৩ পারফর্ম্যান্ট ক্লায়েন্টদের জন্য প্রোটোকল ইনসেনটিভ
যদিও ফোগো যেকোনো সঙ্গতিপূর্ণ ক্লায়েন্ট বাস্তবায়নের অনুমতি দেয়, তার স্থাপত্য স্বাভাবিকভাবেই
উচ্চ-কার্যক্ষমতা সম্পন্ন সহ-অবস্থানকৃত ক্রিয়াকলাপের ব্যবহারিক চাহিদা দ্বারা পরিচালিত সর্বোচ্চ-কার্যক্ষমতা সম্পন্ন ক্লায়েন্ট ব্যবহারকে উৎসাহিত করে।

ঐতিহ্যবাহী নেটওয়ার্কগুলির বিপরীতে যেখানে ভৌগোলিক দূরত্ব প্রধান বাধা তৈরি করে,
ফোগোর সহ-অবস্থানকৃত নকশার অর্থ হল ক্লায়েন্ট বাস্তবায়নের দক্ষতা সরাসরি
যাচাইকারীর কর্মক্ষমতা নির্ধারণ করে। এই পরিবেশে, নেটওয়ার্ক ল্যাটেন্সি ন্যূনতম, যা ক্লায়েন্টের গতিকে গুরুত্বপূর্ণ ফ্যাক্টর করে তোলে।
নেটওয়ার্কের গতিশীল ব্লক সময় এবং আকারের পরামিতিগুলি
থ্রুপুট সর্বাধিক করার জন্য অর্থনৈতিক চাপ তৈরি করে। যাচাইকারীদের দ্রুততম ক্লায়েন্ট ব্যবহার করা অথবা
জরিমানা এবং হ্রাসকৃত রাজস্বের ঝুঁকি নেওয়ার মধ্যে একটি বেছে নিতে হবে। যারা ধীরগতির ক্লায়েন্ট চালাচ্ছেন তারা হয়
আক্রমনাত্মক পরামিতিগুলির জন্য ভোট দিয়ে ব্লক হারিয়ে যাওয়ার ঝুঁকি নেন অথবা রক্ষণশীলদের জন্য ভোট দিয়ে রাজস্ব হারান।
এটি সবচেয়ে কার্যকর ক্লায়েন্ট বাস্তবায়নের জন্য প্রাকৃতিক নির্বাচন তৈরি করে। ফোগোর
সহ-অবস্থানীয় পরিবেশে, এমনকি ছোট ছোট কর্মক্ষমতা পার্থক্যও তাৎপর্যপূর্ণ হয়ে ওঠে - একটি
সামান্য ধীরগতির ক্লায়েন্ট ধারাবাহিকভাবে কম পারফর্ম করবে, যার ফলে ব্লক এবং জরিমানা মিস হবে। এই অপ্টিমাইজেশনটি প্রোটোকল নিয়ম নয়, বরং যাচাইকারীর স্বার্থের মাধ্যমে ঘটে।

ক্লায়েন্টের পছন্দ সরাসরি প্রোটোকল দ্বারা প্রয়োগ করা যায় না, অর্থনৈতিক চাপ স্বাভাবিকভাবেই
প্রতিযোগিতামূলক
ক্লায়েন্ট বিকাশ বজায় রেখে নেটওয়ার্ককে সর্বাধিক কার্যকর বাস্তবায়নের দিকে চালিত করে।

৪. বহু-স্থানীয় ঐক্যমত্য
বহু-স্থানীয় ঐক্যমত্য ব্লকচেইন ঐক্যমত্যের একটি অভিনব পদ্ধতির প্রতিনিধিত্ব করে যা
ভৌগোলিক বিতরণের নিরাপত্তা
সুবিধার সাথে বৈধকরণকারী সহ-অবস্থানের কর্মক্ষমতা সুবিধাগুলিকে গতিশীলভাবে ভারসাম্যপূর্ণ করে। সিস্টেমটি বৈধকরণকারীদেরকে
বিভিন্ন অঞ্চলের জন্য স্বতন্ত্র ক্রিপ্টোগ্রাফিক পরিচয় বজায় রেখে যুগ যুগ ধরে তাদের
ভৌত অবস্থানগুলিকে সমন্বয় করতে দেয়, নেটওয়ার্ককে
স্বাভাবিক ক্রিয়াকলাপের সময় অতি-নিম্ন বিলম্বিত ঐক্যমত্য অর্জন করতে সক্ষম করে এবং প্রয়োজনে
বিশ্বব্যাপী ঐক্যমত্যে ফিরে যাওয়ার ক্ষমতা সংরক্ষণ করে।

ফোগোর বহু-স্থানীয় ঐক্যমত্য মডেল
ঐতিহ্যবাহী আর্থিক বাজারের প্রতিষ্ঠিত অনুশীলনগুলি থেকে অনুপ্রেরণা নেয়, বিশেষ করে বৈদেশিক মুদ্রা এবং অন্যান্য বিশ্ব বাজারে ব্যবহৃত "সূর্য অনুসরণ করুন" ট্রেডিং মডেল। ঐতিহ্যবাহী অর্থায়নে, বাজার তৈরি এবং তারল্য
বাণিজ্যের দিন বাড়ার সাথে সাথে প্রধান আর্থিক কেন্দ্রগুলির মধ্যে স্বাভাবিকভাবেই স্থানান্তরিত হয়

এশিয়া থেকে ইউরোপ, উত্তর আমেরিকা - নির্দিষ্ট ভৌগোলিক অঞ্চলে ঘনীভূত তারল্য বজায় রেখে ক্রমাগত বাজার পরিচালনার অনুমতি দেয়। এই মডেলটি ঐতিহ্যবাহী অর্থায়নে কার্যকর প্রমাণিত হয়েছে কারণ এটি স্বীকার করে যে বাজারগুলি বিশ্বব্যাপী হলেও, নেটওয়ার্কিং এবং মানুষের প্রতিক্রিয়া সময়ের ভৌত সীমাবদ্ধতাগুলি সর্বোত্তম মূল্য আবিষ্কার এবং বাজার দক্ষতার জন্য কিছু পরিমাণে ভৌগোলিক ঘনত্বকে প্রয়োজনীয় করে তোলে।

৪.১ অঞ্চল এবং অঞ্চল ঘূর্ণন

একটি অঞ্চল এমন একটি ভৌগোলিক অঞ্চলকে প্রতিনিধিত্ব করে যেখানে বৈধকারীরা সর্বোত্তম ঐক্যমত্য কর্মক্ষমতা অর্জনের জন্য সহ-অবস্থান করে। আদর্শভাবে, একটি অঞ্চল হল একটি একক ডেটা সেন্টার যেখানে বৈধকারীর মধ্যে নেটওয়ার্ক ল্যাটেন্সি হার্ডওয়্যার সীমার কাছাকাছি পৌঁছায়। যাইহোক, প্রয়োজনে অঞ্চলগুলি বৃহত্তর অঞ্চলগুলিকে অন্তর্ভুক্ত করতে প্রসারিত হতে পারে, ব্যবহারিক বিবেচনার জন্য কিছু কর্মক্ষমতা বিনিময় করে। প্রোটোকলে কঠোরভাবে সংজ্ঞায়িত না হয়ে যাচাইকারীর মধ্যে সামাজিক ঐক্যমত্যের মাধ্যমে একটি অঞ্চলের সঠিক সংজ্ঞা উদ্ভূত হয়। এই নমনীয়তা
নেটওয়ার্ককে কর্মক্ষমতা
উদ্দেশ্য বজায় রেখে বাস্তব-বিশ্বের অবকাঠামোগত সীমাবদ্ধতার সাথে খাপ খাইয়ে নিতে দেয়।

নেটওয়ার্কের বিভিন্ন অঞ্চলের মধ্যে আবর্তনের ক্ষমতা একাধিক গুরুত্বপূর্ণ উদ্দেশ্যে কাজ করে:

১. এখতিয়ারগত বিকেন্দ্রীকরণ: নিয়মিত জোন ঘূর্ণন যেকোনো একক এখতিয়ারের দ্বারা ঐক্যমত্য দখলকে বাধা দেয়। এটি নিয়ন্ত্রক চাপের বিরুদ্ধে নেটওয়ার্কের প্রতিরোধ বজায় রাখে এবং নিশ্চিত করে যে কোনও একক সরকার বা কর্তৃপক্ষ নেটওয়ার্ক পরিচালনার উপর দীর্ঘমেয়াদী নিয়ন্ত্রণ প্রয়োগ করতে পারবে না।

২. অবকাঠামো স্থিতিস্থাপকতা: ডেটা সেন্টার এবং আঞ্চলিক অবকাঠামো
অনেক কারণে ব্যর্থ হতে পারে - প্রাকৃতিক দুর্যোগ, বিদ্যুৎ বিভ্রাট, নেটওয়ার্কিং সমস্যা, হার্ডওয়্যার
ব্যর্থতা, বা রক্ষণাবেক্ষণের প্রয়োজনীয়তা। জোন ঘূর্ণন নিশ্চিত করে যে নেটওয়ার্ক
স্থায়ীভাবে ব্যর্থতার কোনও একক বিন্দুর উপর নির্ভরশীল নয়। তীব্র আবহাওয়ার ঘটনা বা পাওয়ার গ্রিড
ব্যর্থতার কারণে সৃষ্ট বড় ডেটা সেন্টার বিভ্রাটের ঐতিহাসিক উদাহরণগুলি এই নমনীয়তার গুরুত্ব প্রদর্শন করে।

৩. কৌশলগত কর্মক্ষমতা অপ্টিমাইজেশন:
নির্দিষ্ট নেটওয়ার্ক কার্যকলাপের জন্য অপ্টিমাইজ করার জন্য জোন নির্বাচন করা যেতে পারে। উদাহরণস্বরূপ, গুরুত্বপূর্ণ আর্থিক ঘটনাবলী (যেমন ফেডারেল রিজার্ভ ঘোষণা, প্রধান অর্থনৈতিক প্রতিবেদন, বা বাজার খোলা) ধারণকারী যুগের সময়, যাচাইকারীরা এই মূল্য-সংবেদনশীল তথ্যের উৎসের কাছাকাছি ঐক্যমত্য খুঁজে বের করতে পারেন। এই ক্ষমতা নেটওয়ার্ককে বিভিন্ন যুগে বিভিন্ন ব্যবহারের ক্ষেত্রে নমনীয়তা বজায় রেখে গুরুত্বপূর্ণ ক্রিয়াকলাপের জন্য বিলম্ব কমাতে সাহায্য করে।
৪.২ কী ব্যবস্থাপনা
প্রোটোকলটি একটি দ্বি-স্তরের কী ব্যবস্থাপনা ব্যবস্থা প্রয়োগ করে যা দীর্ঘমেয়াদী
যাচাইকারী পরিচয়কে জোন-নির্দিষ্ট ঐক্যমত্য অংশগ্রহণ থেকে পৃথক করে। প্রতিটি বৈধকারী একটি
গ্লোবাল কী জোড়া বজায় রাখে যা নেটওয়ার্কে তাদের মূল পরিচয় হিসেবে কাজ করে। এই বিশ্বব্যাপী কীটি
উচ্চ-স্তরের ক্রিয়াকলাপ যেমন স্টেক ডেলিগেশন, জোন নিবন্ধন এবং
গ্লোবাল ঐক্যমত্যে অংশগ্রহণের জন্য ব্যবহৃত হয়। বিশ্বব্যাপী কীটি সর্বোচ্চ সম্ভাব্য নিরাপত্তা
ব্যবস্থার মাধ্যমে সুরক্ষিত করা উচিত, কারণ এটি নেটওয়ার্কে বৈধকারীর চূড়ান্ত কর্তৃত্বের প্রতিনিধিত্ব করে।
ভ্যালিডেটররা তখন একটি অন-চেইন
রেজিস্ট্রি প্রোগ্রামের মাধ্যমে জোন-নির্দিষ্ট সাব-কীগুলিতে কর্তৃত্ব অর্পণ করতে পারে। এই সাব-কীগুলি বিশেষভাবে নির্ধারিত সহ-অবস্থান অঞ্চলের মধ্যে ঐক্যমত্য অংশগ্রহণের জন্য অনুমোদিত। এই পৃথকীকরণ একাধিক সুরক্ষা উদ্দেশ্যে কাজ করে: এটি
ভ্যালিডেটরদের বিভিন্ন ধরণের কীগুলির জন্য বিভিন্ন সুরক্ষা মডেল বজায় রাখার অনুমতি দেয়, এটি
স্বাভাবিক ক্রিয়াকলাপের সময় গ্লোবাল কীগুলিকে ওলাইন রেখে তাদের এক্সপোজারকে হ্রাস করে এবং
এটি
জোনগুলির মধ্যে ভৌত অবকাঠামোগত পরিবর্তনের সময় কী আপসের ঝুঁকি হ্রাস করে।
জোন-নির্দিষ্ট কীগুলির প্রতিনিধিত্ব একটি অন-চেইন প্রোগ্রামের মাধ্যমে পরিচালিত হয় যা
প্রতিটি যাচাইকারীর জন্য অনুমোদিত জোন কীগুলির একটি রেজিস্ট্রি বজায় রাখে। যদিও বৈধকারীরা তাদের গ্লোবাল কী ব্যবহার করে যেকোনো সময় নতুন জোন কী নিবন্ধন করতে পারে, এই নিবন্ধনগুলি শুধুমাত্র যুগের সীমানায় প্রভাব ফেলে। এই বিলম্ব নিশ্চিত করে যে সমস্ত নেটওয়ার্ক অংশগ্রহণকারীদের ঐক্যমতে সক্রিয় হওয়ার আগে নতুন কী প্রতিনিধিত্বগুলি
যাচাই এবং রেকর্ড করার সময় থাকে।

৪.৩ জোন প্রস্তাব এবং সক্রিয়করণ
গ্লোবাল
কী ব্যবহার করে একটি অন-চেইন গভর্নেন্স মেকানিজমের মাধ্যমে নতুন অঞ্চল প্রস্তাব করা যেতে পারে। তবে, নেটওয়ার্ক স্থিতিশীলতা নিশ্চিত করতে এবং বৈধকারীদের
নিরাপদ অবকাঠামো প্রস্তুত করার জন্য পর্যাপ্ত সময় দেওয়ার জন্য, প্রস্তাবিত অঞ্চলগুলিতে নির্বাচনের জন্য যোগ্য হওয়ার আগে একটি বাধ্যতামূলক বিলম্ব সময়কাল রয়েছে। প্রোটোকল প্যারামিটার হিসেবে সেট করা এই বিলম্বটি অবশ্যই যথেষ্ট দীর্ঘ হতে হবে যাতে
যাচাইকারীরা নিম্নলিখিত কাজগুলি করতে পারে:
● নতুন জোনে উপযুক্ত ভৌত অবকাঠামো সুরক্ষিত করতে পারে
● নতুন অবস্থানের জন্য সুরক্ষিত কী ব্যবস্থাপনা ব্যবস্থা স্থাপন করতে পারে
● নেটওয়ার্কিং অবকাঠামো স্থাপন এবং পরীক্ষা করতে পারে
● নতুন সুবিধার প্রয়োজনীয় নিরাপত্তা নিরীক্ষা করতে পারে
● ব্যাকআপ এবং পুনরুদ্ধার পদ্ধতি স্থাপন করতে পারে
বিলম্বের সময়কাল সম্ভাব্য আক্রমণের বিরুদ্ধে একটি নিরাপত্তা ব্যবস্থা হিসেবেও কাজ করে যেখানে
একজন ক্ষতিকারক ব্যক্তি এমন একটি অঞ্চলে ঐক্যমত্য জোর করার চেষ্টা করতে পারে যেখানে তাদের
অবকাঠামোগত সুবিধা রয়েছে। নতুন অঞ্চলের জন্য আগাম নোটিশের প্রয়োজনের মাধ্যমে, প্রোটোকল
নিশ্চিত করে যে সমস্ত বৈধকারীর যেকোনো অঞ্চলে উপস্থিতি স্থাপনের ন্যায্য সুযোগ রয়েছে যা
ঐক্যমত্যের জন্য নির্বাচিত হতে পারে।
একটি জোন এই অপেক্ষার সময়কাল শেষ করার পরেই ভবিষ্যতের যুগের জন্য নিয়মিত
জোন ভোটদান প্রক্রিয়ার মাধ্যমে এটি নির্বাচন করা যেতে পারে। জোন সক্রিয়করণের এই সতর্ক পদ্ধতি
নেটওয়ার্ক সুরক্ষা এবং স্থিতিশীলতা বজায় রাখতে সাহায্য করে এবং নেটওয়ার্ক প্রয়োজনীয়তা বিকশিত হওয়ার সাথে সাথে নতুন কৌশলগত
অবস্থান যুক্ত করার অনুমতি দেয়।
৪.৪ জোন নির্বাচন ভোটিং প্রক্রিয়া
একসাথে জোন নির্বাচন একটি অন-চেইন ভোটিং পদ্ধতির মাধ্যমে ঘটে যা নেটওয়ার্ক সুরক্ষার সাথে সমন্বিত বৈধকরণকারীর চলাচলের প্রয়োজনীয়তার ভারসাম্য বজায় রাখে। বৈধকরণকারীদের অবশ্যই প্রতিটি ভবিষ্যতের যুগের সহ-অবস্থান অঞ্চলে কোরাম অর্জন করতে হবে একটি কনফিগারযোগ্য কোরাম সময়ের মধ্যে যুগান্তকারীর রূপান্তরের আগে। বাস্তবে, যুগান্তকারীর সময়সূচী কিছু লিড টাইম দিয়ে নির্ধারিত হতে পারে, যাতে যুগান্তকারীর সময় n + k এর জন্য জোন নির্বাচন করা হয়। ভোটদানকারীর গ্লোবাল কী ব্যবহার করে একটি অন-চেইন রেজিস্ট্রি প্রোগ্রামের মাধ্যমে ভোট দেওয়া হয়, যার ভোটদান ক্ষমতা স্টেক দ্বারা ওজন করা হয়। এই প্রক্রিয়াটি জোন কীগুলির পরিবর্তে গ্লোবাল কী ব্যবহার করে কারণ এটি ল্যাটেন্সি-সংবেদনশীল নয় এবং সর্বাধিক সুরক্ষার প্রয়োজন।
ভোটদান প্রক্রিয়ার জন্য কোরাম প্রতিষ্ঠার জন্য সর্বাধিক সংখ্যাগরিষ্ঠ স্টেক ওজন প্রয়োজন, নিশ্চিত করে যে বৈধকরণকারীদের একটি ছোট দল একতরফাভাবে জোন পরিবর্তন করতে বাধ্য করতে পারে না। যদি বৈধকরণকারীরা নির্ধারিত সময়সীমার মধ্যে কোরাম অর্জন করতে ব্যর্থ হয়, তাহলে নেটওয়ার্কটি স্বয়ংক্রিয়ভাবে পরবর্তী যুগের জন্য বিশ্বব্যাপী ঐক্যমত্য মোডে ডিফল্ট হয়ে যায়। এই ফলব্যাক প্রক্রিয়াটি নেটওয়ার্কের ধারাবাহিকতা নিশ্চিত করে, এমনকি যখন বৈধকারীরা একটি সহ-অবস্থান অঞ্চলে একমত হতে পারে না।

ভোটদানের সময়, বৈধকারীরা পরবর্তী যুগের জন্য তাদের পছন্দের অঞ্চল এবং সেই অঞ্চলের জন্য তাদের লক্ষ্য ব্লক সময় উভয়কেই সংকেত দেয়। অবস্থান এবং কর্মক্ষমতা পরামিতিগুলির এই যৌথ নির্বাচন নেটওয়ার্ককে প্রতিটি অঞ্চলের শারীরিক সীমাবদ্ধতা এবং কর্মক্ষমতা ক্ষমতা উভয়ের জন্য অপ্টিমাইজ করার অনুমতি দেয়। গুরুত্বপূর্ণভাবে, ভোটদানের সময়কাল যাচাইকারীদের নির্বাচিত অঞ্চলে অবকাঠামো প্রস্তুত করার জন্য সময় প্রদান করে, যার মধ্যে রয়েছে জোন-নির্দিষ্ট কীগুলি উষ্ণ করা এবং নেটওয়ার্ক সংযোগ পরীক্ষা করা। জোন পরিবর্তনের সময় নেটওয়ার্ক স্থিতিশীলতা বজায় রাখার জন্য এই প্রস্তুতির সময়কাল অত্যন্ত গুরুত্বপূর্ণ।
৪.৫ বিশ্বব্যাপী ঐক্যমত্য মোড
বিশ্বব্যাপী ঐক্যমত্য মোড প্রোটোকলের একটি ফলব্যাক প্রক্রিয়া এবং একটি মৌলিক নিরাপত্তা বৈশিষ্ট্য উভয়ই হিসেবে কাজ করে। যদিও ফোগো জোন-ভিত্তিক ঐক্যমত্যের মাধ্যমে তার সর্বোচ্চ কর্মক্ষমতা অর্জন করে, বিশ্বব্যাপী ঐক্যমত্যে ফিরে যাওয়ার ক্ষমতা প্রতিকূল পরিস্থিতিতে নেটওয়ার্কের অব্যাহত কার্যক্রম নিশ্চিত করে। বিশ্বব্যাপী ঐক্যমত্য মোডে, নেটওয়ার্ক বিশ্বব্যাপী বিতরণযোগ্য বৈধতার জন্য অপ্টিমাইজ করা রক্ষণশীল পরামিতিগুলির সাথে কাজ করে: একটি নির্দিষ্ট ৪০০ মিলিসেকেন্ড ব্লক সময় এবং ভৌগোলিকভাবে ছড়িয়ে থাকা বৈধকরণকারীদের মধ্যে উচ্চতর নেটওয়ার্ক বিলম্বকে সামঞ্জস্য করার জন্য ব্লকের আকার হ্রাস করা।
প্রোটোকল দুটি প্রাথমিক পথের মাধ্যমে বিশ্বব্যাপী ঐক্যমত্য মোডে প্রবেশ করে:
● ব্যর্থ অঞ্চল নির্বাচন: যদি বৈধকরণকারীরা নির্ধারিত ভোটদানের সময়কালের মধ্যে পরবর্তী যুগের ঐক্যমত্য অঞ্চলে কোরাম অর্জন করতে ব্যর্থ হয়, তাহলে নেটওয়ার্কটি স্বয়ংক্রিয়ভাবে সেই যুগের জন্য বিশ্বব্যাপী ঐক্যমত্যের জন্য ডিফল্ট হয়ে যায়।
● রানটাইম কনসেনসাস ব্যর্থতা: যদি বর্তমান জোনটি একটি নির্দিষ্ট সময়সীমার মধ্যে ব্লক চূড়ান্ততা অর্জন করতে ব্যর্থ হয়, তাহলে প্রোটোকলটি অবিলম্বে সেই যুগের বাকি সময়ের জন্য গ্লোবাল কনসেনসাস মোডে স্যুইচ করে। এই ফলব্যাক "স্টিকি" -
একবার মধ্য-যুগের ট্রিগার হয়ে গেলে, নেটওয়ার্কটি পরবর্তী যুগের ট্রানজিশন পর্যন্ত গ্লোবাল কনসেনসাসে থাকে, কর্মক্ষমতা পুনরুদ্ধারের চেয়ে স্থিতিশীলতাকে অগ্রাধিকার দেয়।

গ্লোবাল কনসেনসাস মোডে, ভ্যালিডেটররা গ্লোবাল
অপারেশনের জন্য একটি নির্দিষ্ট কী ব্যবহার করে অংশগ্রহণ করে, যা তাদের জোন-নির্দিষ্ট কীগুলির মধ্যে একটি হতে পারে বা নাও হতে পারে, এবং নেটওয়ার্ক
জোন-ভিত্তিক কনসেনসাসের মতো একই ফর্ক পছন্দ নিয়ম বজায় রাখে। যদিও এই মোডটি সহ-অবস্থিত জোনে অর্জনযোগ্য অতি-নিম্ন ল্যাটেন্সি ত্যাগ করে, এটি
নেটওয়ার্ক ধারাবাহিকতার জন্য একটি শক্তিশালী ভিত্তি প্রদান করে এবং দেখায় যে কীভাবে Fogo অবনমিত পরিস্থিতিতে
জীবনযাত্রাকে ত্যাগ না করে
নিরাপত্তা বজায় রাখে।

৫. ভ্যালিডেটর সেট
উচ্চ কর্মক্ষমতা অর্জন এবং অপব্যবহারকারী MEV অনুশীলনগুলি প্রশমিত করতে, Fogo একটি
কিউরেটেড ভ্যালিডেটর সেট ব্যবহার করবে। এটি প্রয়োজনীয় কারণ স্বল্প-বিধানযুক্ত
যাচাইকারী নোডের একটি ছোট অংশও নেটওয়ার্কটিকে তার ভৌত কর্মক্ষমতা সীমায় পৌঁছাতে বাধা দিতে পারে।
প্রাথমিকভাবে, যাচাইকারী সেট দ্বারা সরাসরি
অনুমতিতে রূপান্তরিত হওয়ার আগে কিউরেশন কর্তৃপক্ষের প্রমাণের মাধ্যমে কাজ করবে। যাচাইকারী সেটের সাথে কিউরেশন কর্তৃপক্ষ স্থাপন করে,
ফোগো একটি ঐতিহ্যবাহী
প্রমাণ-অধিকার ব্যবস্থার মতো আপত্তিজনক আচরণের সামাজিক স্তর শাস্তি কার্যকর করতে পারে, তবে এমনভাবে যা সোলানার মতো ঐতিহ্যবাহী PoS নেটওয়ার্কগুলিতে ইতিমধ্যেই থাকা ফর্ক পাওয়ারের চেয়ে বেশি কেন্দ্রীভূত নয়।

৫.১ আকার এবং প্রাথমিক কনফিগারেশন

নেটওয়ার্ক কর্মক্ষমতা অপ্টিমাইজ করার সময় পর্যাপ্ত বিকেন্দ্রীকরণ নিশ্চিত করার জন্য ফোগো একটি প্রোটোকল-প্রয়োগকৃত ন্যূনতম এবং
সর্বোচ্চ সংখ্যক যাচাইকারীর সাথে একটি অনুমোদিত যাচাইকারী সেট বজায় রাখে। প্রাথমিক লক্ষ্য আকার প্রায় ২০-৫০ যাচাইকারী হবে, যদিও
এই ক্যাপটি একটি প্রোটোকল প্যারামিটার হিসাবে প্রয়োগ করা হয় যা নেটওয়ার্ক
পরিপক্ক হওয়ার সাথে সাথে সামঞ্জস্য করা যেতে পারে। জেনেসিসের সময়, প্রাথমিক ভ্যালিডেটর সেটটি একটি জেনেসিস অথরিটি দ্বারা নির্বাচিত হবে, যা
নেটওয়ার্কের প্রাথমিক পর্যায়ে ভ্যালিডেটর সেট কম্পোজিশন পরিচালনা করার জন্য অস্থায়ী অনুমতি বজায় রাখবে।

৫.২ গভর্নেন্স এবং ট্রানজিশন
ভ্যালিডেটর সেট সদস্যতার উপর জেনেসিস অথরিটির নিয়ন্ত্রণ
অস্থায়ীভাবে ডিজাইন করা হয়েছে। নেটওয়ার্ক স্থিতিশীলকরণের প্রাথমিক সময়কালের পরে, এই কর্তৃপক্ষ
ভ্যালিডেটর সেট নিজেই স্থানান্তরিত হবে। এই ট্রানজিশনের পরে, ভ্যালিডেটর সেট সদস্যপদে পরিবর্তনের জন্য
স্ট্যাকড টোকেনের দুই-তৃতীয়াংশ সুপারমজরিটি প্রয়োজন হবে, যা প্রুফ-অফ-স্টেক নেটওয়ার্কগুলিতে প্রোটোকল-স্তরের পরিবর্তনের জন্য প্রয়োজনীয় একই থ্রেশহোল্ডের সাথে মিলে যায়।
নেটওয়ার্ককে অস্থিতিশীল করতে পারে এমন হঠাৎ পরিবর্তনগুলি প্রতিরোধ করার জন্য, প্রোটোকল প্যারামিটার
ভ্যালিডেটর টার্নওভার রেট সীমিত করে। একটি নির্দিষ্ট সময়ের মধ্যে ভ্যালিডেটর সেটের একটি নির্দিষ্ট শতাংশের বেশি
প্রতিস্থাপন বা বের করা যাবে না, যেখানে এই শতাংশটি একটি টিউনেবল প্রোটোকল
প্যারামিটার। এটি নেটওয়ার্ক
স্থিতিশীলতা বজায় রেখে ভ্যালিডেটর সেটের ধীরে ধীরে বিবর্তন নিশ্চিত করে।
৫.৩ অংশগ্রহণের প্রয়োজনীয়তা

বৈধকরণকারী সেটের জন্য যোগ্য হওয়ার জন্য যাচাইকারীদের অবশ্যই ন্যূনতম অর্পণকৃত অংশীদারিত্বের প্রয়োজনীয়তা পূরণ করতে হবে,
অনুমোদিত উপাদান যোগ করার সময় সোলানার অর্থনৈতিক মডেলের সাথে সামঞ্জস্য বজায় রাখতে হবে। এই দ্বৈত প্রয়োজনীয়তা - সুষম অংশীদারিত্ব এবং সেট অনুমোদন -

নিশ্চিত করে যে যাচাইকারীদের খেলায় অর্থনৈতিক ত্বক এবং নেটওয়ার্ক কর্মক্ষমতা বজায় রাখার জন্য কার্যকরী ক্ষমতা উভয়ই রয়েছে।
৫.৪ যুক্তি এবং নেটওয়ার্ক গভর্নেন্স
অনুমোদিত ভ্যালিডেটর সেটটি নেটওয়ার্ক বিকেন্দ্রীকরণকে বস্তুগতভাবে প্রভাবিত করে না, যেমন
যেকোনো প্রুফ-অফ-স্টেক নেটওয়ার্কে, দুই-তৃতীয়াংশ সুপারমেজরিটি ইতিমধ্যেই ফর্কিংয়ের মাধ্যমে প্রোটোকলে স্বেচ্ছাচারী পরিবর্তন আনতে পারে। পরিবর্তে, এই প্রক্রিয়াটি ভ্যালিডেটর সেটের জন্য একটি
আনুষ্ঠানিক কাঠামো প্রদান করে যা উপকারী নেটওয়ার্ক আচরণগুলি প্রয়োগ করে যা
অন্যথায় প্রোটোকল নিয়মে এনকোড করা কঠিন হতে পারে।
উদাহরণস্বরূপ, ভ্যালিডেটরগুলিকে বের করে দেওয়ার ক্ষমতা নেটওয়ার্ককে প্রতিক্রিয়া জানাতে সক্ষম করে:
● স্থায়ী কর্মক্ষমতা সমস্যা যা নেটওয়ার্ক ক্ষমতা হ্রাস করে
● অপব্যবহারকারী MEV নিষ্কাশন যা নেটওয়ার্ক ব্যবহারযোগ্যতাকে ক্ষতিগ্রস্ত করে
● নেটওয়ার্ক অস্থিতিশীল আচরণ যা সরাসরি প্রোটোকলে প্রয়োগ করা যায় না, যেমন
লিচিং কিন্তু টারবাইন ব্লক ফরোয়ার্ড না করা
● অন্যান্য আচরণ যা, যদিও পৃথক ভ্যালিডেটরদের জন্য সম্ভাব্য লাভজনক,
নেটওয়ার্কের দীর্ঘমেয়াদী মূল্যের ক্ষতি করে
এই গভর্নেন্স প্রক্রিয়াটি স্বীকার করে যে কিছু আচরণ স্বল্পমেয়াদে
লাভজনক হতে পারে, তবে তারা নেটওয়ার্কের দীর্ঘমেয়াদী কার্যকারিতার ক্ষতি করতে পারে। সদস্যপদ নিয়ন্ত্রণের মাধ্যমে এই ধরনের আচরণ নিয়ন্ত্রণে ‘স্টেক-ওয়েটেড ভ্যালিডেটর সেট’ সক্ষম করে, ফোগো ‘প্রুফ-অফ-স্টেক সিস্টেমের অন্তর্নিহিত মৌলিক বিকেন্দ্রীকরণ বৈশিষ্ট্যগুলির সাথে আপস না করে নেটওয়ার্কের দীর্ঘমেয়াদী স্বাস্থ্যের সাথে বৈধকরণকারী প্রণোদনাগুলিকে সারিবদ্ধ করে।

৬. সম্ভাব্য এক্সটেনশন
যদিও ফোগোর মূল উদ্ভাবনগুলি বহু-স্থানীয় ঐক্যমত্য, ক্লায়েন্ট কর্মক্ষমতা এবং
ভ্যালিডেটর সেট ব্যবস্থাপনার উপর দৃষ্টি নিবদ্ধ করে, উৎপত্তি বা লঞ্চ-পরবর্তী বাস্তবায়নের জন্য বেশ কয়েকটি অতিরিক্ত প্রোটোকল এক্সটেনশন বিবেচনাধীন রয়েছে। এই বৈশিষ্ট্যগুলি সোলানা
ইকোসিস্টেমের সাথে সামঞ্জস্য বজায় রেখে
নেটওয়ার্ক কার্যকারিতা আরও উন্নত করবে।

৬.১ SPL টোকেন ফি পেমেন্ট
বৃহত্তর নেটওয়ার্ক অ্যাক্সেস সক্ষম করতে এবং ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে, ফোগো সম্ভাব্যভাবে
একটি fee_payer_unsigned লেনদেনের ধরণ চালু করবে যা অরিজিনিটিং অ্যাকাউন্টে SOL ছাড়াই লেনদেন সম্পাদন করতে দেয়। এই বৈশিষ্ট্যটি, একটি অন-চেইন ফি
পেমেন্ট প্রোগ্রামের সাথে মিলিত, ব্যবহারকারীদের প্রোটোকল সুরক্ষা এবং বৈধকরণকারী ক্ষতিপূরণ বজায় রেখে SPL টোকেন ব্যবহার করে লেনদেন ফি প্রদান করতে সক্ষম করে।
সিস্টেমটি প্রোটোকলের বাইরে অনুমতিহীন রিলেয়ার মার্কেটপ্লেসের মাধ্যমে কাজ করে। ব্যবহারকারীরা এমন লেনদেন তৈরি করেন যাতে তাদের উদ্দেশ্যমূলক ক্রিয়াকলাপ এবং একটি SPL টোকেন-পেমেন্ট উভয়ই অন্তর্ভুক্ত থাকে যাতে চূড়ান্ত ফি প্রদানকারীকে ক্ষতিপূরণ দেওয়া যায়। এই লেনদেনগুলি বৈধভাবে স্বাক্ষরিত হতে পারে
কোনও ফি প্রদানকারীকে নির্দিষ্ট না করে, যেকোনো পক্ষকে তাদের স্বাক্ষর যোগ করে এবং SOL ফি প্রদান করে সেগুলি সম্পূর্ণ করতে দেয়। এই প্রক্রিয়াটি কার্যকরভাবে লেনদেনের অনুমোদনকে ফি প্রদান থেকে পৃথক করে, শূন্য SOL ব্যালেন্স সহ অ্যাকাউন্টগুলিকে নেটওয়ার্কের সাথে ইন্টারঅ্যাক্ট করতে সক্ষম করে যতক্ষণ না তাদের অন্যান্য মূল্যবান সম্পদ থাকে।

এই বৈশিষ্ট্যটি ন্যূনতম প্রোটোকল পরিবর্তনের মাধ্যমে বাস্তবায়িত হয়, যার জন্য শুধুমাত্র নতুন লেনদেনের ধরণ এবং রিলেয়ার ক্ষতিপূরণ পরিচালনা করার জন্য একটি অন-চেইন প্রোগ্রামের প্রয়োজন হয়। সিস্টেমটি লেনদেন রিলে পরিষেবাগুলির জন্য একটি কার্যকর বাজার তৈরি করে এবং অন্তর্নিহিত প্রোটোকলের সুরক্ষা বৈশিষ্ট্যগুলি বজায় রাখে। আরও জটিল ফি-বিমূর্তকরণ সিস্টেমের বিপরীতে, এই পদ্ধতির জন্য বৈধকরণকারী পেমেন্ট প্রক্রিয়া বা ঐক্যমত্য নিয়মগুলিতে কোনও পরিবর্তনের প্রয়োজন হয় না।

৭. উপসংহার
ফোগো ব্লকচেইন আর্কিটেকচারের একটি অভিনব পদ্ধতির প্রতিনিধিত্ব করে যা কর্মক্ষমতা, বিকেন্দ্রীকরণ এবং সুরক্ষার মধ্যে সম্পর্ক সম্পর্কে ঐতিহ্যগত অনুমানকে চ্যালেঞ্জ করে।

উচ্চ-কার্যক্ষমতা সম্পন্ন ক্লায়েন্ট বাস্তবায়নকে গতিশীল মাল্টি-লোকাল
ঐকমত্য এবং কিউরেটেড ভ্যালিডেটর সেটের সাথে একত্রিত করে, প্রোটোকলটি অভূতপূর্ব কর্মক্ষমতা অর্জন করে
প্রুফ-অফ-স্টেক সিস্টেমের মৌলিক নিরাপত্তা বৈশিষ্ট্যের সাথে আপস না করে। ভৌগোলিক বৈচিত্র্য বজায় রেখে গতিশীলভাবে ঐক্যমত্য স্থানান্তর করার ক্ষমতা
কর্মক্ষমতা অপ্টিমাইজেশন এবং পদ্ধতিগত স্থিতিস্থাপকতা উভয়ই প্রদান করে, যখন প্রোটোকলের ফলব্যাক
প্রক্রিয়াগুলি প্রতিকূল পরিস্থিতিতে ক্রমাগত অপারেশন নিশ্চিত করে।
সতর্ক অর্থনৈতিক নকশার মাধ্যমে, এই প্রক্রিয়াগুলি প্রোটোকল প্রয়োগের পরিবর্তে বৈধকরণকারী
প্রণোদনা থেকে স্বাভাবিকভাবেই উদ্ভূত হয়, একটি শক্তিশালী এবং অভিযোজিত
সিস্টেম তৈরি করে। ব্লকচেইন প্রযুক্তির বিকশিত হওয়ার সাথে সাথে, ফোগোর উদ্ভাবনগুলি প্রদর্শন করে
কিভাবে চিন্তাশীল প্রোটোকল নকশা কর্মক্ষমতার সীমানা ঠেলে দিতে পারে
ব্লকচেইন নেটওয়ার্কগুলিকে মূল্যবান করে তোলে এমন নিরাপত্তা এবং বিকেন্দ্রীকরণ বৈশিষ্ট্যগুলি বজায় রেখে।
`

// Polish
const POLISH_TEXT = `
Fogo: Wysokowydajna SVM warstwy 1
Wersja 1.0

Streszczenie
Niniejszy artykuł przedstawia Fogo, nowatorski protokół blockchain warstwy 1, zapewniający przełomową
wydajność w zakresie przepustowości, opóźnień i zarządzania przeciążeniem. Jako rozszerzenie
protokołu Solana, Fogo zachowuje pełną kompatybilność w warstwie wykonawczej SVM, umożliwiając
istniejącym programom, narzędziom i infrastrukturze Solana bezproblemową migrację, jednocześnie
osiągając znacznie wyższą wydajność i niższe opóźnienia.
Fogo wnosi trzy nowatorskie innowacje:
● Zunifikowaną implementację klienta opartą na czystym Firedancer, umożliwiającą osiągnięcie poziomów wydajności
nieosiągalnych przez sieci z wolniejszymi klientami — w tym samą Solanę.
● Wielolokalny konsensus z dynamiczną kolokacją, osiągający czasy bloków i opóźnienia
znacznie niższe niż w przypadku dowolnego głównego blockchaina.
● Wyselekcjonowany zestaw walidatorów, który motywuje do wysokiej wydajności i zniechęca do agresywnych
zachowań na poziomie walidatora.
Te innowacje zapewniają znaczny wzrost wydajności, zachowując jednocześnie
decentralizację i solidność, niezbędne dla blockchaina warstwy

1. Wprowadzenie
Sieci blockchain stoją przed ciągłym wyzwaniem znalezienia równowagi między wydajnością a
decentralizacją i bezpieczeństwem. Dzisiejsze blockchainy borykają się z poważnymi ograniczeniami przepustowości,
które czynią je nieodpowiednimi do globalnej działalności finansowej. Ethereum przetwarza mniej niż 50
transakcji na sekundę (TPS) w swojej warstwie bazowej. Nawet najbardziej scentralizowane blockchainy warstwy 2 obsługują
mniej niż 1000 TPS. Chociaż Solana została zaprojektowana z myślą o wyższej wydajności, ograniczenia wynikające z
różnorodności klientów powodują obecnie przeciążenie na poziomie 5000 TPS. Dla porównania, tradycyjne systemy finansowe,
takie jak NASDAQ, CME i Eurex, regularnie przetwarzają ponad 100 000 operacji na
sekundę.
Opóźnienia stanowią kolejne krytyczne ograniczenie dla zdecentralizowanych protokołów blockchain. Na
rynkach finansowych — zwłaszcza w przypadku ustalania cen aktywów o dużej zmienności — niskie opóźnienia są
niezbędne dla jakości i płynności rynku. Tradycyjni uczestnicy rynku działają z
opóźnieniami typu end-to-end w skali milisekundowej lub submilisekundowej. Prędkości te są
osiągalne tylko wtedy, gdy uczestnicy rynku mogą współlokować się ze środowiskiem wykonawczym ze względu na
ograniczenia związane z prędkością światła.
Tradycyjne architektury blockchain wykorzystują globalnie rozproszone zestawy walidatorów, które działają
bez świadomości geograficznej, co powoduje fundamentalne ograniczenia wydajności. Samo światło
potrzebuje ponad 130 milisekund, aby okrążyć kulę ziemską na równiku, nawet poruszając się po
idealnym okręgu — a rzeczywiste ścieżki sieciowe wiążą się z dodatkowymi opóźnieniami w zakresie odległości i infrastruktury. Te ograniczenia fizyczne nasilają się, gdy konsensus wymaga wielu
rund komunikacji między walidatorami. Te międzyregionalne opóźnienia nasilają się,
gdy konsensus wymaga wielu rund komunikacji między walidatorami. W rezultacie,
sieci muszą implementować konserwatywne czasy bloków i opóźnienia finalizacji, aby zachować
stabilność. Nawet w optymalnych warunkach globalnie rozproszony mechanizm konsensusu
nie jest w stanie pokonać tych podstawowych opóźnień sieciowych.
W miarę jak blockchainy integrują się z globalnym systemem finansowym, użytkownicy będą żądać
wydajności porównywalnej z dzisiejszymi scentralizowanymi systemami. Bez starannego projektu spełnienie
tych wymagań mogłoby znacząco zagrozić decentralizacji i
odporności sieci blockchain. Aby sprostać temu wyzwaniu, proponujemy blockchain Fogo warstwy pierwszej. Podstawową filozofią Fogo jest maksymalizacja przepustowości i minimalizacja opóźnień poprzez dwa kluczowe
podejścia: po pierwsze, wykorzystanie najwydajniejszego oprogramowania klienckiego na optymalnie zdecentralizowanym
zestawie walidatorów; a po drugie, wykorzystanie konsensusu w jednym miejscu, przy jednoczesnym zachowaniu większości
korzyści decentralizacji globalnego konsensusu.

2. Zarys
Artykuł podzielony jest na sekcje dotyczące głównych decyzji projektowych dotyczących Fogo.
Sekcja 3 omawia związek Fogo z protokołem blockchain Solana oraz jego
strategię w zakresie optymalizacji i różnorodności klientów. Sekcja 4 omawia konsensus wielolokalny, jego praktyczną implementację oraz kompromisy, jakie wprowadza w stosunku do konsensusu globalnego lub lokalnego. Sekcja 5 omawia podejście Fogo do inicjalizacji i utrzymywania zestawu walidatorów. Sekcja 6 omawia potencjalne rozszerzenia, które mogą zostać wprowadzone po jego
powstaniu.

3. Protokół i klienci
W warstwie bazowej Fogo zaczyna od budowania na bazie najwydajniejszego, powszechnie używanego
jak dotąd protokołu blockchain, Solana. Sieć Solana oferuje już liczne
rozwiązania optymalizacyjne, zarówno pod względem projektowania protokołu, jak i implementacji klientów. Fogo
dąży do osiągnięcia maksymalnej możliwej wstecznej kompatybilności z Solaną, w tym pełnej
kompatybilności w warstwie wykonawczej SVM oraz ścisłej kompatybilności z konsensusem TowerBFT, propagacją bloku Turbine, rotacją liderów Solana i wszystkimi innymi głównymi
komponentami warstw sieciowej i konsensusu. Ta kompatybilność pozwala Fogo
łatwo integrować i wdrażać istniejące programy, narzędzia i infrastrukturę z ekosystemu Solana,
a także korzystać z ciągłych ulepszeń w Solanie.
Jednak w przeciwieństwie do Solany, Fogo będzie działać z jednym klientem kanonicznym. Ten klient kanoniczny
będzie głównym klientem o najwyższej wydajności działającym na Solanie. Pozwala to Fogo
osiągnąć znacznie wyższą wydajność, ponieważ sieć zawsze będzie działać z prędkością
najszybszego klienta. Natomiast Solana, ograniczona różnorodnością klientów, zawsze będzie miała problem z szybkością najwolniejszego klienta. Na razie i w dającej się przewidzieć przyszłości ten
kanoniczny klient będzie oparty na stosie Firedancer.

3.1 Firedancer
Firedancer to wysokowydajna implementacja klienta Jump Crypto zgodna z Solaną,
wykazująca znacznie wyższą przepustowość przetwarzania transakcji niż obecni klienci walidatorów
dzięki zoptymalizowanemu przetwarzaniu równoległemu, zarządzaniu pamięcią i instrukcjom SIMD.
Istnieją dwie wersje: „Frankendancer”, hybryda wykorzystująca silnik przetwarzania Firedancer ze
stosem sieciowym walidatora Rust, oraz pełna implementacja Firedancer z
kompletnym przepisaniem stosu sieciowego w języku C, obecnie w późnej fazie rozwoju.
Obie wersje zachowują zgodność z protokołem Solana, maksymalizując jednocześnie wydajność.
Po ukończeniu, czysta implementacja Firedancer ma wyznaczyć nowe standardy wydajności,
co czyni ją idealną do spełnienia wymagań Fogo dotyczących wysokiej przepustowości. Fogo rozpocznie od
sieci opartej na Frankendancerze, a następnie ostatecznie przejdzie do czystego Firedancera.

3.2 Kanoniczni klienci a różnorodność klientów
Protokoły blockchain działają za pośrednictwem oprogramowania klienckiego, które implementuje ich reguły i
specyfikacje. Podczas gdy protokoły definiują zasady działania sieci, klienci tłumaczą
te specyfikacje na oprogramowanie wykonywalne. Relacja między protokołami a
klientami historycznie podążała za różnymi modelami, przy czym niektóre sieci aktywnie promowały
różnorodność klientów, podczas gdy inne naturalnie zmierzały w kierunku implementacji kanonicznych.
Różnorodność klientów tradycyjnie służy wielu celom: zapewnia redundancję implementacji, umożliwia niezależną weryfikację reguł protokołu i teoretycznie zmniejsza
ryzyko luk w zabezpieczeniach oprogramowania w całej sieci. Sieć Bitcoin stanowi
interesujący precedens – chociaż istnieje wiele implementacji klientów, Bitcoin Core służy jako
de facto kanoniczny klient, zapewniając implementację referencyjną, która definiuje
praktyczne zachowanie sieci.
Jednak w wysokowydajnych sieciach blockchain relacja między protokołem a implementacją klienta staje się bardziej ograniczona. Gdy protokół zbliża się do
fizycznych granic możliwości sprzętu obliczeniowego i sieciowego, przestrzeń dla różnorodności implementacji naturalnie się kurczy. Na tych granicach wydajności optymalne implementacje
muszą konwergować na podobne rozwiązania, ponieważ napotykają te same ograniczenia fizyczne i
wymagania wydajnościowe. Każde znaczące odchylenie od optymalnych wzorców implementacji
skutkowałoby obniżeniem wydajności, które uniemożliwiłoby działanie klienta
walidatorowi.
Ta dynamika jest szczególnie widoczna w sieciach ukierunkowanych na minimalne możliwe czasy bloków
i maksymalną przepustowość transakcji. W takich systemach teoretyczne korzyści płynące z różnorodności
klientów stają się mniej istotne, ponieważ narzut związany z utrzymaniem kompatybilności między
różnymi implementacjami klientów może sam w sobie stać się wąskim gardłem wydajności. Podczas
przesuwania wydajności blockchaina do fizycznych granic, implementacje klientów będą z konieczności
dzielić podstawowe decyzje architektoniczne, co sprawia, że korzyści z różnorodności implementacji w zakresie bezpieczeństwa
są w dużej mierze teoretyczne.

3.3 Zachęty protokołu dla wydajnych klientów
Chociaż Fogo pozwala na dowolną, zgodną z wymaganiami implementację klienta, jego architektura w naturalny sposób
zachęca do korzystania z najwydajniejszego dostępnego klienta, co wynika z praktycznych wymagań
wysokowydajnych operacji współlokalizowanych.
W przeciwieństwie do tradycyjnych sieci, w których odległość geograficzna stanowi główne wąskie gardła,
współlokalizacja Fogo oznacza, że efektywność implementacji klienta bezpośrednio determinuje
wydajność walidatora. W tym środowisku opóźnienie sieci jest minimalne, co sprawia, że
szybkość klienta jest czynnikiem krytycznym.
Dynamiczne parametry czasu i rozmiaru bloku sieci wywierają presję ekonomiczną na
maksymalizację przepustowości. Walidatorzy muszą wybierać między korzystaniem z najszybszego klienta a ryzykiem
kar i zmniejszenia przychodów. Użytkownicy wolniejszych klientów albo ryzykują utratę bloków,
głosując na agresywne parametry, albo tracą przychody, głosując na konserwatywne.
Stwarza to naturalną selekcję dla najwydajniejszej implementacji klienta. W środowisku Fogo, nawet niewielkie różnice w wydajności stają się znaczące – nieznaczne spowolnienie klienta będzie konsekwentnie prowadzić do pominiętych bloków i kar. Optymalizacja ta odbywa się poprzez interes własny walidatora, a nie poprzez reguły protokołu.
Chociaż wybór klienta nie może być bezpośrednio wymuszony protokołem, presja ekonomiczna naturalnie
popycha sieć w kierunku najbardziej efektywnej implementacji, przy jednoczesnym utrzymaniu konkurencyjnego
rozwoju klientów.

4. Konsensus wielolokalny
Konsensus wielolokalny stanowi nowatorskie podejście do konsensusu blockchain, które
dynamicznie równoważy korzyści wydajnościowe wynikające z kolokacji walidatorów z zaletami bezpieczeństwa
rozproszenia geograficznego. System pozwala walidatorom koordynować swoje
lokalizacje fizyczne w różnych epokach, zachowując jednocześnie odrębne tożsamości kryptograficzne dla
różnych stref, co umożliwia sieci osiągnięcie konsensusu o ultraniskim opóźnieniu podczas
normalnej pracy, zachowując jednocześnie możliwość powrotu do konsensusu globalnego w razie
potrzeby. Wielolokalny model konsensusu Fogo czerpie inspirację z ugruntowanych praktyk na
tradycyjnych rynkach finansowych, w szczególności z modelu handlu „podążającego za słońcem”, stosowanego na
rynkach walutowych i innych rynkach globalnych. W tradycyjnych finansach, animacja rynku i zapewnianie płynności naturalnie migrują między głównymi centrami finansowymi w miarę upływu dnia handlowego
– od Azji przez Europę po Amerykę Północną – umożliwiając ciągłość działania rynku przy jednoczesnym
utrzymaniu skoncentrowanej płynności w określonych regionach geograficznych. Model ten okazał się
skuteczny w tradycyjnych finansach, ponieważ uwzględnia fakt, że chociaż rynki mają charakter globalny,
fizyczne ograniczenia sieci i czasu reakcji człowieka sprawiają, że pewien stopień
koncentracji geograficznej jest niezbędny do optymalnego ustalania cen i efektywności rynku.

4.1 Strefy i rotacja stref
Strefa reprezentuje obszar geograficzny, w którym walidatorzy kolokalizują się w celu osiągnięcia optymalnej
wydajności konsensusu. W idealnym przypadku strefa to pojedyncze centrum danych, w którym opóźnienie sieciowe
między walidatorami zbliża się do limitów sprzętowych. Jednakże strefy mogą się rozszerzyć,
aby w razie potrzeby objąć większe regiony, poświęcając część wydajności na rzecz
względów praktycznych. Dokładna definicja strefy powstaje w wyniku społecznego konsensusu wśród
walidatorów, a nie jest ściśle określona w protokole. Ta elastyczność pozwala
sieci dostosować się do rzeczywistych ograniczeń infrastruktury, przy jednoczesnym zachowaniu celów wydajnościowych.
Możliwość rotacji sieci między strefami służy wielu kluczowym celom:
1. Decentralizacja jurysdykcyjna: Regularna rotacja stref zapobiega przejęciu
konsensusu przez jakąkolwiek jurysdykcję. Utrzymuje to odporność sieci na
presję regulacyjną i zapewnia, że żaden rząd ani organ nie może sprawować
długoterminowej kontroli nad działaniem sieci.
2. Odporność infrastruktury: Centra danych i infrastruktura regionalna mogą ulec awarii z
wielu powodów – klęsk żywiołowych, przerw w dostawie prądu, problemów z siecią, awarii sprzętu lub wymogów konserwacyjnych. Rotacja stref zapewnia, że sieć nie jest
trwale zależna od pojedynczego punktu awarii. Historyczne przykłady poważnych
awarii centrów danych, takich jak te spowodowane przez gwałtowne zjawiska pogodowe lub awarie sieci energetycznej, pokazują znaczenie tej elastyczności.
3. Strategiczna optymalizacja wydajności: Można wybrać strefy w celu optymalizacji pod kątem
konkretnych działań sieciowych. Na przykład, w epokach zawierających istotne
wydarzenia finansowe (takie jak ogłoszenia Rezerwy Federalnej, ważne raporty ekonomiczne
lub otwarcia rynków), walidatorzy mogą zdecydować się na lokalizację konsensusu w pobliżu
źródła tych informacji wpływających na cenę. Ta możliwość pozwala sieci
zminimalizować opóźnienia w krytycznych operacjach, zachowując jednocześnie elastyczność w różnych
przypadkach użycia w różnych epokach.

4.2 Zarządzanie kluczami
Protokół implementuje dwupoziomowy system zarządzania kluczami, który oddziela długoterminową
tożsamość walidatora od uczestnictwa w konsensusie specyficznym dla danej strefy. Każdy walidator utrzymuje
globalną parę kluczy, która służy jako jego tożsamość główna w sieci. Ten klucz globalny jest używany do
operacji wysokiego poziomu, takich jak delegowanie udziałów, rejestracja strefy i uczestnictwo w
globalnym konsensusie. Klucz globalny powinien być zabezpieczony najwyższymi możliwymi środkami bezpieczeństwa,
ponieważ reprezentuje on ostateczne uprawnienia walidatora w sieci.
Walidatorzy mogą następnie delegować uprawnienia do podkluczy specyficznych dla danej strefy za pośrednictwem
programu rejestru on-chain. Te podklucze są specjalnie autoryzowane do uczestnictwa w konsensusie
w wyznaczonych strefach kolokacji. To rozdzielenie służy wielu celom bezpieczeństwa:
umożliwia walidatorom utrzymywanie różnych modeli bezpieczeństwa dla różnych typów kluczy, minimalizuje
narażenie kluczy globalnych poprzez utrzymywanie ich w trybie offline podczas normalnej pracy oraz
zmniejsza ryzyko naruszenia klucza podczas przechodzenia między strefami w infrastrukturze fizycznej.
Delegowanie kluczy strefowych jest zarządzane za pomocą programu on-chain, który
utrzymuje rejestr autoryzowanych kluczy strefowych dla każdego walidatora. Chociaż walidatorzy mogą
rejestrować nowe klucze strefowe w dowolnym momencie za pomocą swojego klucza globalnego, rejestracje te są realizowane
tylko na granicach epok. To opóźnienie zapewnia wszystkim uczestnikom sieci czas na
weryfikację i zarejestrowanie nowych delegacji kluczy, zanim staną się one aktywne w ramach konsensusu.

4.3 Propozycja i aktywacja strefy
Nowe strefy można proponować za pośrednictwem mechanizmu zarządzania on-chain przy użyciu
kluczy globalnych. Aby jednak zapewnić stabilność sieci i dać walidatorom wystarczająco dużo czasu na przygotowanie
bezpiecznej infrastruktury, proponowane strefy mają obowiązkowy okres opóźnienia, zanim będą mogły zostać
zakwalifikowane do wyboru. To opóźnienie, ustawione jako parametr protokołu, musi być wystarczająco długie, aby
umożliwić walidatorom:
● Zabezpieczenie odpowiedniej infrastruktury fizycznej w nowej strefie
● Ustanowienie bezpiecznych systemów zarządzania kluczami dla nowej lokalizacji
● Skonfigurowanie i przetestowanie infrastruktury sieciowej
● Przeprowadzenie niezbędnych audytów bezpieczeństwa nowego obiektu
● Ustanowienie procedur tworzenia kopii zapasowych i odzyskiwania
Okres opóźnienia służy również jako środek bezpieczeństwa przed potencjalnymi atakami, w których
złośliwy podmiot mógłby próbować wymusić konsensus w strefie, w której ma
przewagę infrastrukturalną. Wymagając wcześniejszego powiadomienia o nowych strefach, protokół
zapewnia wszystkim walidatorom uczciwą możliwość ustanowienia obecności w dowolnej strefie,
która może zostać wybrana do konsensusu.
Dopiero po upływie tego okresu oczekiwania strefa może zostać wybrana w ramach standardowego
procesu głosowania w strefie na przyszłe epoki. To ostrożne podejście do aktywacji strefy pomaga
utrzymać bezpieczeństwo i stabilność sieci, jednocześnie umożliwiając dodawanie nowych strategicznych
lokalizacji w miarę rozwoju wymagań sieciowych. 

4.4 Proces głosowania w sprawie wyboru strefy
Wybór stref konsensusu odbywa się za pomocą mechanizmu głosowania w łańcuchu, który
równoważy potrzebę skoordynowanego ruchu walidatorów z bezpieczeństwem sieci. Walidatorzy
muszą osiągnąć kworum w każdej przyszłej strefie kolokacji epoki w konfigurowalnym
czasie kworum przed przejściem epoki. W praktyce harmonogram epok może być
określony z pewnym wyprzedzeniem, tak aby głosowanie w epoce n wybierało strefę dla
epoki n + k. Głosy są oddawane za pośrednictwem programu rejestru w łańcuchu, wykorzystującego globalne
klucze walidatorów, z siłą głosu ważoną według stawki. Proces ten wykorzystuje klucze globalne, a nie
klucze stref, ponieważ nie jest wrażliwy na opóźnienia i wymaga maksymalnego bezpieczeństwa.
Proces głosowania wymaga kwalifikowanej większości wagi stawki, aby ustalić kworum, zapewniając, że
niewielka grupa walidatorów nie może jednostronnie wymusić zmiany strefy. Jeśli walidatorzy nie osiągną kworum w wyznaczonym czasie, sieć automatycznie przejdzie w tryb globalnego konsensusu na następną epokę. Ten mechanizm awaryjny zapewnia ciągłość sieci, nawet gdy walidatorzy nie mogą uzgodnić strefy wspólnej lokalizacji. W trakcie głosowania walidatorzy sygnalizują zarówno preferowaną strefę na następną epokę, jak i docelowy czas bloku dla tej strefy. Ten wspólny wybór parametrów lokalizacji i wydajności pozwala sieci zoptymalizować ją pod kątem zarówno ograniczeń fizycznych, jak i wydajności każdej strefy. Co ważne, okres głosowania zapewnia walidatorom czas na przygotowanie infrastruktury w wybranej strefie, w tym na rozgrzanie kluczy specyficznych dla danej strefy i przetestowanie łączności sieciowej. Ten okres przygotowawczy jest kluczowy dla utrzymania stabilności sieci podczas przejść między strefami.

4.5 Tryb globalnego konsensusu
Tryb globalnego konsensusu służy zarówno jako mechanizm awaryjny, jak i podstawowa funkcja bezpieczeństwa
protokołu. Chociaż Fogo osiąga najwyższą wydajność dzięki konsensusowi
strefowemu, możliwość powrotu do konsensusu globalnego zapewnia ciągłą pracę sieci
w niesprzyjających warunkach. W trybie globalnego konsensusu sieć działa z
konserwatywnymi parametrami zoptymalizowanymi pod kątem globalnie rozproszonej walidacji: stałym czasem bloku 400 ms
i zmniejszonym rozmiarem bloku, aby uwzględnić większe opóźnienia sieciowe między
geograficznie rozproszonymi walidatorami.
Protokół przechodzi do trybu globalnego konsensusu dwiema głównymi ścieżkami:
● Nieudany wybór strefy: Jeśli walidatorzy nie osiągną kworum w strefie konsensusu następnej epoki
w wyznaczonym okresie głosowania, sieć automatycznie
domyślnie przechodzi na konsensus globalny dla tej epoki.
● Błąd konsensusu w czasie wykonywania: Jeśli bieżąca strefa nie osiągnie finalności bloku w
wyznaczonym okresie limitu czasu w epoce, protokół natychmiast przełącza się
w tryb globalnego konsensusu na pozostałą część tej epoki. To rozwiązanie awaryjne jest „trwałe” –
po uruchomieniu w połowie epoki sieć pozostaje w globalnym konsensusie do następnej
przejścia epoki, priorytetyzując stabilność nad odzyskiwaniem wydajności.
W trybie globalnego konsensusu walidatory uczestniczą, używając wyznaczonego klucza do globalnego
działania, który może, ale nie musi, być jednym z kluczy specyficznych dla danej strefy, a sieć
zachowuje te same reguły wyboru rozwidlenia, co konsensus oparty na strefie. Chociaż ten tryb poświęca
bardzo niskie opóźnienie osiągalne w strefach współlokowanych, zapewnia solidną podstawę dla
ciągłości sieci i pokazuje, jak Fogo utrzymuje bezpieczeństwo bez poświęcania
żywotności w warunkach degradacji.

5. Zestaw walidatorów
Aby osiągnąć wysoką wydajność i ograniczyć nadużycia związane z MEV, Fogo będzie korzystać z
wyselekcjonowanego zestawu walidatorów. Jest to konieczne, ponieważ nawet niewielka część niedostatecznie wyposażonych węzłów walidujących może uniemożliwić sieci osiągnięcie fizycznych limitów wydajności.
Początkowo kuracja będzie działać w oparciu o dowód autoryzacji (Proof-of-authority), zanim przejdzie do bezpośredniego
udzielania uprawnień przez zestaw walidatorów. Umieszczając uprawnienia kuracyjne w zestawie walidatorów,
Fogo może egzekwować kary za niewłaściwe zachowania w warstwie społecznej, podobnie jak tradycyjny
system dowodu autoryzacji, ale w sposób, który nie jest bardziej scentralizowany niż siła forka, którą
2/3 udziałów posiada już w tradycyjnych sieciach PoS, takich jak Solana.

5.1 Rozmiar i konfiguracja początkowa
Fogo utrzymuje zestaw walidatorów z uprawnieniami, z minimalną i
maksymalną liczbą walidatorów egzekwowaną przez protokół, aby zapewnić wystarczającą decentralizację przy jednoczesnej optymalizacji
wydajności sieci. Początkowy rozmiar docelowy będzie wynosił około 20-50 walidatorów, chociaż
ten limit jest implementowany jako parametr protokołu, który można dostosować w miarę rozwoju sieci. W momencie genezy, początkowy zestaw walidatorów zostanie wybrany przez organ genezy, który
zachowa tymczasowe uprawnienia do zarządzania składem zestawu walidatorów na wczesnym etapie
działania sieci.

5.2 Zarządzanie i przejścia
Kontrola organu genezy nad członkostwem w zestawie walidatorów ma być
tymczasowa. Po początkowym okresie stabilizacji sieci, organ ten przejdzie na
sam zestaw walidatorów. Po tym przejściu zmiany w członkostwie w zestawie walidatorów będą
wymagać ponaddwóch trzecich stakowanych tokenów, co odpowiada progowi
wymaganemu w przypadku zmian na poziomie protokołu w sieciach Proof-of-Stake.
Aby zapobiec nagłym zmianom, które mogłyby zdestabilizować sieć, parametry protokołu ograniczają
stopień rotacji walidatorów. Nie można zastąpić lub usunąć więcej niż ustalony procent zestawu walidatorów w danym okresie, gdzie ten procent jest regulowanym parametrem
protokołu. Zapewnia to stopniową ewolucję zestawu walidatorów przy jednoczesnym zachowaniu
stabilności
sieci.

5.3 Wymagania dotyczące uczestnictwa
Aby kwalifikować się do
zestawu walidatorów, walidatorzy muszą spełniać minimalne wymagania dotyczące delegowanego udziału, zachowując zgodność z modelem ekonomicznym Solany, a jednocześnie dodając
komponent z uprawnieniami. Ten podwójny wymóg – odpowiedni udział i zatwierdzenie zestawu –
zapewnia, że walidatorzy mają zarówno zaangażowanie ekonomiczne, jak i możliwości operacyjne niezbędne do utrzymania wydajności sieci.

5.4 Uzasadnienie i zarządzanie siecią
Zestaw walidatorów z uprawnieniami nie wpływa istotnie na decentralizację sieci, ponieważ w
każdej sieci proof-of-stake, dwie trzecie udziałów może już wprowadzać
dowolne zmiany w protokole poprzez forkowanie. Zamiast tego mechanizm ten zapewnia
formalne ramy dla zestawu walidatorów, umożliwiające egzekwowanie korzystnych zachowań sieciowych, które w innym przypadku mogłyby być trudne do zakodowania w regułach protokołu.
Na przykład możliwość usuwania walidatorów umożliwia sieci reagowanie na:
● Uporczywe problemy z wydajnością, które obniżają możliwości sieci
● Nadużycia w ekstrakcji MEV, które negatywnie wpływają na użyteczność sieci
● Zachowania destabilizujące sieć, których nie można wymusić bezpośrednio w protokole, takie jak
wypłukiwanie, ale nieprzesyłanie bloków Turbine
● Inne zachowania, które, choć potencjalnie opłacalne dla poszczególnych walidatorów, szkodzą
długoterminowej wartości sieci
Ten mechanizm zarządzania uznaje, że chociaż pewne zachowania mogą być opłacalne
w krótkim okresie, mogą one zaszkodzić długoterminowej żywotności sieci. Umożliwiając
zestawowi walidatorów ważonych stawkami kontrolowanie takich zachowań poprzez kontrolę członkostwa, Fogo
dopasowuje zachęty dla walidatorów do długoterminowej kondycji sieci, nie naruszając
fundamentalnych właściwości decentralizacji, nieodłącznie związanych z systemami Proof-of-Stake.

6. Potencjalne rozszerzenia
Chociaż główne innowacje Fogo koncentrują się na konsensusie wielolokalnym, wydajności klienta i
zarządzaniu zestawem walidatorów, rozważanych jest kilka dodatkowych rozszerzeń protokołu,
zarówno na etapie początkowym, jak i po wdrożeniu. Funkcje te dodatkowo poprawią
funkcjonalność sieci, zachowując jednocześnie wsteczną kompatybilność z ekosystemem Solana.

6.1 Płatność za pomocą tokena SPL
Aby umożliwić szerszy dostęp do sieci i poprawić komfort użytkowania, Fogo potencjalnie
wprowadzi typ transakcji fee_payer_unsigned, który umożliwia wykonywanie transakcji
bez SOL na koncie źródłowym. Ta funkcja, w połączeniu z programem płatności opłat w łańcuchu,
umożliwia użytkownikom uiszczanie opłat transakcyjnych za pomocą tokenów SPL,
przy jednoczesnym zachowaniu bezpieczeństwa protokołu i wynagrodzenia walidatora.
System działa za pośrednictwem rynku przekaźników bez uprawnień poza protokołem. Użytkownicy
konstruują transakcje, które obejmują zarówno zamierzone operacje, jak i płatność za pomocą tokena SPL,
aby zrekompensować ostatecznemu płatnikowi opłaty. Transakcje te mogą być prawidłowo podpisane
bez określania płatnika opłaty, co pozwala każdej ze stron na ich dokończenie poprzez dodanie swojego
podpisu i uiszczenie opłat SOL. Ten mechanizm skutecznie oddziela autoryzację
transakcji od płatności opłat, umożliwiając kontom z zerowym saldem SOL interakcję z
siecią, o ile posiadają inne cenne aktywa.
Ta funkcja jest implementowana poprzez minimalne modyfikacje protokołu, wymagające jedynie
dodania nowego typu transakcji i programu on-chain do obsługi rekompensaty dla retransmiterów. System tworzy efektywny rynek dla usług retransmisji transakcji,
zachowując jednocześnie właściwości bezpieczeństwa protokołu bazowego. W przeciwieństwie do bardziej złożonych systemów abstrakcji opłat, to podejście nie wymaga zmian w mechanizmach płatności walidatorów
ani regułach konsensusu.

7. Wnioski
Fogo reprezentuje nowatorskie podejście do architektury blockchain, które podważa tradycyjne
założenia dotyczące relacji między wydajnością, decentralizacją i bezpieczeństwem.
Łącząc wysokowydajną implementację kliencką z dynamicznym, wielolokalnym
konsensusem i starannie dobranymi zestawami walidatorów, protokół osiąga bezprecedensową wydajność,
bez naruszania fundamentalnych właściwości bezpieczeństwa systemów proof-of-stake. Możliwość dynamicznego przenoszenia konsensusu przy jednoczesnym zachowaniu różnorodności geograficznej zapewnia
zarówno optymalizację wydajności, jak i odporność systemu, a mechanizmy awaryjne protokołu zapewniają ciągłość działania w niekorzystnych warunkach.
Dzięki starannemu projektowi ekonomicznemu mechanizmy te wyłaniają się naturalnie z zachęt walidatorów,
a nie z egzekwowania protokołu, tworząc solidny i elastyczny
system. Wraz z ciągłym rozwojem technologii blockchain, innowacje Fogo pokazują,
jak przemyślana konstrukcja protokołu może przesuwać granice wydajności,
przy jednoczesnym zachowaniu właściwości bezpieczeństwa i decentralizacji, które sprawiają, że sieci blockchain są
cenne.
`

// Persian (Farsi) - RTL
const PERSIAN_TEXT = `
فوگو: یک لایه ۱ SVM با عملکرد بالا
نسخه ۱.۰
چکیده
این مقاله فوگو، یک پروتکل بلاکچین لایه ۱ جدید را معرفی می‌کند که عملکرد فوق‌العاده‌ای را در توان عملیاتی، تأخیر و مدیریت ازدحام ارائه می‌دهد. فوگو به عنوان افزونه‌ای از پروتکل سولانا، سازگاری کامل را در لایه اجرای SVM حفظ می‌کند و به برنامه‌ها، ابزارها و زیرساخت‌های موجود سولانا اجازه می‌دهد تا به طور یکپارچه مهاجرت کنند و در عین حال به عملکرد بسیار بالاتر و تأخیر کمتری دست یابند.
فوگو سه نوآوری جدید ارائه می‌دهد:
● پیاده‌سازی کلاینت یکپارچه مبتنی بر Firedancer خالص، سطوح عملکردی را که توسط شبکه‌هایی با کلاینت‌های کندتر - از جمله خود سولانا - غیرقابل دستیابی هستند، آزاد می‌کند.
● اجماع چند محلی با هم مکانی پویا، به زمان‌ها و تأخیرهای بلوکی بسیار پایین‌تر از هر بلاکچین بزرگ دیگری دست می‌یابد.
● یک مجموعه اعتبارسنج گزینشی که عملکرد بالا را تشویق می‌کند و از رفتار غارتگرانه در سطح اعتبارسنج جلوگیری می‌کند. این نوآوری‌ها ضمن حفظ تمرکززدایی و استحکام ضروری برای یک بلاکچین لایه ۱، دستاوردهای عملکردی قابل توجهی را ارائه می‌دهند.

۱. مقدمه
شبکه‌های بلاکچین با چالش مداومی در ایجاد تعادل بین عملکرد، تمرکززدایی و امنیت مواجه هستند. بلاکچین‌های امروزی با محدودیت‌های شدید توان عملیاتی مواجه هستند که آنها را برای فعالیت‌های مالی جهانی نامناسب می‌کند. اتریوم کمتر از ۵۰ تراکنش در ثانیه (TPS) را در لایه پایه خود پردازش می‌کند. حتی متمرکزترین لایه‌های ۲ نیز کمتر از ۱۰۰۰ تراکنش در ثانیه را مدیریت می‌کنند. در حالی که سولانا برای عملکرد بالاتر طراحی شده بود، محدودیت‌های ناشی از تنوع مشتری در حال حاضر باعث ایجاد تراکم در ۵۰۰۰ تراکنش در ثانیه می‌شود. در مقابل، سیستم‌های مالی سنتی مانند NASDAQ، CME و Eurex به طور منظم بیش از ۱۰۰۰۰۰ عملیات در ثانیه را پردازش می‌کنند.

تاخیر، محدودیت حیاتی دیگری برای پروتکل‌های بلاکچین غیرمتمرکز است. در بازارهای مالی - به ویژه برای کشف قیمت دارایی‌های ناپایدار - تاخیر کم برای کیفیت بازار و نقدینگی ضروری است. شرکت‌کنندگان بازار سنتی با تأخیرهای سر به سر در مقیاس‌های میلی‌ثانیه یا زیر میلی‌ثانیه فعالیت می‌کنند. این سرعت‌ها تنها زمانی قابل دستیابی هستند که شرکت‌کنندگان بازار بتوانند به دلیل محدودیت‌های سرعت نور، با محیط اجرا هم‌مکانی داشته باشند.

معماری‌های بلاکچین سنتی از مجموعه‌های اعتبارسنج توزیع‌شده جهانی استفاده می‌کنند که بدون آگاهی جغرافیایی عمل می‌کنند و محدودیت‌های اساسی عملکرد را ایجاد می‌کنند. خود نور

بیش از ۱۳۰ میلی‌ثانیه طول می‌کشد تا کره زمین را در خط استوا طی کند، حتی اگر در یک دایره کامل حرکت کند - و مسیرهای شبکه دنیای واقعی شامل مسافت و تأخیرهای زیرساختی اضافی هستند. این محدودیت‌های فیزیکی زمانی تشدید می‌شوند که اجماع نیاز به چندین دور ارتباط بین اعتبارسنج‌ها داشته باشد. این تأخیرهای بین منطقه‌ای زمانی تشدید می‌شوند که اجماع نیاز به چندین دور ارتباط بین اعتبارسنج‌ها داشته باشد. در نتیجه، شبکه‌ها باید زمان‌های بلوک محافظه‌کارانه و تأخیرهای نهایی را برای حفظ ثبات پیاده‌سازی کنند. حتی در شرایط بهینه، یک مکانیسم اجماع توزیع‌شده جهانی

نمی‌تواند بر این تأخیرهای اساسی شبکه غلبه کند.

با ادغام بیشتر بلاکچین‌ها با سیستم مالی جهانی، کاربران عملکردی قابل مقایسه با سیستم‌های متمرکز امروزی را مطالبه خواهند کرد. بدون طراحی دقیق، برآورده کردن این خواسته‌ها می‌تواند به طور قابل توجهی تمرکززدایی و تاب‌آوری شبکه‌های بلاکچین را به خطر بیندازد. برای پرداختن به این چالش، ما بلاکچین لایه یک فوگو را پیشنهاد می‌کنیم. فلسفه اصلی فوگو به حداکثر رساندن توان عملیاتی و به حداقل رساندن تأخیر از طریق دو رویکرد کلیدی است: اول، استفاده از کارآمدترین نرم‌افزار کلاینت روی یک مجموعه اعتبارسنج غیرمتمرکز بهینه؛ و دوم، پذیرش اجماع هم‌مکان ضمن حفظ بیشتر مزایای تمرکززدایی اجماع جهانی.

۲. طرح کلی
این مقاله به بخش‌هایی تقسیم شده است که تصمیمات اصلی طراحی پیرامون فوگو را پوشش می‌دهد.

بخش ۳ رابطه فوگو با پروتکل بلاکچین سولانا و استراتژی آن را در رابطه با بهینه‌سازی و تنوع کلاینت پوشش می‌دهد. بخش ۴ اجماع چند محلی، پیاده‌سازی عملی آن و معاملاتی که نسبت به اجماع جهانی یا محلی انجام می‌دهد را پوشش می‌دهد. بخش ۵ رویکرد فوگو برای مقداردهی اولیه و نگهداری مجموعه اعتبارسنج را پوشش می‌دهد. بخش ۶ افزونه‌های احتمالی را که ممکن است پس از پیدایش معرفی شوند، پوشش می‌دهد.

۳. پروتکل و کلاینت‌ها
در لایه پایه، فوگو با ساخت بر روی کارآمدترین پروتکل بلاک‌چین تا به امروز، یعنی سولانا، شروع می‌کند. شبکه سولانا در حال حاضر با راه‌حل‌های بهینه‌سازی متعددی، چه از نظر طراحی پروتکل و چه از نظر پیاده‌سازی کلاینت، ارائه می‌شود. فوگو حداکثر سازگاری ممکن با سولانا را هدف قرار داده است، از جمله سازگاری کامل در لایه اجرای SVM و سازگاری نزدیک با اجماع TowerBFT، انتشار بلوک توربین، چرخش رهبر سولانا و سایر اجزای اصلی لایه‌های شبکه و اجماع. این سازگاری به فوگو اجازه می‌دهد تا به راحتی برنامه‌ها، ابزارها و زیرساخت‌های موجود از اکوسیستم سولانا را ادغام و مستقر کند؛ و همچنین از پیشرفت‌های مداوم بالادستی در سولانا بهره‌مند شود.

با این حال، برخلاف سولانا، فوگو با یک کلاینت استاندارد واحد اجرا خواهد شد. این کلاینت استاندارد، بالاترین عملکرد را در بین کلاینت‌های اصلی که روی سولانا اجرا می‌شوند، خواهد داشت. این امر به فوگو اجازه می‌دهد تا به عملکرد بسیار بالاتری دست یابد، زیرا شبکه همیشه با سرعت سریع‌ترین کلاینت اجرا می‌شود. در حالی که سولانا، که به دلیل تنوع کلاینت‌ها محدود شده است، همیشه با سرعت کندترین کلاینت دچار مشکل خواهد شد. در حال حاضر و آینده‌ی قابل پیش‌بینی، این کلاینت استاندارد بر اساس پشته‌ی Firedancer خواهد بود.

۳.۱ Firedancer
Firedancer پیاده‌سازی کلاینت سازگار با سولانا با عملکرد بالا از Jump Crypto است که از طریق پردازش موازی بهینه، مدیریت حافظه و دستورالعمل‌های SIMD، توان پردازش تراکنش بسیار بالاتری نسبت به کلاینت‌های اعتبارسنج فعلی نشان می‌دهد.

دو نسخه وجود دارد: "Frankendancer"، ترکیبی که از موتور پردازش Firedancer با پشته‌ی شبکه‌ی اعتبارسنج Rust استفاده می‌کند، و پیاده‌سازی کامل Firedancer با بازنویسی کامل پشته‌ی شبکه‌ی C، که در حال حاضر در مراحل پایانی توسعه است.

هر دو نسخه سازگاری پروتکل سولانا را حفظ می‌کنند و در عین حال عملکرد را به حداکثر می‌رسانند.

پس از تکمیل، انتظار می‌رود پیاده‌سازی خالص Firedancer معیارهای عملکرد جدیدی را تعیین کند که آن را برای نیازهای بالای Fogo ایده‌آل می‌کند. Fogo با یک شبکه‌ی مبتنی بر Frankendancer شروع می‌کند و در نهایت به Firedancer خالص منتقل می‌شود. ۳.۲ کلاینت‌های متعارف در مقابل تنوع کلاینت
پروتکل‌های بلاکچین از طریق نرم‌افزار کلاینتی که قوانین و مشخصات آنها را پیاده‌سازی می‌کند، عمل می‌کنند. در حالی که پروتکل‌ها قوانین عملکرد شبکه را تعریف می‌کنند، کلاینت‌ها این مشخصات را به نرم‌افزار اجرایی تبدیل می‌کنند. رابطه بین پروتکل‌ها و کلاینت‌ها از نظر تاریخی از مدل‌های مختلفی پیروی کرده است، به طوری که برخی از شبکه‌ها به طور فعال تنوع کلاینت را ترویج می‌دهند در حالی که برخی دیگر به طور طبیعی به پیاده‌سازی‌های متعارف همگرا می‌شوند.
تنوع کلاینت به طور سنتی چندین هدف را دنبال می‌کند: افزونگی پیاده‌سازی را فراهم می‌کند، تأیید مستقل قوانین پروتکل را امکان‌پذیر می‌سازد و از نظر تئوری خطر آسیب‌پذیری‌های نرم‌افزاری در سطح شبکه را کاهش می‌دهد. شبکه بیت‌کوین سابقه جالبی را نشان می‌دهد - در حالی که پیاده‌سازی‌های کلاینت متعددی وجود دارد، Bitcoin Core به عنوان کلاینت متعارف بالفعل عمل می‌کند و پیاده‌سازی مرجعی را ارائه می‌دهد که رفتار عملی شبکه را تعریف می‌کند.
با این حال، در شبکه‌های بلاکچین با کارایی بالا، رابطه بین پیاده‌سازی پروتکل و کلاینت محدودتر می‌شود. هنگامی که یک پروتکل به محدودیت‌های فیزیکی سخت‌افزار محاسباتی و شبکه‌ای نزدیک می‌شود، فضای تنوع پیاده‌سازی به طور طبیعی کاهش می‌یابد. در این مرزهای عملکرد، پیاده‌سازی‌های بهینه باید به راه‌حل‌های مشابهی برسند، زیرا با محدودیت‌های فیزیکی و الزامات عملکرد یکسانی روبرو هستند. هرگونه انحراف قابل توجه از الگوهای پیاده‌سازی بهینه منجر به عملکرد ضعیفی می‌شود که کلاینت را برای عملیات اعتبارسنجی غیرقابل استفاده می‌کند. این پویایی به ویژه در شبکه‌هایی که حداقل زمان بلوک ممکن و حداکثر توان عملیاتی تراکنش را هدف قرار می‌دهند، قابل مشاهده است. در چنین سیستم‌هایی، مزایای نظری تنوع کلاینت کمتر اهمیت پیدا می‌کند، زیرا سربار حفظ سازگاری بین پیاده‌سازی‌های کلاینت مختلف می‌تواند خود به یک گلوگاه عملکرد تبدیل شود. هنگام افزایش عملکرد بلاکچین به محدودیت‌های فیزیکی، پیاده‌سازی‌های کلاینت لزوماً تصمیمات معماری اصلی را به اشتراک می‌گذارند و مزایای امنیتی تنوع پیاده‌سازی را تا حد زیادی نظری می‌کنند.
۳.۳ مشوق‌های پروتکل برای کلاینت‌های کارآمد
در حالی که فوگو هرگونه پیاده‌سازی کلاینت منطبق را مجاز می‌داند، معماری آن به طور طبیعی استفاده از کلاینت‌های موجود با بالاترین عملکرد را که ناشی از خواسته‌های عملی عملیات‌های هم‌مکان با عملکرد بالا است، تشویق می‌کند.

برخلاف شبکه‌های سنتی که فاصله جغرافیایی تنگناهای اصلی را ایجاد می‌کند، طراحی هم‌مکان فوگو به این معنی است که کارایی پیاده‌سازی کلاینت مستقیماً عملکرد اعتبارسنج را تعیین می‌کند. در این محیط، تأخیر شبکه حداقل است و سرعت کلاینت را به عامل حیاتی تبدیل می‌کند.

پارامترهای زمان و اندازه بلوک پویای شبکه، فشار اقتصادی را برای به حداکثر رساندن توان عملیاتی ایجاد می‌کنند. اعتبارسنج‌ها باید بین استفاده از سریع‌ترین کلاینت یا ریسک جریمه و کاهش درآمد یکی را انتخاب کنند. کسانی که کلاینت‌های کندتر را اجرا می‌کنند یا با رأی دادن به پارامترهای تهاجمی، ریسک از دست دادن بلوک‌ها را به جان می‌خرند یا با رأی دادن به پارامترهای محافظه‌کارانه، درآمد خود را از دست می‌دهند.

این امر باعث ایجاد انتخاب طبیعی برای کارآمدترین پیاده‌سازی کلاینت می‌شود. در محیط هم‌مکان Fogo، حتی تفاوت‌های کوچک در عملکرد نیز قابل توجه می‌شوند - یک کلاینت کمی کندتر به طور مداوم عملکرد ضعیفی خواهد داشت و منجر به از دست دادن بلوک‌ها و جریمه‌ها می‌شود. این بهینه‌سازی از طریق منافع شخصی اعتبارسنج اتفاق می‌افتد، نه از طریق قوانین پروتکل.

در حالی که انتخاب کلاینت نمی‌تواند مستقیماً توسط پروتکل اعمال شود، فشارهای اقتصادی به طور طبیعی شبکه را به سمت کارآمدترین پیاده‌سازی سوق می‌دهند و در عین حال توسعه رقابتی کلاینت را حفظ می‌کنند.

۴. اجماع چند محلی
اجماع چند محلی رویکردی جدید برای اجماع بلاکچین است که به صورت پویا مزایای عملکرد هم‌مکان بودن اعتبارسنج را با مزایای امنیتی توزیع جغرافیایی متعادل می‌کند. این سیستم به اعتبارسنج‌ها اجازه می‌دهد تا مکان‌های فیزیکی خود را در طول دوره‌ها هماهنگ کنند و در عین حال هویت‌های رمزنگاری متمایز را برای مناطق مختلف حفظ کنند و شبکه را قادر می‌سازد تا در طول عملیات عادی به اجماع با تأخیر بسیار کم دست یابد و در عین حال توانایی بازگشت به اجماع جهانی را در صورت نیاز حفظ کند. مدل اجماع چند محلی فوگو از رویه‌های تثبیت‌شده در بازارهای مالی سنتی، به‌ویژه مدل معاملاتی «دنبال خورشید» که در بورس ارز و سایر بازارهای جهانی استفاده می‌شود، الهام می‌گیرد. در امور مالی سنتی، بازارسازی و تأمین نقدینگی به‌طور طبیعی با پیشرفت روز معاملاتی - از آسیا به اروپا و آمریکای شمالی - بین مراکز مالی اصلی جابجا می‌شوند و امکان عملیات مداوم بازار را فراهم می‌کنند و در عین حال نقدینگی متمرکز را در مناطق جغرافیایی خاص حفظ می‌کنند. این مدل در امور مالی سنتی مؤثر بوده است زیرا تشخیص می‌دهد که اگرچه بازارها جهانی هستند، محدودیت‌های فیزیکی شبکه و زمان واکنش انسان، درجه‌ای از تمرکز جغرافیایی را برای کشف قیمت بهینه و کارایی بازار ضروری می‌کند.

۴.۱ مناطق و چرخش منطقه
یک منطقه نشان‌دهنده یک منطقه جغرافیایی است که اعتبارسنج‌ها برای دستیابی به عملکرد مطلوب اجماع در آن مکان مشترک دارند. در حالت ایده‌آل، یک منطقه یک مرکز داده واحد است که در آن تأخیر شبکه بین اعتبارسنج‌ها به محدودیت‌های سخت‌افزاری نزدیک می‌شود. با این حال، مناطق می‌توانند در صورت لزوم گسترش یابند تا مناطق بزرگ‌تری را در بر گیرند و برخی از عملکردها را برای ملاحظات عملی مبادله کنند. تعریف دقیق یک منطقه از طریق اجماع اجتماعی بین اعتبارسنج‌ها به دست می‌آید، نه اینکه به طور دقیق در پروتکل تعریف شده باشد. این انعطاف‌پذیری به شبکه اجازه می‌دهد تا با محدودیت‌های زیرساخت دنیای واقعی سازگار شود و در عین حال اهداف عملکردی را حفظ کند. توانایی شبکه برای چرخش بین مناطق، چندین هدف حیاتی را دنبال می‌کند:

1. تمرکززدایی قضایی: چرخش منظم منطقه از کسب اجماع توسط هر حوزه قضایی واحد جلوگیری می‌کند. این امر مقاومت شبکه را در برابر فشار نظارتی حفظ می‌کند و تضمین می‌کند که هیچ دولت یا مرجع واحدی نمی‌تواند کنترل بلندمدتی بر عملکرد شبکه اعمال کند.

2. تاب‌آوری زیرساخت: مراکز داده و زیرساخت‌های منطقه‌ای می‌توانند به دلایل متعددی - بلایای طبیعی، قطع برق، مشکلات شبکه، خرابی سخت‌افزار یا الزامات نگهداری - از کار بیفتند. چرخش منطقه تضمین می‌کند که شبکه به طور دائم به هیچ نقطه خرابی واحدی وابسته نباشد. نمونه‌های تاریخی از قطعی‌های عمده مرکز داده، مانند مواردی که ناشی از رویدادهای شدید آب و هوایی یا خرابی‌های شبکه برق است، اهمیت این انعطاف‌پذیری را نشان می‌دهد. ۳. بهینه‌سازی عملکرد استراتژیک: می‌توان مناطق را برای بهینه‌سازی فعالیت‌های خاص شبکه انتخاب کرد. به عنوان مثال، در طول دوره‌هایی که شامل رویدادهای مالی مهم (مانند اعلامیه‌های فدرال رزرو، گزارش‌های اقتصادی مهم یا بازگشایی بازار) هستند، اعتبارسنج‌ها ممکن است تصمیم بگیرند که اجماع را در نزدیکی منبع این اطلاعات حساس به قیمت قرار دهند. این قابلیت به شبکه اجازه می‌دهد تا تأخیر را برای عملیات حیاتی به حداقل برساند و در عین حال انعطاف‌پذیری را برای موارد استفاده مختلف در دوره‌های مختلف حفظ کند.
۴.۲ مدیریت کلید
این پروتکل یک سیستم مدیریت کلید دو لایه را پیاده‌سازی می‌کند که هویت اعتبارسنج بلندمدت را از مشارکت اجماع مختص به هر منطقه جدا می‌کند. هر اعتبارسنج یک جفت کلید سراسری را نگهداری می‌کند که به عنوان هویت ریشه آنها در شبکه عمل می‌کند. این کلید سراسری برای عملیات سطح بالا مانند واگذاری سهام، ثبت منطقه و مشارکت در اجماع سراسری استفاده می‌شود. کلید سراسری باید با بالاترین اقدامات امنیتی ممکن ایمن شود، زیرا نشان دهنده اختیار نهایی اعتبارسنج در شبکه است.

اعتبارسنج‌ها می‌توانند از طریق یک برنامه ثبت درون زنجیره‌ای، اختیار را به زیرکلیدهای مختص به هر منطقه واگذار کنند. این زیرکلیدها به طور خاص برای مشارکت در اجماع در مناطق مشترک تعیین شده مجاز هستند. این جداسازی اهداف امنیتی متعددی را دنبال می‌کند:

به اعتبارسنج‌ها اجازه می‌دهد تا مدل‌های امنیتی متفاوتی را برای انواع مختلف کلید حفظ کنند،

با فعال نگه داشتن کلیدهای سراسری در حین عملیات عادی، افشای آنها را به حداقل می‌رساند، و

خطر به خطر افتادن کلید را در حین انتقال زیرساخت‌های فیزیکی بین مناطق کاهش می‌دهد. واگذاری کلیدهای مختص هر منطقه از طریق یک برنامه درون زنجیره‌ای مدیریت می‌شود که فهرستی از کلیدهای منطقه مجاز را برای هر اعتبارسنج نگهداری می‌کند. در حالی که اعتبارسنج‌ها می‌توانند کلیدهای منطقه جدید را در هر زمان با استفاده از کلید جهانی خود ثبت کنند، این ثبت‌ها فقط در مرزهای دوره انجام می‌شوند. این تأخیر تضمین می‌کند که همه شرکت‌کنندگان شبکه زمان لازم برای تأیید و ثبت واگذاری‌های کلید جدید را قبل از فعال شدن در اجماع داشته باشند.

۴.۳ پیشنهاد و فعال‌سازی منطقه
مناطق جدید را می‌توان از طریق یک مکانیسم مدیریت درون زنجیره‌ای با استفاده از کلیدهای جهانی پیشنهاد داد. با این حال، برای اطمینان از پایداری شبکه و دادن زمان کافی به اعتبارسنج‌ها برای آماده‌سازی زیرساخت امن، مناطق پیشنهادی قبل از واجد شرایط شدن برای انتخاب، یک دوره تأخیر اجباری دارند. این تأخیر، که به عنوان یک پارامتر پروتکل تنظیم می‌شود، باید به اندازه کافی طولانی باشد تا به اعتبارسنج‌ها اجازه دهد:
● ایمن‌سازی زیرساخت فیزیکی مناسب در منطقه جدید
● ایجاد سیستم‌های مدیریت کلید امن برای مکان جدید
● راه‌اندازی و آزمایش زیرساخت شبکه
● انجام ممیزی‌های امنیتی لازم از تأسیسات جدید
● ایجاد رویه‌های پشتیبان‌گیری و بازیابی
دوره تأخیر همچنین به عنوان یک اقدام امنیتی در برابر حملات احتمالی عمل می‌کند که در آن یک عامل مخرب ممکن است سعی کند اجماع را به منطقه‌ای که در آن مزایای زیرساختی دارد، تحمیل کند. با الزام اطلاع قبلی برای مناطق جدید، پروتکل
تضمین می‌کند که همه اعتبارسنج‌ها فرصت منصفانه‌ای برای ایجاد حضور در هر منطقه‌ای که ممکن است برای اجماع انتخاب شود، دارند.
تنها پس از اینکه یک منطقه این دوره انتظار را به پایان رساند، می‌توان آن را از طریق فرآیند رأی‌گیری منظم منطقه برای دوره‌های آینده انتخاب کرد. این رویکرد دقیق برای فعال‌سازی منطقه به حفظ امنیت و ثبات شبکه کمک می‌کند و در عین حال امکان اضافه کردن مکان‌های استراتژیک جدید را با تکامل الزامات شبکه فراهم می‌کند. ۴.۴ فرآیند رأی‌گیری انتخاب منطقه
انتخاب مناطق اجماع از طریق یک مکانیسم رأی‌گیری درون زنجیره‌ای انجام می‌شود که نیاز به حرکت هماهنگ اعتبارسنج را با امنیت شبکه متعادل می‌کند. اعتبارسنج‌ها باید در هر منطقه مشترک دوره آینده، در یک زمان حد نصاب قابل تنظیم قبل از انتقال دوره، به حد نصاب برسند. در عمل، برنامه دوره ممکن است با مقداری زمان انتظار تعیین شود، به طوری که رأی‌گیری در طول دوره n، منطقه را برای دوره n + k انتخاب می‌کند. آرا از طریق یک برنامه ثبت درون زنجیره‌ای با استفاده از کلیدهای جهانی اعتبارسنج‌ها، با قدرت رأی‌دهی که بر اساس سهام وزن‌دهی می‌شود، داده می‌شوند. این فرآیند از کلیدهای جهانی به جای کلیدهای منطقه استفاده می‌کند، زیرا به تأخیر حساس نیست و به حداکثر امنیت نیاز دارد.

فرآیند رأی‌گیری برای ایجاد حد نصاب به اکثریت مطلق وزن سهام نیاز دارد و تضمین می‌کند که گروه کوچکی از اعتبارسنج‌ها نمی‌توانند به طور یکجانبه تغییر منطقه را اعمال کنند. اگر اعتبارسنج‌ها نتوانند در بازه زمانی تعیین شده به حد نصاب برسند، شبکه به طور خودکار برای دوره بعدی به حالت اجماع جهانی می‌رود. این مکانیزم پشتیبان، تداوم شبکه را حتی زمانی که اعتبارسنج‌ها نمی‌توانند بر سر یک منطقه مشترک به توافق برسند، تضمین می‌کند.

در طول دوره رأی‌گیری، اعتبارسنج‌ها هم منطقه مورد نظر خود را برای دوره بعدی و هم زمان بلوک هدف خود را برای آن منطقه اعلام می‌کنند. این انتخاب مشترک پارامترهای مکان و عملکرد، به شبکه اجازه می‌دهد تا هم محدودیت‌های فیزیکی و هم قابلیت‌های عملکرد هر منطقه را بهینه کند. نکته مهم این است که دوره رأی‌گیری، زمانی را برای اعتبارسنج‌ها فراهم می‌کند تا زیرساخت‌ها را در منطقه انتخاب شده آماده کنند، از جمله گرم کردن کلیدهای خاص منطقه و آزمایش اتصال شبکه. این دوره آماده‌سازی برای حفظ پایداری شبکه در طول انتقال منطقه بسیار مهم است.
۴.۵ حالت اجماع جهانی
حالت اجماع جهانی هم به عنوان یک مکانیسم پشتیبان و هم به عنوان یک ویژگی ایمنی بنیادی پروتکل عمل می‌کند. در حالی که Fogo از طریق اجماع مبتنی بر منطقه به بالاترین عملکرد خود دست می‌یابد، توانایی بازگشت به اجماع جهانی، ادامه عملکرد شبکه را در شرایط نامطلوب تضمین می‌کند. در حالت اجماع جهانی، شبکه با پارامترهای محافظه‌کارانه‌ای که برای اعتبارسنجی توزیع‌شده جهانی بهینه شده‌اند، کار می‌کند: زمان بلوک ثابت ۴۰۰ میلی‌ثانیه و اندازه بلوک کاهش‌یافته برای تطبیق با تأخیرهای بالاتر شبکه بین اعتبارسنج‌های پراکنده جغرافیایی.

پروتکل از طریق دو مسیر اصلی وارد حالت اجماع جهانی می‌شود:

● انتخاب ناموفق منطقه: اگر اعتبارسنج‌ها نتوانند در دوره رأی‌گیری تعیین‌شده در منطقه اجماع دوره بعدی به حد نصاب برسند، شبکه به طور خودکار برای آن دوره به اجماع جهانی روی می‌آورد.

● شکست اجماع زمان اجرا: اگر منطقه فعلی نتواند در دوره مهلت تعیین‌شده خود در طول یک دوره به قطعیت بلوک برسد، پروتکل بلافاصله برای بقیه آن دوره به حالت اجماع جهانی تغییر می‌کند. این پشتیبان «چسبنده» است -

پس از فعال شدن در اواسط دوره، شبکه تا زمان انتقال دوره بعدی در اجماع جهانی باقی می‌ماند و ثبات را بر بازیابی عملکرد اولویت می‌دهد.

در حالت اجماع جهانی، اعتبارسنج‌ها با استفاده از یک کلید تعیین‌شده برای عملیات جهانی، که ممکن است یکی از کلیدهای خاص منطقه آنها باشد یا نباشد، شرکت می‌کنند و شبکه

همان قوانین انتخاب فورک را مانند اجماع مبتنی بر منطقه حفظ می‌کند. در حالی که این حالت

تاخیر بسیار کم قابل دستیابی در مناطق هم‌مکان را از دست می‌دهد، پایه محکمی برای تداوم شبکه فراهم می‌کند و نشان می‌دهد که چگونه فوگو ایمنی را بدون از دست دادن حیات در شرایط تخریب‌شده حفظ می‌کند.

5. مجموعه اعتبارسنج

برای دستیابی به عملکرد بالا و کاهش شیوه‌های سوءاستفاده از MEV، فوگو از یک مجموعه اعتبارسنج گزینش‌شده استفاده خواهد کرد. این امر ضروری است زیرا حتی بخش کوچکی از گره‌های اعتبارسنج با کمبود منابع می‌توانند مانع از رسیدن شبکه به محدودیت‌های عملکرد فیزیکی آن شوند.

در ابتدا، گزینش از طریق اثبات اختیار قبل از انتقال به مجوز مستقیم توسط مجموعه اعتبارسنج انجام می‌شود. با قرار دادن اختیار گزینش در کنار مجموعه اعتبارسنج‌ها، فوگو می‌تواند مانند یک سیستم سنتی اثبات اختیار، مجازات لایه اجتماعی رفتار سوءاستفاده‌گر را اعمال کند، اما به گونه‌ای که متمرکزتر از قدرت فورکی که در حال حاضر دو سوم سهام در شبکه‌های سنتی اثبات سهام مانند سولانا در اختیار دارد، نباشد.

5.1 اندازه و پیکربندی اولیه
فوگو یک مجموعه اعتبارسنج مجاز با حداقل و حداکثر تعداد اعتبارسنج‌های اعمال‌شده توسط پروتکل را برای اطمینان از عدم تمرکز کافی و در عین حال بهینه‌سازی عملکرد شبکه، حفظ می‌کند. اندازه هدف اولیه تقریباً 20 تا 50 اعتبارسنج خواهد بود، اگرچه این محدودیت به عنوان یک پارامتر پروتکل پیاده‌سازی می‌شود که می‌تواند با بالغ شدن شبکه تنظیم شود. در پیدایش، مجموعه اعتبارسنج اولیه توسط یک مرجع پیدایش انتخاب می‌شود که مجوزهای موقت را برای مدیریت ترکیب مجموعه اعتبارسنج‌ها در طول مراحل اولیه شبکه حفظ می‌کند.

5.2 مدیریت و انتقال‌ها
کنترل مرجع پیدایش بر عضویت در مجموعه اعتبارسنج‌ها به گونه‌ای طراحی شده است که موقت باشد. پس از یک دوره اولیه تثبیت شبکه، این اختیار به خود مجموعه اعتبارسنج منتقل خواهد شد. پس از این انتقال، تغییرات در عضویت مجموعه اعتبارسنج نیاز به اکثریت مطلق دو سوم توکن‌های سپرده‌گذاری شده دارد که با همان آستانه مورد نیاز برای تغییرات سطح پروتکل در شبکه‌های اثبات سهام مطابقت دارد.

برای جلوگیری از تغییرات ناگهانی که می‌تواند شبکه را بی‌ثبات کند، پارامترهای پروتکل، نرخ گردش اعتبارسنج را محدود می‌کنند. بیش از یک درصد ثابت از مجموعه اعتبارسنج نمی‌تواند در یک دوره زمانی معین جایگزین یا حذف شود، که این درصد یک پارامتر پروتکل قابل تنظیم است. این امر تکامل تدریجی مجموعه اعتبارسنج را در عین حفظ پایداری شبکه تضمین می‌کند.

5.3 الزامات مشارکت
اعتبارسنج‌ها باید حداقل الزامات سهام واگذار شده را برای واجد شرایط بودن برای مجموعه اعتبارسنج برآورده کنند و سازگاری با مدل اقتصادی سولانا را حفظ کنند و در عین حال مؤلفه مجاز را اضافه کنند. این الزام دوگانه - سهام کافی و تأیید مجموعه - تضمین می‌کند که اعتبارسنج‌ها هم از نظر اقتصادی در بازی حضور دارند و هم از قابلیت‌های عملیاتی برای حفظ عملکرد شبکه برخوردارند.۵.۴ منطق و مدیریت شبکه
مجموعه اعتبارسنج‌های مجاز تأثیر قابل توجهی بر تمرکززدایی شبکه ندارد، همانطور که در هر شبکه اثبات سهام، اکثریت مطلق دو سوم سهام می‌تواند از طریق انشعاب، تغییرات دلخواه را در پروتکل اعمال کند. در عوض، این مکانیسم یک چارچوب رسمی برای مجموعه اعتبارسنج فراهم می‌کند تا رفتارهای مفید شبکه را که در غیر این صورت کدگذاری آنها در قوانین پروتکل دشوار است، اعمال کند.

به عنوان مثال، توانایی حذف اعتبارسنج‌ها، شبکه را قادر می‌سازد تا به موارد زیر پاسخ دهد:
● مشکلات عملکرد مداوم که قابلیت‌های شبکه را کاهش می‌دهند
● استخراج MEV سوءاستفاده‌گرانه که به قابلیت استفاده شبکه آسیب می‌رساند
● رفتار بی‌ثبات‌کننده شبکه که نمی‌توان مستقیماً در پروتکل اعمال کرد، مانند

شستشو اما عدم ارسال بلوک‌های توربین
● سایر رفتارهایی که، در حالی که به طور بالقوه برای اعتبارسنج‌های فردی سودآور هستند، به ارزش بلندمدت شبکه آسیب می‌رسانند

این مکانیسم مدیریت تشخیص می‌دهد که اگرچه برخی رفتارها ممکن است در کوتاه‌مدت سودآور باشند، اما می‌توانند به پایداری بلندمدت شبکه آسیب برسانند. با فعال کردن مجموعه اعتبارسنج وزن‌دار سهام برای نظارت بر چنین رفتارهایی از طریق کنترل عضویت، فوگو (Fogo) انگیزه‌های اعتبارسنج را با سلامت بلندمدت شبکه همسو می‌کند، بدون اینکه به ویژگی‌های اساسی تمرکززدایی ذاتی سیستم‌های اثبات سهام آسیبی وارد شود.

6. افزونه‌های آینده‌نگر
در حالی که نوآوری‌های اصلی فوگو بر اجماع چند محلی، عملکرد کلاینت و مدیریت مجموعه اعتبارسنج متمرکز است، چندین افزونه پروتکل اضافی برای پیاده‌سازی اولیه یا پس از راه‌اندازی در دست بررسی است. این ویژگی‌ها عملکرد شبکه را افزایش می‌دهند و در عین حال سازگاری معکوس با اکوسیستم سولانا (Solana) را حفظ می‌کنند.

6.1 پرداخت کارمزد توکن SPL
برای فعال کردن دسترسی گسترده‌تر به شبکه و بهبود تجربه کاربر، فوگو به طور بالقوه یک نوع تراکنش fee_payer_unsigned را معرفی خواهد کرد که امکان اجرای تراکنش‌ها را بدون SOL در حساب مبدا فراهم می‌کند. این ویژگی، همراه با یک برنامه پرداخت کارمزد درون زنجیره‌ای، کاربران را قادر می‌سازد تا کارمزد تراکنش‌ها را با استفاده از توکن‌های SPL پرداخت کنند و در عین حال امنیت پروتکل و پاداش اعتبارسنج را حفظ کنند. این سیستم از طریق یک بازار رله بدون مجوز خارج از پروتکل کار می‌کند. کاربران تراکنش‌هایی را ایجاد می‌کنند که شامل عملیات مورد نظر آنها و پرداخت توکن SPL برای جبران پرداخت‌کننده نهایی کارمزد است. این تراکنش‌ها می‌توانند بدون مشخص کردن پرداخت‌کننده کارمزد، به طور معتبر امضا شوند و به هر طرف اجازه می‌دهند با اضافه کردن امضای خود و پرداخت کارمزد SOL آنها را تکمیل کند. این مکانیسم به طور مؤثر مجوز تراکنش را از پرداخت کارمزد جدا می‌کند و به حساب‌هایی با موجودی SOL صفر اجازه می‌دهد تا زمانی که دارایی‌های ارزشمند دیگری دارند، با شبکه تعامل داشته باشند. این ویژگی از طریق حداقل اصلاحات پروتکل پیاده‌سازی می‌شود و فقط به اضافه کردن نوع تراکنش جدید و یک برنامه درون زنجیره‌ای برای مدیریت جبران کارمزد رله نیاز دارد. این سیستم یک بازار کارآمد برای خدمات رله تراکنش ایجاد می‌کند و در عین حال ویژگی‌های امنیتی پروتکل زیربنایی را حفظ می‌کند. برخلاف سیستم‌های پیچیده‌تر انتزاع کارمزد، این رویکرد نیازی به تغییر در مکانیسم‌های پرداخت اعتبارسنج یا قوانین اجماع ندارد.

7. نتیجه‌گیری
Fogo رویکردی جدید به معماری بلاکچین ارائه می‌دهد که فرضیات سنتی در مورد رابطه بین عملکرد، عدم تمرکز و امنیت را به چالش می‌کشد. با ترکیب پیاده‌سازی کلاینت با کارایی بالا با اجماع چند محلی پویا و مجموعه‌های اعتبارسنج گزینش‌شده، این پروتکل به عملکرد بی‌سابقه‌ای دست می‌یابد، بدون اینکه ویژگی‌های امنیتی اساسی سیستم‌های اثبات سهام را به خطر بیندازد. توانایی جابجایی پویای اجماع ضمن حفظ تنوع جغرافیایی، بهینه‌سازی عملکرد و انعطاف‌پذیری سیستمی را فراهم می‌کند، در حالی که مکانیسم‌های پشتیبان پروتکل، عملکرد مداوم را در شرایط نامطلوب تضمین می‌کنند. از طریق طراحی اقتصادی دقیق، این مکانیسم‌ها به طور طبیعی از انگیزه‌های اعتبارسنج‌ها ناشی می‌شوند، نه از طریق اجرای پروتکل، و یک سیستم قوی و سازگار ایجاد می‌کنند. با تکامل مداوم فناوری بلاکچین، نوآوری‌های فوگو نشان می‌دهد که چگونه طراحی متفکرانه پروتکل می‌تواند مرزهای عملکرد را جابجا کند و در عین حال ویژگی‌های امنیتی و تمرکززدایی را که شبکه‌های بلاکچین را ارزشمند می‌کند، حفظ کند.
`

// Arabic - RTL
const ARABIC_TEXT = `
Fogo: بروتوكول SVM عالي الأداء من الطبقة 1
الإصدار 1.0
ملخص
تقدم هذه الورقة البحثية بروتوكول Fogo، وهو بروتوكول بلوكتشين مبتكر من الطبقة 1، يُقدم أداءً فائقًا في الإنتاجية، وزمن الوصول، وإدارة الازدحام. باعتباره امتدادًا لبروتوكول Solana، يحافظ Fogo على التوافق الكامل في طبقة تنفيذ SVM، مما يسمح لبرامج Solana وأدواتها وبنيتها التحتية الحالية بالانتقال بسلاسة مع تحقيق أداء أعلى بكثير وزمن وصول أقل.

يُقدم Fogo ثلاثة ابتكارات جديدة:
● تطبيق موحد للعميل يعتمد على Firedancer، مما يُتيح مستويات أداء لا يمكن تحقيقها بواسطة الشبكات ذات العملاء الأبطأ - بما في ذلك Solana نفسها.
● توافق متعدد المواقع مع مشاركة ديناميكية، مما يُحقق أوقات كتلة وأزمنة وصول أقل بكثير من تلك المُتاحة في أي سلسلة بلوكتشين رئيسية.
● مجموعة مُنسقة من أدوات التحقق تُحفز الأداء العالي وتردع السلوكيات الاستغلالية على مستوى أداة التحقق.
تُحقق هذه الابتكارات مكاسب كبيرة في الأداء مع الحفاظ على اللامركزية والمتانة الضروريتين لسلسلة الكتل من الطبقة الأولى.

1. مقدمة
تواجه شبكات سلسلة الكتل تحديًا مستمرًا في موازنة الأداء مع اللامركزية والأمان. تعاني سلاسل الكتل اليوم من قيود شديدة على الإنتاجية، مما يجعلها غير مناسبة للنشاط المالي العالمي. تُعالج إيثريوم أقل من 50 معاملة في الثانية (TPS) على طبقتها الأساسية. حتى أكثر أنظمة الطبقة الثانية مركزيةً تُعالج أقل من 1000 معاملة في الثانية. في حين صُممت سولانا لأداء أعلى، فإن القيود الناجمة عن تنوع العملاء تُسبب حاليًا ازدحامًا عند 5000 معاملة في الثانية. في المقابل، تُعالج الأنظمة المالية التقليدية مثل ناسداك، وبورصة شيكاغو التجارية، ويوركس بانتظام أكثر من 100,000 عملية في الثانية.
يُمثل زمن الوصول قيدًا حاسمًا آخر لبروتوكولات سلسلة الكتل اللامركزية. في الأسواق المالية، وخاصةً لاكتشاف أسعار الأصول المتقلبة، يُعدّ انخفاض زمن الوصول أمرًا أساسيًا لجودة السوق وسيولته. يعمل المشاركون التقليديون في السوق بزمن وصول شامل بمقاييس ميلي ثانية أو أقل من ميلي ثانية. لا يمكن تحقيق هذه السرعات إلا عندما يتمكن المشاركون في السوق من التواجد في بيئة التنفيذ نظرًا لقيود سرعة الضوء. تستخدم هياكل البلوك تشين التقليدية مجموعات محققين موزعة عالميًا تعمل دون وعي جغرافي، مما يُنشئ قيودًا أساسية على الأداء. يستغرق الضوء نفسه أكثر من 130 ميلي ثانية للدوران حول العالم عند خط الاستواء، حتى لو كان يدور في دائرة كاملة - وتتضمن مسارات الشبكات في العالم الحقيقي مسافة إضافية وتأخيرات في البنية التحتية. تتفاقم هذه القيود المادية عندما يتطلب التوافق جولات اتصال متعددة بين المحققين. تتفاقم هذه الأزمنة بين المناطق عندما يتطلب التوافق جولات اتصال متعددة بين المحققين. نتيجةً لذلك، يجب على الشبكات تطبيق أوقات كتلة متحفظة وتأخيرات نهائية للحفاظ على الاستقرار. حتى في ظل الظروف المثلى، لا تستطيع آلية الإجماع الموزعة عالميًا التغلب على هذه التأخيرات الشبكية الأساسية.

مع تزايد تكامل سلاسل الكتل مع النظام المالي العالمي، سيطلب المستخدمون أداءً يُضاهي الأنظمة المركزية الحالية. وبدون تصميم دقيق، قد يُؤثر تلبية هذه المتطلبات سلبًا على لامركزية شبكات سلاسل الكتل ومرونتها بشكل كبير. ولمواجهة هذا التحدي، نقترح سلسلة كتل Fogo من الطبقة الأولى. تتمثل فلسفة Fogo الأساسية في تعظيم الإنتاجية وتقليل زمن الوصول من خلال نهجين رئيسيين: أولًا، استخدام برنامج العميل الأكثر أداءً على مجموعة مُحققين لامركزية مثالية؛ وثانيًا، تبني الإجماع المشترك مع الحفاظ على معظم فوائد اللامركزية للإجماع العالمي.

2. المخطط

تنقسم الورقة إلى أقسام تغطي قرارات التصميم الرئيسية المتعلقة بـ Fogo.

يغطي القسم الثالث علاقة Fogo ببروتوكول سلسلة كتل Solana واستراتيجيتها فيما يتعلق بتحسين وتنوع العملاء. يتناول القسم الرابع الإجماع متعدد المحليات، وتطبيقه العملي، والتبادلات التجارية التي يُجريها مقارنةً بالإجماع العالمي أو المحلي. يتناول القسم الخامس نهج فوجو في تهيئة مجموعة المُصادقات وصيانتها. يتناول القسم السادس الامتدادات المُحتملة التي قد تُطرح بعد النشأة.
٣. البروتوكول والعملاء
في الطبقة الأساسية، تبدأ Fogo بالبناء على بروتوكول سلسلة الكتل الأكثر أداءً واستخدامًا حتى الآن، Solana. تأتي شبكة Solana مزودةً بالعديد من حلول التحسين، سواءً من حيث تصميم البروتوكول أو تطبيقات العميل. تستهدف Fogo أقصى قدر ممكن من التوافق مع Solana، بما في ذلك التوافق الكامل في طبقة تنفيذ SVM والتوافق الوثيق مع إجماع TowerBFT، وانتشار كتلة التوربينات، ودوران قائد Solana، وجميع المكونات الرئيسية الأخرى لطبقات الشبكات والإجماع. يتيح هذا التوافق لـ Fogo دمج ونشر البرامج والأدوات والبنية التحتية الحالية من نظام Solana البيئي بسهولة؛ بالإضافة إلى الاستفادة من التحسينات المستمرة في المنبع في Solana.

ولكن، بخلاف Solana، سيعمل Fogo مع عميل أساسي واحد. سيكون هذا العميل الأساسي هو العميل الرئيسي الأعلى أداءً الذي يعمل على Solana. هذا يسمح لـ Fogo بتحقيق أداء أعلى بكثير لأن الشبكة ستعمل دائمًا بسرعة أسرع عميل. في حين أن Solana، المحدود بتنوع العملاء، سيواجه دائمًا عقبات بسبب سرعة أبطأ عميل. في الوقت الحالي وفي المستقبل المنظور، سيعتمد هذا العميل الأساسي على حزمة Firedancer.

3.1 Firedancer

Firedander هو تطبيق عميل عالي الأداء من Jump Crypto متوافق مع Solana، ويُظهر معدل معالجة معاملات أعلى بكثير من عملاء المُحقق الحاليين، وذلك من خلال المعالجة المتوازية المُحسّنة، وإدارة الذاكرة، وتعليمات SIMD.

يتوفر إصداران: "Frankendancer"، وهو تطبيق هجين يستخدم محرك معالجة Firedancer مع حزمة شبكات مُحقق Rust، والتطبيق الكامل لـ Firedancer مع إعادة كتابة حزمة شبكات C كاملة، وهو حاليًا في مرحلة التطوير الأخيرة.

يحافظ كلا الإصدارين على توافق بروتوكول Solana مع تحسين الأداء إلى أقصى حد.

بمجرد اكتماله، من المتوقع أن يُحدد تطبيق Firedancer معايير أداء جديدة، مما يجعله مثاليًا لمتطلبات الإنتاجية العالية لـ Fogo. ستبدأ Fogo بشبكة تعتمد على Frankendancer، ثم تنتقل في النهاية إلى Firedancer خالصة.

3.2 العملاء الأساسيون مقابل تنوع العملاء

تعمل بروتوكولات بلوكتشين من خلال برامج عملاء تُطبّق قواعدها ومواصفاتها. بينما تُحدّد البروتوكولات قواعد تشغيل الشبكة، يُترجم العملاء هذه المواصفات إلى برامج قابلة للتنفيذ. لطالما اتبعت العلاقة بين البروتوكولات والعملاء نماذج مختلفة، حيث تُعزّز بعض الشبكات تنوع العملاء بنشاط، بينما تتقارب شبكات أخرى بشكل طبيعي نحو التطبيقات الأساسية.

يخدم تنوع العملاء عادةً أغراضًا متعددة: فهو يُوفّر تكرارًا في التنفيذ، ويُتيح التحقق المستقل من قواعد البروتوكول، ويُقلّل نظريًا من خطر ثغرات البرامج على مستوى الشبكة. تُمثّل شبكة Bitcoin سابقةً مثيرة للاهتمام - فبينما توجد تطبيقات عملاء متعددة، يعمل Bitcoin Core كعميل أساسي بحكم الواقع، مُوفّرًا التطبيق المرجعي الذي يُحدّد السلوك العملي للشبكة.

ومع ذلك، في شبكات بلوكتشين عالية الأداء، تُصبح العلاقة بين البروتوكول وتطبيق العميل أكثر تقييدًا. عندما يقترب بروتوكول ما من الحدود المادية لأجهزة الحوسبة والشبكات، تتقلص مساحة تنوع التنفيذ بشكل طبيعي. عند حدود الأداء هذه، يجب أن تتقارب التطبيقات المثلى على حلول متشابهة لأنها تواجه نفس القيود المادية ومتطلبات الأداء. أي انحراف كبير عن أنماط التنفيذ المثلى سيؤدي إلى انخفاض الأداء، مما يجعل العميل غير صالح لتشغيل المُحقق. تتجلى هذه الديناميكية بشكل خاص في الشبكات التي تستهدف الحد الأدنى من أوقات الكتل الممكنة والحد الأقصى لمعدل إنتاج المعاملات. في مثل هذه الأنظمة، تصبح الفوائد النظرية لتنوع العميل أقل أهمية، حيث يمكن أن تصبح تكلفة الحفاظ على التوافق بين تطبيقات العميل المختلفة بحد ذاتها عقبة في الأداء. عند دفع أداء سلسلة الكتل إلى الحدود المادية، ستشارك تطبيقات العميل بالضرورة القرارات المعمارية الأساسية، مما يجعل الفوائد الأمنية لتنوع التنفيذ نظرية إلى حد كبير.
٣.٣ حوافز البروتوكول للعملاء ذوي الأداء العالي

بينما يسمح Fogo بتنفيذ أي عميل متوافق، فإن بنيته تُحفّز بشكل طبيعي استخدام العميل الأعلى أداءً المتاح، مدفوعًا بالمتطلبات العملية للعمليات عالية الأداء المشتركة.

وعلى عكس الشبكات التقليدية حيث تُشكّل المسافة الجغرافية الاختناقات الرئيسية، فإن تصميم Fogo المشترك يعني أن كفاءة تنفيذ العميل تُحدّد بشكل مباشر أداء المُصدّق. في هذه البيئة، يكون زمن وصول الشبكة ضئيلًا، مما يجعل سرعة العميل العامل الحاسم.

تُشكّل معلمات وقت وحجم الكتلة الديناميكية للشبكة ضغطًا اقتصاديًا لزيادة الإنتاجية إلى أقصى حد. يجب على المُصدّقين الاختيار بين استخدام أسرع عميل أو المخاطرة بعقوبات وانخفاض الإيرادات. أما أولئك الذين يُشغّلون عملاء أبطأ، فيُخاطرون إما بفقدان الكتل من خلال التصويت على معلمات صارمة أو بخسارة الإيرادات من خلال التصويت على معلمات مُحافظة.

وهذا يُتيح اختيارًا طبيعيًا لأكثر تطبيقات العميل كفاءة. في بيئة Fogo المشتركة، حتى الفروقات الطفيفة في الأداء تُصبح كبيرة - فالعميل الأبطأ قليلاً سيُعاني من ضعف الأداء باستمرار، مما يؤدي إلى تفويت الكتل وفرض عقوبات. يحدث هذا التحسين من خلال مصلحة المُصدِّق، وليس من خلال قواعد البروتوكول.

في حين أن اختيار العميل لا يُمكن فرضه مباشرةً من خلال البروتوكول، فإن الضغوط الاقتصادية تدفع الشبكة بطبيعة الحال نحو التنفيذ الأكثر كفاءة مع الحفاظ على تطوير تنافسي للعملاء.

4. الإجماع متعدد المواقع

يُمثل الإجماع متعدد المواقع نهجًا جديدًا لإجماع سلسلة الكتل، يُوازن ديناميكيًا بين مزايا الأداء لتواجد المُصدِّق في موقع مشترك ومزايا الأمان للتوزيع الجغرافي. يسمح النظام للمُصدِّقين بتنسيق مواقعهم الفعلية عبر العصور مع الحفاظ على هويات تشفير مميزة للمناطق المختلفة، مما يُمكّن الشبكة من تحقيق إجماع بزمن وصول منخفض للغاية أثناء التشغيل العادي مع الحفاظ على القدرة على العودة إلى الإجماع العالمي عند الحاجة.

يستلهم نموذج الإجماع متعدد المناطق من فوجو الممارسات الراسخة في الأسواق المالية التقليدية، وخاصةً نموذج تداول "اتبع الشمس" المستخدم في أسواق الصرف الأجنبي والأسواق العالمية الأخرى. في التمويل التقليدي، تنتقل عمليات صنع السوق وتوفير السيولة بشكل طبيعي بين المراكز المالية الرئيسية مع تقدم يوم التداول - من آسيا إلى أوروبا إلى أمريكا الشمالية - مما يسمح باستمرارية عمل السوق مع الحفاظ على تركيز السيولة في مناطق جغرافية محددة. وقد أثبت هذا النموذج فعاليته في التمويل التقليدي لأنه يُدرك أنه على الرغم من أن الأسواق عالمية، إلا أن القيود المادية للشبكات وأوقات رد الفعل البشري تجعل درجة معينة من التركيز الجغرافي ضرورية لاكتشاف الأسعار الأمثل وكفاءة السوق.

4.1 المناطق ودوران المناطق
تمثل المنطقة منطقة جغرافية يتواجد فيها المدققون معًا لتحقيق أداء إجماع مثالي. من الناحية المثالية، تكون المنطقة مركز بيانات واحد حيث يقترب زمن وصول الشبكة بين المدققين من حدود الأجهزة. ومع ذلك، يمكن للمناطق أن تتوسع لتشمل مناطق أكبر عند الضرورة، مع الأخذ في الاعتبار بعض الأداء لاعتبارات عملية. ينشأ التعريف الدقيق للمنطقة من خلال توافق الآراء بين جهات التحقق، بدلاً من تعريفها بدقة في البروتوكول. تتيح هذه المرونة للشبكة التكيف مع قيود البنية التحتية في العالم الحقيقي مع الحفاظ على أهداف الأداء.

تخدم قدرة الشبكة على التنقل بين المناطق أغراضًا حيوية متعددة:
1. اللامركزية القضائية: يمنع التنقل المنتظم بين المناطق الحصول على توافق الآراء من أي جهة قضائية واحدة. وهذا يحافظ على مقاومة الشبكة للضغوط التنظيمية، ويضمن عدم تمكن أي حكومة أو سلطة منفردة من ممارسة سيطرة طويلة الأمد على تشغيل الشبكة.
2. مرونة البنية التحتية: قد تتعطل مراكز البيانات والبنية التحتية الإقليمية لأسباب عديدة - الكوارث الطبيعية، وانقطاع التيار الكهربائي، ومشاكل الشبكات، وأعطال الأجهزة، أو متطلبات الصيانة. يضمن التنقل بين المناطق عدم اعتماد الشبكة بشكل دائم على أي نقطة عطل واحدة. وتوضح الأمثلة التاريخية لانقطاعات مراكز البيانات الرئيسية، مثل تلك الناجمة عن الظواهر الجوية القاسية أو أعطال شبكات الكهرباء، أهمية هذه المرونة. ٣. تحسين الأداء الاستراتيجي: يمكن اختيار مناطق لتحسين أداء أنشطة الشبكة المحددة. على سبيل المثال، خلال الفترات التي تشهد أحداثًا مالية مهمة (مثل إعلانات الاحتياطي الفيدرالي، أو التقارير الاقتصادية الرئيسية، أو افتتاحات السوق)، قد يختار المدققون تحديد موقع الإجماع بالقرب من مصدر هذه المعلومات الحساسة للسعر. تتيح هذه الإمكانية للشبكة تقليل زمن الوصول للعمليات الحرجة مع الحفاظ على المرونة لحالات الاستخدام المختلفة عبر الفترات.
٤.٢ إدارة المفاتيح
يُطبّق البروتوكول نظامًا ثنائي المستوى لإدارة المفاتيح، يفصل هوية المُصدّق طويلة الأمد عن مشاركة الإجماع الخاص بالمنطقة. يحتفظ كل مُصدّق بزوج مفاتيح عالمي يُمثّل هويته الجذرية في الشبكة. يُستخدم هذا المفتاح العالمي في العمليات عالية المستوى، مثل تفويض الحصص، وتسجيل المنطقة، والمشاركة في الإجماع العالمي. يجب تأمين المفتاح العالمي بأعلى معايير الأمان الممكنة، لأنه يُمثّل السلطة النهائية للمُصدّق في الشبكة.
يمكن للمُصدّقين بعد ذلك تفويض الصلاحيات إلى مفاتيح فرعية خاصة بالمنطقة من خلال برنامج تسجيل على السلسلة. تُصرّح هذه المفاتيح الفرعية خصيصًا للمشاركة في الإجماع ضمن مناطق التواجد المُشترك المُحدّدة. يُحقق هذا الفصل أغراضًا أمنية مُتعددة: فهو يسمح للمُصدّقين بالحفاظ على نماذج أمان مُختلفة لأنواع المفاتيح المُختلفة، ويُقلّل من كشف المفاتيح العالمية من خلال إبقائها مُتصلة بالإنترنت أثناء التشغيل العادي، ويُقلّل من خطر اختراق المفاتيح أثناء انتقالات البنية التحتية المادية بين المناطق. تتم إدارة تفويض المفاتيح الخاصة بالمناطق من خلال برنامج على السلسلة يحتفظ بسجل لمفاتيح المناطق المصرح بها لكل جهة تحقق. وبينما يمكن للجهة التحقق من صحة مفاتيح مناطق جديدة في أي وقت باستخدام مفتاحها العالمي، فإن هذه التسجيلات لا تُطبق إلا عند حدود الفترة الزمنية. يضمن هذا التأخير حصول جميع المشاركين في الشبكة على الوقت الكافي للتحقق من تفويضات المفاتيح الجديدة وتسجيلها قبل تفعيلها بالإجماع.

4.3 اقتراح وتفعيل المناطق
يمكن اقتراح مناطق جديدة من خلال آلية حوكمة على السلسلة باستخدام المفاتيح العالمية. ومع ذلك، لضمان استقرار الشبكة وإعطاء الجهات التحقق من صحة الوقت الكافي لإعداد بنية تحتية آمنة، تخضع المناطق المقترحة لفترة تأخير إلزامية قبل أن تصبح مؤهلة للاختيار. يجب أن يكون هذا التأخير، المُحدد كمعامل بروتوكول، طويلاً بما يكفي للسماح للمُحققين بما يلي:
● تأمين البنية التحتية المادية المناسبة في المنطقة الجديدة
● إنشاء أنظمة إدارة مفاتيح آمنة للموقع الجديد
● إعداد واختبار البنية التحتية للشبكات
● إجراء عمليات التدقيق الأمني اللازمة للمنشأة الجديدة
● وضع إجراءات النسخ الاحتياطي والاسترداد
تُعدّ فترة التأخير أيضًا بمثابة إجراء أمني ضد الهجمات المحتملة حيث قد يحاول مُجرم فرض توافق في الآراء في منطقة يتمتع فيها بمزايا في البنية التحتية. من خلال اشتراط الإشعار المُسبق للمناطق الجديدة، يضمن البروتوكول حصول جميع المُحققين على فرصة عادلة لإثبات وجودهم في أي منطقة قد يتم اختيارها للتوافق.
فقط بعد أن تُكمل المنطقة فترة الانتظار هذه، يُمكن اختيارها من خلال عملية التصويت الاعتيادية للمناطق للفترات المستقبلية. يُساعد هذا النهج الدقيق لتنشيط المناطق في الحفاظ على أمان الشبكة واستقرارها مع السماح بإضافة مواقع استراتيجية جديدة مع تطور متطلبات الشبكة. ٤.٤ عملية التصويت لاختيار المناطق

يتم اختيار مناطق الإجماع من خلال آلية تصويت على السلسلة، تُوازن بين الحاجة إلى حركة مُنسّقة للمُصادقين وأمن الشبكة. يجب على المُصادقين تحقيق النصاب القانوني في كل منطقة مشاركة في كل حقبة مُستقبلية ضمن فترة نصاب قانونية قابلة للتكوين قبل انتقال الحقبة. عمليًا، يُمكن تحديد جدول الحقبة مع مهلة زمنية مُحددة، بحيث يُحدد التصويت خلال الحقبة n المنطقة للعصر n + k. تُدلى الأصوات من خلال برنامج تسجيل على السلسلة باستخدام المفاتيح العالمية للمُصادقين، مع ترجيح قوة التصويت حسب الحصة. تستخدم هذه العملية المفاتيح العالمية بدلًا من مفاتيح المناطق، نظرًا لعدم تأثرها بزمن الوصول وتتطلب أقصى درجات الأمان.

تتطلب عملية التصويت أغلبية ساحقة من وزن الحصة لتحقيق النصاب القانوني، مما يضمن عدم قدرة مجموعة صغيرة من المُصادقين على فرض تغيير المنطقة من جانب واحد. إذا فشل المُصدِّقون في تحقيق النصاب القانوني خلال الإطار الزمني المُحدَّد، تنتقل الشبكة تلقائيًا إلى وضع الإجماع العالمي للعصر التالي. تضمن هذه الآلية الاحتياطية استمرارية الشبكة حتى في حال عدم اتفاق المُصدِّقون على منطقة مشاركة الموقع.

خلال فترة التصويت، يُشير المُصدِّقون إلى كلٍّ من منطقتهم المُفضَّلة للعصر التالي ووقت الحظر المُستهدف لتلك المنطقة. يُتيح هذا الاختيار المُشترك لمُعاملات الموقع والأداء للشبكة تحسين كلٍّ من القيود المادية وقدرات الأداء لكل منطقة. والأهم من ذلك، تُتيح فترة التصويت وقتًا للمُصدِّقين لإعداد البنية التحتية في المنطقة المُختارة، بما في ذلك إعداد المفاتيح الخاصة بالمنطقة واختبار اتصال الشبكة. تُعد فترة التحضير هذه بالغة الأهمية للحفاظ على استقرار الشبكة أثناء انتقالات المناطق.
٤.٥ وضع الإجماع العالمي
يُعدّ وضع الإجماع العالمي آليةً احتياطيةً وميزةً أمانيةً أساسيةً للبروتوكول. بينما يُحقق فوغو أعلى أداءٍ له من خلال الإجماع القائم على المنطقة، فإن القدرة على العودة إلى الإجماع العالمي تضمن استمرار عمل الشبكة في ظل الظروف المعاكسة. في وضع الإجماع العالمي، تعمل الشبكة بمعلماتٍ مُحافظة مُحسّنة للتحقق الموزع عالميًا: زمن كتلة ثابت يبلغ ٤٠٠ مللي ثانية وحجم كتلة مُخفّض لاستيعاب فترات انتظار أعلى للشبكة بين المُصادقين المُنتشرين جغرافيًا.
يدخل البروتوكول وضع الإجماع العالمي من خلال مسارين رئيسيين:
● فشل اختيار المنطقة: إذا فشل المُصادقون في تحقيق النصاب القانوني في منطقة الإجماع للعصر التالي خلال فترة التصويت المُحددة، تنتقل الشبكة تلقائيًا إلى الإجماع العالمي لتلك الحقبة.
فشل توافق وقت التشغيل: إذا فشلت المنطقة الحالية في تحقيق نهائية الكتلة خلال فترة المهلة المحددة لها خلال حقبة زمنية، ينتقل البروتوكول فورًا إلى وضع التوافق العالمي لبقية تلك الحقبة الزمنية. هذا الوضع الاحتياطي "ثابت" - فبمجرد تفعيله في منتصف الحقبة الزمنية، تبقى الشبكة في توافق عالمي حتى الانتقال إلى الحقبة الزمنية التالية، مع إعطاء الأولوية للاستقرار على استعادة الأداء.

في وضع التوافق العالمي، يشارك المدققون باستخدام مفتاح مُخصص للعمل العالمي، والذي قد يكون أو لا يكون أحد مفاتيحهم الخاصة بالمنطقة، وتحافظ الشبكة على قواعد اختيار التفرع نفسها المُطبقة في التوافق القائم على المنطقة. على الرغم من أن هذا الوضع يُضحي بزمن الوصول المنخفض للغاية الذي يُمكن تحقيقه في المناطق المُشتركة، إلا أنه يوفر أساسًا متينًا لاستمرارية الشبكة، ويُوضح كيف يحافظ Fogo على الأمان دون التضحية بالحيوية في ظل ظروف مُتدهورة.

5. مجموعة المدققين

لتحقيق أداء عالٍ والحد من ممارسات MEV المُسيئة، ستستخدم Fogo مجموعة مدققين مُختارة بعناية. هذا ضروري لأن حتى جزء صغير من عقد التحقق غير المجهزة جيدًا يمكن أن يمنع الشبكة من الوصول إلى حدود أدائها المادية. في البداية، سيعمل التنظيم من خلال إثبات الصلاحية قبل الانتقال إلى منح الأذونات المباشرة من قِبل مجموعة المدققين. من خلال منح صلاحية التنظيم لمجموعة المدققين، يمكن لـ Fogo فرض عقوبات على الطبقة الاجتماعية للسلوك المسيء، تمامًا مثل نظام إثبات الصلاحية التقليدي، ولكن بطريقة لا تزيد مركزيتها عن قوة التفرع التي يمتلكها ثلثا الحصة بالفعل في شبكات إثبات الحصة التقليدية مثل Solana.

5.1 الحجم والتكوين الأولي

يحتفظ Fogo بمجموعة مدققين مرخصين مع حد أدنى وأقصى لعدد المدققين الذي يفرضه البروتوكول لضمان لامركزية كافية مع تحسين أداء الشبكة. سيكون الحجم المستهدف الأولي حوالي 20-50 مدققًا، مع العلم أن هذا الحد الأقصى مُطبق كمعلمة بروتوكول يمكن تعديلها مع نمو الشبكة. عند بدء التشغيل، سيتم اختيار مجموعة المُصادقين الأولية من قِبل جهة خارجية، والتي ستحتفظ بأذونات مؤقتة لإدارة تكوين مجموعة المُصادقين خلال المراحل الأولى للشبكة.

5.2 الحوكمة والانتقالات

صُممت سيطرة جهة خارجية على عضوية مجموعة المُصادقين لتكون مؤقتة. بعد فترة أولية من استقرار الشبكة، ستنتقل هذه السلطة إلى مجموعة المُصادقين نفسها. بعد هذا الانتقال، ستتطلب التغييرات في عضوية مجموعة المُصادقين أغلبية ساحقة تبلغ ثلثي الرموز المُراهنة، بما يُطابق الحد الأدنى المطلوب للتغييرات على مستوى البروتوكول في شبكات إثبات الحصة.

ولمنع التغييرات المفاجئة التي قد تُزعزع استقرار الشبكة، تُحدد معلمات البروتوكول معدلات دوران المُصادقين. لا يُمكن استبدال أو إخراج أكثر من نسبة مئوية ثابتة من مجموعة المُصادقين خلال فترة زمنية مُحددة، حيث تكون هذه النسبة المئوية معلمة بروتوكول قابلة للضبط. هذا يضمن التطور التدريجي لمجموعة المُصادقين مع الحفاظ على استقرار الشبكة.

٥.٣ متطلبات المشاركة

يجب على المُصدِّقين استيفاء الحد الأدنى من متطلبات الحصة المُفوَّضة ليكونوا مؤهلين لمجموعة المُصدِّقين، مع الحفاظ على التوافق مع نموذج سولانا الاقتصادي مع إضافة المكون المُصرَّح به. يضمن هذا الشرط المزدوج - الحصة الكافية وموافقة المجموعة - امتلاك المُصدِّقين لحصص اقتصادية في السوق، بالإضافة إلى القدرات التشغيلية اللازمة للحفاظ على أداء الشبكة.
٥.٣ متطلبات المشاركة

يجب على المُصدِّقين استيفاء الحد الأدنى من متطلبات الحصة المُفوَّضة ليكونوا مؤهلين لمجموعة المُصدِّقين، مع الحفاظ على التوافق مع نموذج سولانا الاقتصادي مع إضافة المكون المُصرَّح به. يضمن هذا الشرط المزدوج - الحصة الكافية وموافقة المجموعة - امتلاك المُصدِّقين لمصلحة اقتصادية وقدرات تشغيلية للحفاظ على أداء الشبكة.

٥.٤ الأساس المنطقي وحوكمة الشبكة

لا تؤثر مجموعة المُصدِّقين المُصرَّح بهم بشكل ملموس على لامركزية الشبكة، ففي أي شبكة إثبات حصة، يُمكن لأغلبية الثلثين من الحصة أن تُؤثِّر بالفعل على تغييرات عشوائية في البروتوكول من خلال التفرُّع. بدلاً من ذلك، تُوفِّر هذه الآلية إطارًا رسميًا لمجموعة المُصدِّقين لفرض سلوكيات شبكية مفيدة قد يصعب ترميزها في قواعد البروتوكول.

على سبيل المثال، تُمكّن إمكانية إخراج المُحققين الشبكة من الاستجابة لما يلي:
● مشاكل الأداء المُستمرة التي تُضعف قدرات الشبكة
● الاستخراج المُسيء لـ MEV الذي يُلحق الضرر بسهولة استخدام الشبكة
● السلوك المُزعزع لاستقرار الشبكة والذي لا يُمكن فرضه مُباشرةً في البروتوكول، مثل
سحب بيانات كتل التوربينات دون إعادة توجيهها
● سلوكيات أخرى، وإن كانت مُربحة للمُحققين الأفراد، إلا أنها تُضر بقيمة الشبكة على المدى الطويل
تُدرك آلية الحوكمة هذه أنه على الرغم من أن بعض السلوكيات قد تكون مُربحة على المدى القصير، إلا أنها قد تُلحق الضرر باستدامة الشبكة على المدى الطويل. من خلال تمكين مجموعة المُحققين المُرجحة حسب الحصة من مراقبة هذه السلوكيات من خلال التحكم في العضوية، تُوائِم Fogo حوافز المُحققين مع سلامة الشبكة على المدى الطويل دون المساس بخصائص اللامركزية الأساسية المُتأصلة في أنظمة إثبات الحصة.
٦. الإضافات المحتملة

بينما تُركز ابتكارات فوغو الأساسية على التوافق متعدد المواقع، وأداء العميل، وإدارة مجموعات المُحقق، يُجرى حاليًا دراسة العديد من إضافات البروتوكول الإضافية، سواءً للتنفيذ عند إطلاق النظام أو بعده. ستُحسّن هذه الميزات وظائف الشبكة مع الحفاظ على التوافق مع الإصدارات السابقة من نظام سولانا البيئي.

٦.١ دفع رسوم رمز SPL

لتمكين وصول أوسع إلى الشبكة وتحسين تجربة المستخدم، من المُحتمل أن تُقدم فوغو نوع معاملة fee_payer_unsigned، والذي يسمح بتنفيذ المعاملات دون وجود رمز SOL في الحساب المُصدر. تُمكّن هذه الميزة، إلى جانب برنامج دفع رسوم على السلسلة، المستخدمين من دفع رسوم المعاملات باستخدام رموز SPL مع الحفاظ على أمان البروتوكول وتعويض المُحقق.

يعمل النظام من خلال سوق مُرحّلات بدون أذونات خارج البروتوكول. يُنشئ المستخدمون معاملات تتضمن عملياتهم المُرادة ودفع رمز SPL لتعويض دافع الرسوم النهائي. يمكن توقيع هذه المعاملات بشكل صحيح دون تحديد دافع رسوم، مما يسمح لأي طرف بإكمالها بإضافة توقيعه ودفع رسوم SOL. تفصل هذه الآلية فعليًا بين تفويض المعاملة ودفع الرسوم، مما يُمكّن الحسابات التي لا تملك رصيد SOL من التفاعل مع الشبكة طالما أنها تمتلك أصولًا قيّمة أخرى.

تُطبّق هذه الميزة من خلال تعديلات طفيفة على البروتوكول، لا تتطلب سوى إضافة نوع المعاملة الجديد وبرنامج على السلسلة للتعامل مع تعويض المُرحّل. يُنشئ النظام سوقًا فعّالًا لخدمات ترحيل المعاملات مع الحفاظ على خصائص الأمان للبروتوكول الأساسي. بخلاف أنظمة استخلاص الرسوم الأكثر تعقيدًا، لا يتطلب هذا النهج أي تغييرات في آليات دفع المُصدّق أو قواعد الإجماع.

7. الخاتمة

يُمثل Fogo نهجًا جديدًا لهندسة سلسلة الكتل (blockchain) يتحدى الافتراضات التقليدية حول العلاقة بين الأداء واللامركزية والأمان.

من خلال الجمع بين تنفيذ العميل عالي الأداء والتوافق الديناميكي متعدد المواقع ومجموعات المدققين المُنسقة، يحقق البروتوكول أداءً غير مسبوق دون المساس بخصائص الأمان الأساسية لأنظمة إثبات الحصة. توفر القدرة على نقل التوافق ديناميكيًا مع الحفاظ على التنوع الجغرافي تحسينًا للأداء ومرونة منهجيّة، بينما تضمن آليات البروتوكول الاحتياطية استمرارية التشغيل في ظل الظروف المعاكسة.

من خلال التصميم الاقتصادي الدقيق، تنشأ هذه الآليات بشكل طبيعي من حوافز المدققين بدلاً من إنفاذ البروتوكول، مما يخلق نظامًا قويًا وقابلًا للتكيف. مع استمرار تطور تقنية البلوك تشين، تُظهر ابتكارات فوغو كيف يُمكن لتصميم البروتوكول المدروس أن يدفع حدود الأداء مع الحفاظ على خصائص الأمان واللامركزية التي تجعل شبكات البلوك تشين قيّمة.
`

// Urdu - RTL
const URDU_TEXT = `
Fogo: Ek High-Performance SVM Layer 1
Version 1.0

Abstract
Yeh paper Fogo ka taaruf karwata hai — aik naya Layer 1 blockchain protocol jo
throughput, latency, aur congestion management mein bemaisal performance deta hai.
Solana protocol ka extension hote hue, Fogo SVM execution layer par poori tarah
compatible hai, jisse maujooda Solana programs, tooling, aur infrastructure asaani se
migrate kar sakein, aur saath hi significantly zyada performance aur kam latency hasil
ho.
Fogo teen nayi innovations deta hai:
Pure Firedancer par mabni unified client implementation, jo aise performance levels
unlock karta hai jo slow clients wali networks (jismain khud Solana bhi shamil hai) hasil
nahin kar sakti.
Dynamic colocation ke saath multi-local consensus, jo block times aur latencies ko kisi
bhi bari blockchain se kaafi kam rakhta hai.
Curated validator set jo high performance ko incentivize karta hai aur predatory ya
harmful behavior ko validators ki level par rokta hai.
Yeh innovations decentralization aur robustness (jo aik layer 1 blockchain ke liye
bunyadi hain) ko barqarar rakhte hue zabardast performance gains deti hain.

1. Introduction
Blockchain networks ko performance, decentralization, aur security ke darmiyan
tawazun banaye rakhne ka masla darpesh rehta hai. Aaj ke blockchains mein
throughput ki sakht hadbandein hain jo unhein global financial activity ke liye
na-munasib banati hain. Ethereum apne base layer par 50 se kam transactions per
second (TPS) process karta hai. Sab se centralized layer 2s bhi 1,000 TPS se kam
handle karte hain. Jabke Solana high performance ke liye design ki gayi thi, client
diversity ki wajah se abhi 5,000 TPS par congestion hoti hai. Iske muqablay mein,
traditional financial systems jaise NASDAQ, CME, aur Eurex regularly 100,000 se zyada
operations per second process karte hain.
Latency bhi decentralised blockchain protocols ke liye ek badi pabandi hai. Khusoosan
volatile assets ke price discovery ke liye financial markets mein low latency market
quality aur liquidity ke liye zaroori hoti hai. Traditional market participants end-to-end
latency milliseconds ya sub-millisecond scale par operate karte hain. Yeh speed sirf tab
mumkin hoti hai jab participants execution environment ke qareeb (co-locate) hon,
kyun ke speed of light ki physical limitations hoti hain.
Riwayati blockchain architectures globally distributed validator sets use karti hain jo
geographic awareness ke baghair chalti hain, jis se bunyadi performance limitations
paida hoti hain. Roshanai (light) khud equator par globe ka chakkar lagane mein 130+
milliseconds leti hai—aur real-world network paths mein mazeed distance aur
infrastructure delay bhi hotay hain. Jab consensus ke liye multiple communication
rounds chahiye hotay hain, to yeh inter-regional latency compound hoti hai. Nateeja
yeh hai ke networks ko stability ke liye conservative block times aur finality delays
rakhne padte hain. Acha halaat honay par bhi, globally distributed consensus physical
networking delays par qaboo nahin pa sakta.
Jab blockchains global financial system ke sath aur zyada integrate hongi, to users
centralized systems jaisi performance ki demand karenge. Baghair sochi samjhi design
ke, yeh decentralization aur resilience ka khatare mein pad sakta hai. Is maslay ka hal
dene ke liye hum Fogo Layer One blockchain propose karte hain. Fogo ka core
philosophy yeh hai ke throughput maximize kiya jaye aur latency minimize ki jaye do
approaches se: pehla, sab se performant client software ko optimal decentralization
wali validator set par chalana; doosra, co-located consensus ko apnana lekin global
consensus ke decentralization ke faide zyada tar barqarar rakhna.

2. Outline
Yeh paper Fogo ke major design decisions ko alag sections mein todta hai.
Section 3: Fogo ka Solana blockchain protocol ke sath rishta, aur client optimization aur
diversity ki strategy.
Section 4: Multi-local consensus, uski practical implementation, aur uske
trade-offs—global ya local consensus ke muqablay mein.
Section 5: Validator set ko initialize aur maintain karne ka Fogo ka approach.
Section 6: Prospective extensions jo genesis ke baad introduce ho sakti hain.

3. Protocol aur Clients
Base layer par, Fogo sab se zyada performant aur widely used blockchain
protocol—Solana—par build karta hai. Solana network mein already kai optimization
solutions mojood hain, dono protocol design aur client implementations ke hawale se.
Fogo Solana ke sath maximum backwards compatibility ko target karta hai: SVM
execution layer par poori compatibility, TowerBFT consensus ke qareeb compatibility,
Turbine block propagation, Solana leader rotation, aur networking/consensus ke tamam
major components. Yeh compatibility Fogo ko Solana ecosystem ke existing programs,
tooling, aur infrastructure ko asaani se integrate aur deploy karne ki ijazat deti hai,
saath hi Solana mein aane wali upstream improvements se faida uthana possible banati
hai.
Lekin Solana ke mukable mein, Fogo sirf ek canonical client ke sath chalega. Yeh
canonical client Solana par chalte hue sab se zyada performance wala major client
hoga. Is se network hamesha fastest client ki speed par chalega aur slowest client ki
wajah se bottleneck nahi banayga—jo Solana mein client diversity ki wajah se hota hai.
Filhal aur mustaqbil ke liye, yeh canonical client Firedancer stack par mabni hoga.

3.1 Firedancer
Firedancer Jump Crypto ka high-performance Solana-compatible client implementation
hai, jo optimized parallel processing, memory management, aur SIMD instructions ke
zariye maujooda validator clients se kaafi zyada transaction processing throughput
dikhata hai.
Do versions hain:
Frankendancer: Hybrid jo Firedancer ke processing engine ko Rust validator ke
networking stack ke sath use karta hai.
Full Firedancer: Poora C networking stack rewrite, jo late-stage development mein hai.
Dono versions Solana protocol compatibility banaye rakhte hain lekin performance
maximize karte hain. Jab pure Firedancer complete ho jaye to naye performance
benchmarks set karne ki tawaqqo hai; yeh Fogo ke high-throughput requirements ke
liye ideal hoga. Fogo shuru mein Frankendancer se chalaye ga aur aakhir kar pure
Firedancer par transition karega.

3.2 Canonical Clients vs. Client Diversity
Blockchain protocols clients ke zariye operate karte hain jo unke rules aur specifications
ko executable software mein badalte hain. Protocols network ke rules define karte hain,
aur clients unko chalane wali implementations hoti hain. Yeh rishta mukhtalif models
follow karta raha hai: kuch networks client diversity ko promote karti hain jabke doosre
naturally canonical implementations par converge karte hain.
Client diversity ke fawaid mein implementation redundancy, independent verification,
aur theoretical vulnerability risk reduction shamil hain. Misal ke taur par, Bitcoin mein
kai client implementations hain magar Bitcoin Core de facto canonical client hai jo
practical network behavior ka reference define karta hai.
Lekin high-performance blockchain networks mein, jab protocol computing aur
networking hardware ke physical limits ke qareeb aata hai, to implementation diversity
ka daira kam hota chala jata hai. Optimal implementations ek jaisi halaton ka samna
karte hue similar architectural decisions ki taraf converge karte hain; significant
deviation performance degrade karega aur client ko non-viable bana dega.
Aise systems mein jahan minimum block times aur maximum throughput target ki jati
ho, client diversity ke theoretical fawaid kam ho jate hain, kyun ke mukhtalif clients ke
darmiyan compatibility maintain karne ka overhead khud performance bottleneck ban
sakta hai. Jab blockchain performance physical limits push kare, to implementations
core architectural similarities share karte hain, aur diversity ke security fawaid ziyada
theoretical ho jate hain.

3.3 Protocol Incentives for Performant Clients
Fogo kisi bhi conforming client ko allow karta hai, lekin architecture natural taur par sab
se zyada performant client use karne ko incentivize karta hai, kyunki co-located
operations demand karti hain ke client implementation tez ho.
Riwayati networks mein geographic distance primary bottleneck hota hai, lekin Fogo ke
co-located design mein client implementation efficiency validator performance ko
seedha tay karti hai. Is environment mein network latency minimal hoti hai, to client
speed critical factor ban jati hai.
Network ke dynamic block time aur size parameters economic pressure paida karte
hain throughput maximize karne ka. Validators ko ya to fastest client use karna hota
hai warna penalties ya kam revenue face karna padta hai. Slow clients chalane wale
validators aggressive parameters mein blocks miss kar sakte hain, ya conservative
parameters per revenue lose karte hain.
Yeh natural selection sab se efficient client implementation ki taraf drive karta hai.
Co-located environment mein choti si speed difference bhi significant ho jati hai—thori
si slow client consistent underperformance degi, jisse missed blocks aur penalties
hongi. Yeh optimization validator self-interest se nikalti hai, protocol rules se nahi.
Client choice directly enforce nahi hoti, magar economic pressure network ko sab se
efficient implementation ki taraf laata hai jabke competitive client development bhi
qaim rehta hai.

4. Multi-Local Consensus
Multi-local consensus aik naya approach hai jo validator co-location ke performance
faide aur geographic distribution ke security faide ke darmiyan dynamic balance banata
hai. System validators ko epochs ke darmiyan apni physical locations coordinate karne
ki ijazat deta hai jabke mukhtalif zones ke liye distinct cryptographic identities maintain
ki jati hain. Is se network normal operation mein ultra-low latency consensus hasil karta
hai, aur zarurat par global consensus par fallback bhi mumkin rehta hai.
Fogo ka multi-local consensus model traditional financial markets ke practices se
inspiration leta hai, khaas taur par "follow the sun" trading model se jo foreign
exchange aur global markets mein istemal hota hai. Riwayati finance mein market
making aur liquidity center se center migrate karti hai, jis se continuous operation aur
concentrated liquidity possible hoti hai. Yeh model is liye effective hai kyun ke yeh
recognize karta hai ke markets global hain magar physical networking aur human
reaction times ki limitations ki wajah se geographic concentration optimal price
discovery aur efficiency ke liye zaroori hoti hai.

4.1 Zones aur Zone Rotation
Zone aik geographic area hoti hai jahan validators co-locate karte hain taake consensus
performance optimal ho. Ideal tor par zone ek single data center hota hai jahan
validators ke darmiyan latency hardware limits ke qareeb hoti hai. Zarurat par zones
bare regions ko cover kar sakti hain, kuch performance compromise kar ke practicality
hasil karte hue. Zone ki exact definition protocol mein sakhti se nahi, balki validators ke
darmiyan social consensus se ubharti hai—iske wajah se network real-world
infrastructure constraints ke mutabiq adapt kar sakta hai.
Zone rotation ke multiple faide hain:
Jurisdictional Decentralization: Regular rotation kisi aik jurisdiction ke zariye consensus
capture ko rokta hai, jis se regulatory control ka lamba asar mushkil ho jata hai.
Infrastructure Resilience: Data centers ya regional infrastructure kharab ho sakte hain
(natural disasters, power outages, etc.), zone rotation single failure point par
dependency kam karti hai.
Strategic Performance Optimization: Specific financial events ke dauran (jaise Federal
Reserve announcements ya major economic reports) validators consensus ko un
sources ke qareeb shift kar sakte hain taake latency kam ho aur price-sensitive
operations behtar hon.

4.2 Key Management
Protocol ek two-tier key management system implement karta hai jo long-term
validator identity ko zone-specific consensus participation se alag karta hai. Har
validator ke paas:
Global key pair: Root identity ke liye—stake delegation, zone registration, global
consensus mein hissa lena.
Zone-specific sub-keys: Jo designated co-location zones mein consensus ke liye
authorized hoti hain.
Yeh separation security ke liye multiple faide deti hai: global keys ko normally offline
rakh kar unka exposure kam hota hai; zone transitions ke doran key compromise ka risk
reduce hota hai. Zone-specific key delegation on-chain registry program ke zariye
manage hoti hai. Naye zone keys global key se register ki ja sakti hain, lekin yeh sirf
epoch boundaries par active hoti hain—jis se participants ke paas verification ka waqt
hota hai.

4.3 Zone Proposal aur Activation
Naye zones on-chain governance se propose kiye jaate hain using global keys. Network
stability aur validators ki tayyari ke liye proposed zones ka ek mandatory delay hota hai
jisme:
Physical infrastructure ko secure kiya jaye
Secure key management systems setup kiye jayein
Networking infrastructure test ho
Security audits kiye jayein
Backup/recovery procedures established hon
Yeh delay potential malicious actors ke against bhi security layer ka kaam karta hai jo
apni infrastructural advantage wali zones force karne ki koshish kar sakte hain. Sirf
uske baad jo zone waiting period complete kar le, usay future epochs ke liye vote ke
zariye select kiya ja sakta hai.

4.4 Zone Selection Voting Process
Consensus zone ka election on-chain voting se hota hai jo coordinated validator
movement aur network security ka tawazun rakhta hai. Validators ko har ane wale
epoch ke co-location zone par quorum hasil karna hota hai ek configurable quorum time
ke andar. Aam tor par epoch schedule kuch lead time ke sath hota hai, jahan epoch n
mein vote kar ke zone n + k ke liye select hota hai. Voting global keys se hoti hai (zone
keys nahi, kyunki yeh high-security aur non-latency sensitive hoti hai), aur voting power
stake ke weight par based hoti hai.
Quorum ek supermajority stake weight se hasil hoti hai taake choti group unilateral
zone change na kar sake. Agar quorum na bana to network agle epoch ke liye
automatically global consensus mode mein chala jata hai—jo continuity ko ensure karta
hai. Voting period ke doran validators apni preferred zone aur target block time dono
signal karte hain, jis se location aur performance parameters ka joint optimization
mumkin hota hai. Yeh period infrastructure preparation ke liye bhi zaroori hota hai
(zone-specific keys warm-up, connectivity tests, etc.).

4.5 Global Consensus Mode
Global consensus mode fallback aur safety feature dono hai. Jab zone-based ultra-low
latency consensus fail ho ya next epoch ke liye quorum na bane, to network global
consensus par shift hota hai. Is mode mein:
Conservative parameters rakhay jate hain (fixed 400ms block time)
Block size kum hoti hai taa ke geographically dispersed validators ke darmiyan
latencies accommodate ho sakhein
Protocol do raste se is mode mein jata hai:
Failed Zone Selection: Agar agle epoch ke consensus zone ke liye quorum na bane
Runtime Consensus Failure: Agar current zone block finality timeout ke andar achieve
na kare
Yeh fallback “sticky” hota hai—agar mid-epoch trigger hua to agle epoch transition tak
global consensus rehta hai, jahan stability performance se zyada ahmiyat rakhti hai. Is
mode mein validators global operation key use karte hain, aur fork choice rules
zone-based consensus wale hi rehte hain. Ultra-low latency sacrifice hoti hai lekin
network continuity aur safety maintain rehti hai.

5. Validator Set
High performance aur abusive MEV practices ko mitigate karne ke liye, Fogo aik curated
validator set use karega. Kyun ke agar kuch under-provisioned validators network ke
physical performance limits ko rok den, to poori efficiency nahi mil sakti. Ibtida mein
curation proof-of-authority ke zariye hogi, phir dheere dheere validator set ki direct
permissioning mein transition hogi. Validator set ko social layer punishment dene ki
authority di jati hai bina is ke ke yeh traditional proof-of-authority se zyada centralized
ho—kyun ke existing proof-of-stake networks mein 2/3 stake already fork power rakhta
hai.

5.1 Size aur Initial Configuration
Fogo permissioned validator set rakhta hai jisme protocol-enforced minimum aur
maximum number hota hai, taa ke decentralized rahte hue performance optimized
rahe. Initial target size taqreeban 20–50 validators hogi; yeh cap protocol parameter ke
taur par adjust ki ja sakti hai jese network mature ho. Genesis par, initial set genesis
authority ke zariye select kiya jayega jo early stages mein temporary composition
manage karegi.

5.2 Governance aur Transitions
Genesis authority ka control validator membership par temporary design kiya gaya hai.
Initial stabilization ke baad yeh authority validator set ko mil jayegi. Is transition ke
baad validator membership changes ke liye staked tokens ka two-thirds supermajority
chahiye hoga—jo proof-of-stake protocol-level changes ke liye bhi required hota hai.
Validator turnover ko sudden instability se bachane ke liye protocol parameters
replacement/ejection rate ko limit karte hain; yeh percentage tunable parameter hoti
hai.

5.3 Participation Requirements
Validators ko eligibility ke liye minimum delegated stake rakhna zaroori hoga, jo Solana
ke economic model ke sath compatibility maintain karta hai magar permissioned
component add karta hai. Dono cheezein—sufficient stake aur set approval—yeh
ensure karti hain ke validators ke paas economic interest aur operational capability
dono hon.

5.4 Rationale aur Network Governance
Permissioned validator set decentralization ko materially affect nahi karta, kyun ke kisi
bhi proof-of-stake network mein 2/3 supermajority already arbitrary protocol changes
ke liye capable hoti hai (fork ke zariye). Is mechanism ka maqsad aise network
behaviors ko enforce karna hai jo seedha protocol rules mein mushkil se likhe ja sakte
hain, jaise:
Persistent performance issues
Abusive MEV extraction jo usability ko nukhsan pohanchaye
Network destabilizing behavior (jaise Turbine blocks ko leech karna ya forward na
karna)
Aise profitable lekin network ke long-term value ko nuksan pohanchane wale behaviors
Yeh governance model short-term profitability aur long-term viability ke darmiyan
imbalance ko samajhta hai. Stake-weighted validator set membership control ke zariye
aise behaviors ko police kar sakta hai, bina decentralization ko compromise kiye.

6. Prospective Extensions
Fogo ki core innovations multi-local consensus, client performance, aur validator set
management par focus karti hain, lekin kuch additional protocol extensions genesis ya
post-launch mein consider ki ja rahi hain. Yeh features functionality ko aur enhance
karenge jabke Solana ecosystem ke sath backwards compatibility barqarar rahegi.

6.1 SPL Token Fee Payment
Wider network access aur user experience behtar karne ke liye, Fogo aik
fee_payer_unsigned transaction type introduce kar sakta hai jo transactions ko SOL
balance ke baghair execute karne deti hai. Is feature ke sath ek on-chain fee payment
program hoga jo users ko SPL tokens ke zariye transaction fees dene ki ijazat deta hai,
jabke protocol security aur validator compensation maintain rehti hai.
System ek permissionless relayer marketplace ke zariye kaam karta hai:
Users apne intended operations aur SPL token payment ko transaction mein construct
karte hain
Fee payer specify na karna bhi valid hota hai; koi bhi party signature add kar ke SOL fee
pay kar sakti hai
Yeh authorization ko fee payment se alag karta hai, jis se zero SOL balance wale
accounts bhi valuable assets ke sath interact kar sakte hain
Yeh feature minimal protocol modifications mangta hai: sirf naya transaction type aur
ek on-chain relayer compensation program chahiye. Validator payment ya consensus
rules mein koi tabdeeli nahin chahiye—simplicity aur security dono maintain rehte hain.

7. Conclusion
Fogo aik naya approach hai blockchain architecture ka jo performance,
decentralization, aur security ke riwayati assumptions ko challenge karta hai.
High-performance client implementation (Firedancer), dynamic multi-local consensus,
aur curated validator sets ko combine karke, protocol aisi performance hasil karta hai jo
proof-of-stake systems ke fundamental security properties ko compromise kiye baghair
unprecedented hai.
Geographic diversity ko banaye rakhte hue consensus ko dynamically relocate karne ki
capability performance optimization aur systemic resilience dono deti hai. Fallback
mechanisms adverse conditions mein continuous operation ko ensure karte hain.
Economic design ke zariye yeh mechanisms naturally validator incentives se nikalti
hain, rather than zabardasti rules ke through—jis se system robust, adaptable, aur
long-term ke liye sustainable banta hai. Jaise jaise blockchain technology evolve karti
hai, Fogo ki innovations dikhati hain ke soch samajh kar design ki gayi protocols
performance ke hadon ko push kar sakti hain jabke security aur decentralization ko
barqarar rakha jaye.
`

export const languages: Language[] = [
  {
    slug: "english",
    label: "English",
    heading: "English Whitepaper",
    subheading: "Version 1.0",
    content: ENGLISH_TEXT,
    dir: "ltr",
  },
  {
    slug: "vietnamese",
    label: "Vietnamese",
    heading: "Sách Trắng Fogo",
    subheading: "Version 1.0",
    content: VIETNAMESE_TEXT,
  },
  {
    slug: "indonesian",
    label: "Indonesian",
    heading: "Buku Putih Fogo",
    subheading: "Versi 1.0",
    content: INDONESIAN_TEXT,
  },
  {
    slug: "malaysian",
    label: "Malaysian",
    heading: "Kertas Putih Fogo",
    subheading: "Versi 1.0",
    content: MALAYSIAN_TEXT,
  },
  { slug: "chinese", label: "Chinese", heading: "Fogo 白皮书", subheading: "版本 1.0", content: CHINESE_TEXT },
  { slug: "thai", label: "Thai", heading: "ไวท์เปเปอร์ Fogo", subheading: "Version 1.0", content: THAI_TEXT },
  { slug: "hindi", label: "Hindi", heading: "Fogo श्वेतपत्र", subheading: "Version 1.0", content: HINDI_TEXT },
  {
    slug: "japanese",
    label: "Japanese",
    heading: "Fogo ホワイトペーパー",
    subheading: "バージョン 1.0",
    content: JAPANESE_TEXT,
  },
  { slug: "korean", label: "Korean", heading: "Fogo 백서", subheading: "버전 1.0", content: KOREAN_TEXT },
  {
    slug: "filipino",
    label: "Filipino",
    heading: "Fogo Whitepaper",
    subheading: "Bersyon 1.0",
    content: FILIPINO_TEXT,
  },
  {
    slug: "ukrainian",
    label: "Ukrainian",
    heading: "Біла книга Fogo",
    subheading: "Version 1.0",
    content: UKRAINIAN_TEXT,
  },
  {
    slug: "portuguese",
    label: "Portuguese",
    heading: "Whitepaper Fogo",
    subheading: "Versão 1.0",
    content: PORTUGUESE_TEXT,
  },
  { slug: "french", label: "French", heading: "Livre Blanc Fogo", subheading: "Version 1.0", content: FRENCH_TEXT },
  {
    slug: "turkish",
    label: "Turkish",
    heading: "Fogo Teknik Dokümanı",
    subheading: "Sürüm 1.0",
    content: TURKISH_TEXT,
  },
  { slug: "russian", label: "Russian", heading: "Белая книга Fogo", subheading: "Версия 1.0", content: RUSSIAN_TEXT },
  { slug: "hausa", label: "Hausa", heading: "Fogo Farar Takarda", subheading: "Sigar 1.0", content: HAUSA_TEXT },
  {
    slug: "spanish",
    label: "Spanish",
    heading: "Libro Blanco de Fogo",
    subheading: "Versión 1.0",
    content: SPANISH_TEXT,
  },
  { slug: "bengali", label: "Bengali", heading: "ফোগো হোয়াইটপেপার", subheading: "সংস্করণ ১.০", content: BENGALI_TEXT },
  { slug: "urdu", label: "Urdu", heading: "Fogo وائٹ پیپر", subheading: "Version 1.0", content: URDU_TEXT, dir: "rtl" },
  { slug: "polish", label: "Polish", heading: "Biała Księga Fogo", subheading: "Wersja 1.0", content: POLISH_TEXT },
  {
    slug: "arabic",
    label: "Arabic",
    heading: "الورقة البيضاء لـ Fogo",
    subheading: "الإصدار 1.0",
    content: ARABIC_TEXT,
    dir: "rtl",
  },
  {
    slug: "persian",
    label: "Persian",
    heading: "وایت‌پیپر فُگو",
    subheading: "نسخه 1.0",
    content: PERSIAN_TEXT,
    dir: "rtl",
  },
]
