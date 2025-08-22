import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts } from "pdf-lib"

// Simple text wrapper for pdf-lib
function wrapText({
  text,
  font,
  size,
  maxWidth,
}: {
  text: string
  font: any
  size: number
  maxWidth: number
}) {
  const words = text.replace(/\r/g, "").split(/\s+/)
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    const test = line ? line + " " + word : word
    const width = font.widthOfTextAtSize(test, size)
    if (width <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

async function generatePdfFromText(title: string, body: string) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const titleFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  const margin = 56
  const fontSize = 12
  const lineGap = 4
  const titleSize = 18

  let page = pdfDoc.addPage()
  const pageWidth = page.getWidth()
  const pageHeight = page.getHeight()
  const contentWidth = pageWidth - margin * 2
  let y = pageHeight - margin

  // Title
  const titleLines = wrapText({
    text: title,
    font: titleFont,
    size: titleSize,
    maxWidth: contentWidth,
  })
  for (const l of titleLines) {
    y -= titleSize + lineGap
    if (y < margin) {
      page = pdfDoc.addPage()
      y = page.getHeight() - margin
    }
    page.drawText(l, { x: margin, y, size: titleSize, font: titleFont })
  }

  // Spacer
  y -= 10

  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  for (const para of paragraphs) {
    const lines = wrapText({ text: para, font, size: fontSize, maxWidth: contentWidth })
    for (const line of lines) {
      const lineHeight = fontSize + lineGap
      if (y - lineHeight < margin) {
        page = pdfDoc.addPage()
        y = page.getHeight() - margin
      }
      y -= lineHeight
      page.drawText(line, { x: margin, y, size: fontSize, font })
    }
    y -= fontSize // paragraph gap
    if (y < margin) {
      page = pdfDoc.addPage()
      y = page.getHeight() - margin
    }
  }

  const bytes = await pdfDoc.save()
  return bytes
}

const ENGLISH_TEXT = `
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
Traditional blockchain architectures use globally distributed validator sets that operate without geographic awareness, creating fundamental performance limitations. Light itself takes over 130 milliseconds to circumnavigate the globe at the equator, even traveling in a perfect circle—and real-world network paths involve additional distance and infrastructure delays. These physical limitations compound when consensus requires multiple communication rounds between validators. As a result, networks must implement conservative block times and finality delays to maintain stability. Even under optimal conditions, a globally distributed consensus mechanism cannot overcome these basic networking delays.
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
Blockchain protocols operate through client software that implements their rules and specifications. While protocols define the rules of network operation, clients translate these specifications into executable software. Client diversity traditionally serves multiple purposes: redundancy, independent verification of rules, and reduced risk of network‑wide software vulnerabilities. Bitcoin shows a precedent where Bitcoin Core serves as a de facto canonical client even with alternatives.
However, in high‑performance networks near physical hardware limits, the space for implementation diversity contracts. Optimal implementations converge on similar solutions; deviations reduce performance to non‑viable levels. The benefits of diversity shrink as inter‑client compatibility overhead becomes a bottleneck.

3.3 Protocol Incentives for Performant Clients
Fogo allows any conforming client, but its architecture incentivizes using the fastest client. In co‑located settings, network latency is minimal, so client efficiency determines validator performance. Dynamic block parameters create economic pressure to maximize throughput; slower clients either miss blocks or must vote conservatively, reducing revenue. This naturally selects the most efficient implementation without hard protocol enforcement.

4. Multi‑Local Consensus
Multi‑local consensus dynamically balances the performance of validator co‑location with the security of geographic distribution. Validators coordinate physical locations across epochs while maintaining distinct cryptographic identities for zones, achieving ultra‑low latency consensus in normal operation with fallback to global consensus when needed.
The model draws inspiration from the "follow the sun" pattern in traditional markets, where liquidity moves between Asia, Europe, and North America to balance continuous operation and concentrated liquidity.

4.1 Zones and Zone Rotation
A zone is a geographic area—ideally a single data center—where latency approaches hardware limits. Zones may expand as needed. Rotation provides jurisdictional decentralization, infrastructure resilience, and strategic performance optimization (e.g., locating near sources of price‑sensitive information).

4.2 Key Management
A two‑tier system separates global validator identity from zone‑specific participation. Validators keep a global key for high‑level actions and delegate to zone keys via an on‑chain registry. Delegations activate at epoch boundaries after network‑wide visibility.

4.3 Zone Proposal and Activation
New zones are proposed on‑chain with a mandatory delay for validators to prepare infrastructure, security, networking, and recovery procedures. Only after the delay can a zone be selected through regular voting.

4.4 Zone Selection Voting Process
Validators vote on future zones and target block times using stake‑weighted global keys. A supermajority establishes quorum; otherwise the network defaults to global consensus for the next epoch. The window allows infrastructure preparation and key warm‑up.

4.5 Global Consensus Mode
A fallback and safety mode with conservative parameters (e.g., 400ms block time, reduced block size). Triggered by failed zone selection or runtime finality failure; once triggered mid‑epoch, it remains until the next epoch.

5. Validator Set
Fogo uses a curated validator set to reach physical performance limits and mitigate abusive MEV. Initially proof‑of‑authority, transitioning to validator‑direct permissioning.

5.1 Size and Initial Configuration
The validator set has protocol bounds; initial target 20–50 validators. A genesis authority selects the initial set with temporary management powers.

5.2 Governance and Transitions
Control transitions to the validator set; membership changes require a two‑thirds supermajority. Turnover is rate‑limited to preserve stability.

5.3 Participation Requirements
Validators must meet minimum delegated stake and obtain set approval to ensure capability and alignment.

5.4 Rationale and Network Governance
This mechanism formalizes enforcement of beneficial behavior without materially reducing decentralization, since any PoS supermajority can already fork. It enables responses to persistent performance issues, abusive MEV, failure to forward Turbine blocks, and other harmful behaviors.

6. Prospective Extensions
Extensions under consideration maintain Solana compatibility.

6.1 SPL Token Fee Payment
A fee_payer_unsigned transaction type plus an on‑chain fee program would allow paying fees in SPL tokens via a permissionless relayer marketplace, requiring minimal protocol changes.

7. Conclusion
Fogo combines high‑performance client implementation with dynamic multi‑local consensus and curated validator sets to achieve unprecedented performance without compromising core PoS security. Dynamic relocation provides performance and resilience with robust fallbacks; incentives align naturally through economics.
`
const HINDI_TEXT = `
Version 1.0

Abstract
Ye paper Fogo ko introduce karta hai, ek naya layer 1 blockchain protocol jo throughput, latency aur congestion management me breakthrough performance deta hai. Solana protocol ka extension hote hue, Fogo SVM execution layer pe full compatibility maintain karta hai, jisse existing Solana programs, tooling, aur infrastructure easily migrate ho sake — aur saath hi kaafi higher performance aur lower latency achieve ho.  
Fogo teen nayi innovations lekar aata hai:  
• Pure Firedancer pe based ek unified client implementation, jo aise performance levels unlock karta hai jo slow clients wale networks — including Solana — me possible nahi hote.  
• Multi-local consensus with dynamic colocation, jo block times aur latencies ko kisi bhi major blockchain se kaafi neeche le aata hai.  
• Ek curated validator set jo high performance ko incentivize karta hai aur validator level pe predatory behavior ko deter karta hai.  
Ye innovations bade performance gains deti hain, saath hi decentralization aur robustness ko preserve karti hain jo ek layer 1 blockchain ke liye essential hain.  

1. Introduction
Blockchain networks hamesha performance, decentralization, aur security ke beech balance maintain karne ki challenge face karti hain. Aaj ke blockchains me severe throughput limitations hain, jo unhe global financial activity ke liye unsuitable bana dete hain. Ethereum apne base layer pe 50 transactions per second (TPS) se kam process karta hai. Bahut centralized layer 2s bhi 1,000 TPS se kam handle karte hain. Solana ko high performance ke liye design kiya gaya tha, lekin client diversity ke limitations ki wajah se 5,000 TPS pe congestion aata hai. Iske contrast me, traditional financial systems jaise NASDAQ, CME, aur Eurex regularly 100,000+ operations per second process karte hain.  

Latency bhi decentralized blockchain protocols ke liye ek critical limitation hai. Financial markets me — especially volatile assets ke price discovery ke liye — low latency market quality aur liquidity ke liye essential hai. Traditional market participants millisecond ya sub-millisecond end-to-end latency pe operate karte hain. Ye speeds tabhi possible hain jab participants execution environment ke saath co-locate kar sakein, kyunki speed of light ke physical limits hote hain.  

Traditional blockchain architectures globally distributed validator sets use karti hain jisme geographic awareness nahi hoti, jo performance limitations create karti hain. Light ko globe ke equator ke around travel karne me ~130 milliseconds lagte hain — aur real-world network paths me extra delays hote hain. Ye delays compound hote hain jab consensus me validators ke beech multiple communication rounds lagte hain. Result: networks ko conservative block times aur finality delays lagani padti hain stability maintain karne ke liye. Even best conditions me bhi globally distributed consensus in physical networking delays ko overcome nahi kar sakta.  

Jaise-jaise blockchains global financial system me integrate ho rahi hain, users aaj ke centralized systems ke comparable performance demand karenge. Agar careful design na ho to ye demands decentralization aur resilience ko compromise kar sakti hain. Is challenge ko solve karne ke liye hum propose karte hain Fogo layer 1 blockchain. Fogo ka core philosophy hai throughput maximize karna aur latency minimize karna do tariko se:  
1. Most performant client software use karna ek optimally decentralized validator set pe.  
2. Co-located consensus embrace karna, jabki global consensus ke zyada decentralization benefits preserve kare.  

2. Outline
Ye paper Fogo ke major design decisions ko sections me cover karta hai. Section 3 me Fogo aur Solana blockchain protocol ka relationship aur client optimization/diversity strategy cover hoti hai. Section 4 me multi-local consensus, uski implementation, aur trade-offs discuss hote hain. Section 5 me validator set initialization aur maintenance ka approach hai. Section 6 me genesis ke baad ke possible extensions cover hote hain.  

3. Protocol and Clients
Base layer pe Fogo sabse performant widely used blockchain protocol — Solana — pe build hota hai. Solana me kaafi optimizations hain protocol design aur client implementations me. Fogo maximum backwards compatibility target karta hai, including full SVM execution layer compatibility, TowerBFT consensus, Turbine block propagation, leader rotation, aur networking/consensus layers ke major components ke saath. Is compatibility ki wajah se Fogo existing Solana ecosystem ke programs, tooling, aur infra ko easily use kar sakta hai aur Solana ke continuous upstream improvements ka benefit le sakta hai.  

Lekin Solana ke unlike, Fogo ek single canonical client run karega — jo hamesha fastest client hoga. Ye approach ensure karta hai ki network hamesha fastest speed pe chale, jabki Solana client diversity ki wajah se slowest client ke speed pe bottleneck hota hai. For now, ye canonical client Firedancer stack pe based hoga.  

3.1 Firedancer
Firedancer Jump Crypto ka high-performance Solana-compatible client hai, jo optimized parallel processing, memory management, aur SIMD instructions ke through current validator clients se zyada throughput deta hai.  
Do versions hain: "Frankendancer" (Firedancer engine + Rust validator networking stack) aur pure Firedancer (complete C networking stack rewrite, late-stage development me). Dono versions Solana protocol compatible hain. Pure Firedancer complete hone ke baad naye performance benchmarks set karega, jo Fogo ke liye ideal hai. Fogo initially Frankendancer based hoga aur eventually pure Firedancer pe transition karega.  

3.2 Canonical Clients vs. Client Diversity
Blockchain protocols client software se operate karte hain. Client diversity redundancy, rule verification, aur software vulnerability risk reduce karne ke liye hoti hai. Bitcoin me Bitcoin Core de facto canonical client ka example hai.  
Lekin high-performance networks me hardware limits ke paas diversity ka space kam ho jata hai. Optimal implementations similar solutions pe converge karte hain; deviations performance ko non-viable bana dete hain. Inter-client compatibility ka overhead bottleneck ban jata hai.  

3.3 Protocol Incentives for Performant Clients
Fogo kisi bhi conforming client ko allow karta hai, lekin architecture fastest client ko incentivize karta hai. Co-located settings me latency minimal hoti hai, to client efficiency hi validator performance decide karti hai. Dynamic block parameters economic pressure create karte hain — slow clients blocks miss karte hain ya conservative vote karte hain, jisse revenue kam hota hai. Ye naturally efficient implementation ko select karta hai.  

4. Multi-Local Consensus
Multi-local consensus validator co-location ke performance aur geographic distribution ke security ko balance karta hai. Validators physical locations coordinate karte hain across epochs, zone-specific cryptographic identities maintain karte hain, aur ultra-low latency consensus achieve karte hain — with fallback to global consensus.  

4.1 Zones and Zone Rotation
Zone ek geographic area hai — ideally ek data center — jahan latency hardware limits ke close hoti hai. Zones need ke according expand ho sakti hain. Rotation decentralization, resilience, aur performance optimization provide karta hai.  

4.2 Key Management
Two-tier system global validator identity ko zone-specific participation se separate karta hai. Validators global key rakhte hain aur zone keys ko on-chain registry ke through delegate karte hain.  

4.3 Zone Proposal and Activation
New zones on-chain propose hote hain with mandatory delay, taaki validators infra aur security prepare kar sakein.  

4.4 Zone Selection Voting Process
Validators stake-weighted global keys ke through vote karte hain. Supermajority quorum establish karta hai, otherwise fallback hota hai.  

4.5 Global Consensus Mode
Fallback mode conservative parameters ke saath — e.g., 400ms block time — failure conditions me enable hota hai.  

5. Validator Set
Fogo curated validator set use karta hai taaki performance limits achieve ho sakein aur abusive MEV mitigate ho. Initially proof-of-authority, later validator-direct permissioning.  

5.1 Size and Initial Configuration
Target 20–50 validators. Genesis authority initial set choose karega.  

5.2 Governance and Transitions
Control validator set ko transfer hota hai, membership changes 2/3 supermajority se hote hain.  

5.3 Participation Requirements
Minimum delegated stake + set approval required hai.  

5.4 Rationale and Network Governance
Mechanism harmful behaviors jaise persistent performance issues, abusive MEV, Turbine block failure ko address karta hai.  

6. Prospective Extensions
Solana compatibility maintain karte hue extensions.  

6.1 SPL Token Fee Payment
fee_payer_unsigned transaction + on-chain fee program SPL tokens me fee payment allow karega.  

7. Conclusion
Fogo high-performance client, dynamic multi-local consensus, aur curated validator set combine karke unprecedented performance achieve karta hai without core PoS security compromise kiye. Dynamic relocation performance + resilience provide karta hai, aur economics incentives ko align karta hai.
`
const VIETNAMESE_TEXT = `
Version 1.0

Tóm tắt
Bài báo này giới thiệu Fogo, một giao thức blockchain lớp 1 mới mang lại hiệu suất đột phá về thông lượng, độ trễ và quản lý tắc nghẽn. Là phần mở rộng của giao thức Solana, Fogo duy trì khả năng tương thích hoàn toàn ở lớp thực thi SVM, cho phép các chương trình, công cụ và cơ sở hạ tầng hiện có của Solana có thể di chuyển liền mạch đồng thời đạt hiệu suất cao hơn đáng kể và độ trễ thấp hơn.  
Fogo mang lại ba đổi mới mới:  
• Triển khai client thống nhất dựa trên Firedancer thuần túy, mở khóa mức hiệu suất mà các mạng có client chậm hơn — bao gồm cả Solana — không thể đạt được.  
• Cơ chế đồng thuận đa khu vực (multi-local) với định vị động, đạt thời gian tạo khối và độ trễ thấp hơn bất kỳ blockchain lớn nào.  
• Bộ validator được tuyển chọn nhằm khuyến khích hiệu suất cao và ngăn chặn hành vi săn mồi ở cấp độ validator.  
Những đổi mới này mang lại mức tăng hiệu suất đáng kể đồng thời vẫn giữ nguyên sự phi tập trung và độ bền vững cần thiết cho một blockchain lớp 1.  

1. Giới thiệu
Các mạng blockchain luôn phải đối mặt với thách thức cân bằng giữa hiệu suất, tính phi tập trung và bảo mật. Các blockchain ngày nay có giới hạn nghiêm trọng về thông lượng, khiến chúng không phù hợp cho các hoạt động tài chính toàn cầu. Ethereum xử lý ít hơn 50 giao dịch mỗi giây (TPS) ở lớp cơ sở. Ngay cả các layer 2 tập trung cao cũng xử lý dưới 1.000 TPS. Trong khi Solana được thiết kế cho hiệu suất cao hơn, các hạn chế từ sự đa dạng client hiện tại gây tắc nghẽn ở mức 5.000 TPS. Ngược lại, các hệ thống tài chính truyền thống như NASDAQ, CME và Eurex thường xử lý hơn 100.000 thao tác mỗi giây.  

Độ trễ cũng là một hạn chế quan trọng khác đối với các giao thức blockchain phi tập trung. Trong thị trường tài chính — đặc biệt là với việc khám phá giá đối với các tài sản biến động — độ trễ thấp là điều cần thiết cho chất lượng và thanh khoản thị trường. Những người tham gia thị trường truyền thống hoạt động với độ trễ đầu-cuối ở mức mili-giây hoặc dưới mili-giây. Những tốc độ này chỉ đạt được khi các thành phần thị trường có thể đồng vị trí với môi trường thực thi, do giới hạn vật lý của tốc độ ánh sáng.  

Kiến trúc blockchain truyền thống sử dụng bộ validator phân tán toàn cầu không có nhận thức về địa lý, tạo ra các giới hạn hiệu suất cơ bản. Ánh sáng mất hơn 130 mili-giây để đi vòng quanh Trái đất tại xích đạo, ngay cả khi di chuyển theo vòng tròn hoàn hảo — và các đường mạng thực tế còn có khoảng cách bổ sung và độ trễ từ hạ tầng. Những giới hạn vật lý này càng tăng lên khi cơ chế đồng thuận yêu cầu nhiều vòng giao tiếp giữa các validator. Kết quả là, các mạng phải áp dụng thời gian khối và độ trễ hoàn tất bảo thủ để duy trì sự ổn định. Ngay cả trong điều kiện tối ưu, cơ chế đồng thuận phân tán toàn cầu cũng không thể vượt qua những giới hạn mạng cơ bản này.  

Khi blockchain ngày càng tích hợp sâu hơn với hệ thống tài chính toàn cầu, người dùng sẽ yêu cầu hiệu suất tương đương với các hệ thống tập trung hiện nay. Nếu không được thiết kế cẩn thận, việc đáp ứng các yêu cầu này có thể làm giảm đáng kể tính phi tập trung và khả năng phục hồi của mạng blockchain. Để giải quyết thách thức này, chúng tôi đề xuất blockchain lớp một Fogo. Triết lý cốt lõi của Fogo là tối đa hóa thông lượng và giảm thiểu độ trễ thông qua hai cách tiếp cận chính:  
1. Sử dụng phần mềm client có hiệu suất cao nhất trên một bộ validator được phân quyền tối ưu.  
2. Áp dụng cơ chế đồng thuận đồng vị trí (co-located consensus) đồng thời vẫn giữ lại hầu hết các lợi ích phi tập trung của đồng thuận toàn cầu.  

2. Phác thảo
Bài báo được chia thành các phần trình bày các quyết định thiết kế chính của Fogo. Phần 3 đề cập đến mối quan hệ của Fogo với giao thức blockchain Solana và chiến lược về tối ưu hóa client và đa dạng hóa client. Phần 4 đề cập đến đồng thuận đa khu vực, cách triển khai thực tế và các đánh đổi so với đồng thuận toàn cầu hoặc cục bộ. Phần 5 trình bày cách Fogo khởi tạo và duy trì bộ validator. Phần 6 trình bày các phần mở rộng tiềm năng sau thời điểm genesis.  

3. Giao thức và Client
Ở lớp cơ sở, Fogo được xây dựng dựa trên giao thức blockchain phổ biến có hiệu suất cao nhất cho đến nay — Solana. Mạng Solana đã có nhiều giải pháp tối ưu cả về thiết kế giao thức và triển khai client. Fogo hướng tới khả năng tương thích ngược tối đa với Solana, bao gồm tương thích hoàn toàn ở lớp thực thi SVM và tương thích chặt chẽ với cơ chế đồng thuận TowerBFT, truyền khối Turbine, xoay vòng leader của Solana và tất cả các thành phần chính khác của lớp mạng và đồng thuận. Sự tương thích này cho phép Fogo dễ dàng tích hợp và triển khai các chương trình, công cụ và cơ sở hạ tầng hiện có từ hệ sinh thái Solana, cũng như hưởng lợi từ các cải tiến liên tục từ Solana.  

Tuy nhiên, khác với Solana, Fogo sẽ chạy với một client chuẩn duy nhất. Client chuẩn này sẽ là client chính có hiệu suất cao nhất đang chạy trên Solana. Điều này cho phép Fogo đạt hiệu suất cao hơn đáng kể vì mạng sẽ luôn chạy ở tốc độ của client nhanh nhất, trong khi Solana, do bị giới hạn bởi sự đa dạng client, sẽ luôn bị giới hạn bởi client chậm nhất. Trong hiện tại và tương lai gần, client chuẩn này sẽ dựa trên stack Firedancer.  

3.1 Firedancer
Firedancer là triển khai client tương thích với Solana có hiệu suất cao của Jump Crypto, cho thấy thông lượng xử lý giao dịch cao hơn nhiều so với các client validator hiện tại thông qua xử lý song song tối ưu, quản lý bộ nhớ và các chỉ dẫn SIMD.  
Có hai phiên bản: "Frankendancer," một phiên bản lai sử dụng engine xử lý của Firedancer với stack mạng của validator viết bằng Rust, và phiên bản Firedancer thuần với toàn bộ stack mạng viết bằng C, hiện đang trong giai đoạn phát triển cuối.  
Cả hai phiên bản đều duy trì khả năng tương thích giao thức Solana trong khi tối đa hóa hiệu suất. Khi hoàn thành, phiên bản Firedancer thuần dự kiến sẽ thiết lập các tiêu chuẩn hiệu suất mới, khiến nó trở thành lựa chọn lý tưởng cho yêu cầu thông lượng cao của Fogo. Fogo sẽ bắt đầu với mạng dựa trên Frankendancer rồi cuối cùng chuyển sang Firedancer thuần.  

3.2 Client chuẩn vs. Đa dạng client
Các giao thức blockchain hoạt động thông qua phần mềm client thực thi các quy tắc và thông số kỹ thuật của chúng. Trong khi giao thức định nghĩa quy tắc vận hành mạng, client chuyển các thông số này thành phần mềm có thể chạy. Sự đa dạng client thường nhằm mục đích: dự phòng, xác minh độc lập các quy tắc và giảm rủi ro từ lỗ hổng phần mềm trên toàn mạng. Bitcoin là tiền lệ khi Bitcoin Core đóng vai trò client chuẩn trên thực tế dù có các lựa chọn thay thế.  
Tuy nhiên, trong các mạng hiệu suất cao gần giới hạn phần cứng, không gian cho sự đa dạng triển khai bị thu hẹp. Các triển khai tối ưu sẽ hội tụ về các giải pháp tương tự; các khác biệt sẽ làm giảm hiệu suất xuống mức không khả thi. Lợi ích của sự đa dạng giảm đi khi chi phí tương thích giữa các client trở thành nút thắt cổ chai.  

3.3 Khuyến khích giao thức cho client hiệu suất cao
Fogo cho phép bất kỳ client tuân thủ nào, nhưng kiến trúc của nó khuyến khích sử dụng client nhanh nhất. Trong môi trường đồng vị trí, độ trễ mạng là tối thiểu, nên hiệu quả client quyết định hiệu suất của validator. Các thông số khối động tạo áp lực kinh tế để tối đa hóa thông lượng; các client chậm hơn hoặc bỏ lỡ khối hoặc phải bỏ phiếu thận trọng, làm giảm doanh thu. Điều này tự nhiên chọn ra triển khai hiệu quả nhất mà không cần cưỡng chế ở cấp độ giao thức.  

4. Đồng thuận đa khu vực
Đồng thuận đa khu vực cân bằng động giữa hiệu suất của validator đồng vị trí và bảo mật từ phân phối địa lý. Validator phối hợp vị trí vật lý theo từng epoch trong khi duy trì danh tính mật mã riêng cho từng vùng, đạt được đồng thuận độ trễ cực thấp trong hoạt động bình thường với khả năng quay lại đồng thuận toàn cầu khi cần.  
Mô hình này lấy cảm hứng từ mô hình "theo mặt trời" trong thị trường truyền thống, nơi thanh khoản di chuyển giữa Châu Á, Châu Âu và Bắc Mỹ để cân bằng hoạt động liên tục và tập trung thanh khoản.  

4.1 Các vùng và xoay vùng
Vùng là khu vực địa lý — lý tưởng là một trung tâm dữ liệu — nơi độ trễ gần giới hạn phần cứng. Vùng có thể mở rộng khi cần thiết. Xoay vùng mang lại sự phân quyền về quyền tài phán, khả năng phục hồi hạ tầng và tối ưu hóa hiệu suất chiến lược (ví dụ: đặt gần các nguồn thông tin nhạy cảm về giá).  

4.2 Quản lý khóa
Hệ thống hai tầng tách biệt danh tính validator toàn cầu với sự tham gia cụ thể của vùng. Validator giữ khóa toàn cầu cho các hành động cấp cao và ủy quyền cho khóa vùng thông qua sổ đăng ký on-chain.  

4.3 Đề xuất và kích hoạt vùng
Các vùng mới được đề xuất on-chain với thời gian trì hoãn bắt buộc để validator chuẩn bị hạ tầng, bảo mật, mạng và quy trình khôi phục.  

4.4 Quy trình bỏ phiếu chọn vùng
Validator bỏ phiếu về các vùng tương lai và thời gian khối mục tiêu bằng khóa toàn cầu theo trọng số cổ phần. Đa số tuyệt đối thiết lập đủ điều kiện; nếu không, mạng sẽ mặc định sử dụng đồng thuận toàn cầu cho epoch tiếp theo.  

4.5 Chế độ đồng thuận toàn cầu
Chế độ dự phòng và an toàn với các thông số bảo thủ (ví dụ: thời gian khối 400ms, kích thước khối giảm). Kích hoạt khi thất bại trong việc chọn vùng hoặc thất bại hoàn tất trong thời gian chạy; một khi đã kích hoạt giữa epoch thì sẽ duy trì đến epoch tiếp theo.  

5. Bộ validator
Fogo sử dụng bộ validator được tuyển chọn để đạt giới hạn hiệu suất vật lý và giảm thiểu MEV lạm dụng. Ban đầu là bằng chứng ủy quyền (proof-of-authority), sau đó chuyển sang cấp phép trực tiếp cho validator.  

5.1 Kích thước và cấu hình ban đầu
Bộ validator có giới hạn giao thức; mục tiêu ban đầu là 20–50 validator. Một cơ quan genesis chọn bộ ban đầu với quyền quản lý tạm thời.  

5.2 Quản trị và chuyển giao
Quyền kiểm soát chuyển sang bộ validator; thay đổi thành viên yêu cầu đa số hai phần ba. Tỷ lệ thay đổi bị giới hạn để duy trì ổn định.  

5.3 Yêu cầu tham gia
Validator phải đáp ứng mức cổ phần tối thiểu được ủy quyền và được bộ chấp thuận để đảm bảo khả năng và sự phù hợp.  

5.4 Lý do và quản trị mạng
Cơ chế này chính thức hóa việc thực thi hành vi có lợi mà không giảm đáng kể tính phi tập trung, vì bất kỳ siêu đa số PoS nào cũng có thể fork. Nó cho phép phản ứng với các vấn đề hiệu suất kéo dài, MEV lạm dụng, thất bại trong việc truyền khối Turbine và các hành vi có hại khác.  

6. Các phần mở rộng tiềm năng
Các phần mở rộng đang được xem xét vẫn duy trì khả năng tương thích Solana.  

6.1 Thanh toán phí bằng token SPL
Loại giao dịch fee_payer_unsigned cộng với chương trình phí on-chain sẽ cho phép thanh toán phí bằng token SPL thông qua thị trường chuyển tiếp không cần cấp phép, yêu cầu thay đổi giao thức tối thiểu.  

7. Kết luận
Fogo kết hợp triển khai client hiệu suất cao với cơ chế đồng thuận đa khu vực động và bộ validator được tuyển chọn để đạt hiệu suất chưa từng có mà không làm giảm bảo mật cốt lõi của PoS. Di chuyển động cung cấp hiệu suất và khả năng phục hồi với các phương án dự phòng mạnh mẽ; các ưu đãi được điều chỉnh tự nhiên thông qua kinh tế học.
`
const INDONESIAN_TEXT = `
Versi 1.0

Abstrak
Makalah ini memperkenalkan Fogo, protokol blockchain layer 1 baru yang memberikan kinerja terobosan dalam throughput, latensi, dan manajemen kemacetan. Sebagai perpanjangan dari protokol Solana, Fogo mempertahankan kompatibilitas penuh pada lapisan eksekusi SVM, memungkinkan program, alat, dan infrastruktur Solana yang ada untuk bermigrasi dengan mulus sambil mencapai kinerja yang jauh lebih tinggi dan latensi yang lebih rendah.
Fogo menghadirkan tiga inovasi baru:
• Implementasi klien terpadu berbasis pure Firedancer, membuka tingkat kinerja yang tidak dapat dicapai oleh jaringan dengan klien yang lebih lambat—termasuk Solana itu sendiri.
• Konsensus multi-lokal dengan kolokasi dinamis, mencapai waktu blok dan latensi jauh di bawah blockchain besar mana pun.
• Kumpulan validator terkurasi yang memberikan insentif pada kinerja tinggi dan mencegah perilaku predator di tingkat validator.
Inovasi-inovasi ini memberikan peningkatan kinerja yang substansial sambil mempertahankan desentralisasi dan ketangguhan yang penting untuk blockchain layer 1.

1. Pendahuluan
Jaringan blockchain menghadapi tantangan berkelanjutan dalam menyeimbangkan kinerja dengan desentralisasi dan keamanan. Blockchain saat ini mengalami keterbatasan throughput parah yang membuatnya tidak cocok untuk aktivitas keuangan global. Ethereum memproses kurang dari 50 transaksi per detik (TPS) pada lapisan dasarnya. Bahkan layer 2 yang paling terpusat pun menangani kurang dari 1.000 TPS. Sementara Solana dirancang untuk kinerja yang lebih tinggi, keterbatasan dari keragaman klien saat ini menyebabkan kemacetan pada 5.000 TPS. Sebaliknya, sistem keuangan tradisional seperti NASDAQ, CME, dan Eurex secara rutin memproses lebih dari 100.000 operasi per detik.
Latensi adalah batasan kritis lainnya untuk protokol blockchain terdesentralisasi. Dalam pasar keuangan—terutama untuk penemuan harga pada aset volatil—latensi rendah sangat penting untuk kualitas pasar dan likuiditas. Peserta pasar tradisional beroperasi dengan latensi ujung-ke-ujung pada skala milidetik atau sub-milidetik. Kecepatan ini hanya dapat dicapai ketika peserta pasar dapat berkolokasi dengan lingkungan eksekusi karena batasan kecepatan cahaya.
Arsitektur blockchain tradisional menggunakan kumpulan validator terdistribusi secara global yang beroperasi tanpa kesadaran geografis, menciptakan batasan kinerja mendasar. Cahaya sendiri memerlukan waktu lebih dari 130 milidetik untuk mengelilingi bumi di khatulistiwa, bahkan dalam perjalanan lingkaran sempurna—dan jalur jaringan dunia nyata melibatkan jarak tambahan dan penundaan infrastruktur. Batasan fisik ini diperparah ketika konsensus memerlukan beberapa putaran komunikasi antar validator. Akibatnya, jaringan harus menerapkan waktu blok konservatif dan penundaan finalitas untuk menjaga stabilitas. Bahkan dalam kondisi optimal, mekanisme konsensus terdistribusi global tidak dapat mengatasi keterlambatan jaringan dasar ini.
Seiring integrasi blockchain lebih lanjut dengan sistem keuangan global, pengguna akan menuntut kinerja yang sebanding dengan sistem terpusat saat ini. Tanpa desain yang hati-hati, memenuhi tuntutan ini dapat sangat mengorbankan desentralisasi dan ketahanan jaringan blockchain. Untuk mengatasi tantangan ini, kami mengusulkan blockchain layer satu Fogo. Filosofi inti Fogo adalah memaksimalkan throughput dan meminimalkan latensi melalui dua pendekatan utama: pertama, menggunakan perangkat lunak klien dengan kinerja paling tinggi pada kumpulan validator yang didesentralisasi secara optimal; dan kedua, menerapkan konsensus berkolokasi sambil mempertahankan sebagian besar manfaat desentralisasi dari konsensus global.

2. Garis Besar
Makalah ini dipecah menjadi beberapa bagian yang membahas keputusan desain utama seputar Fogo. Bagian 3 membahas hubungan Fogo dengan protokol blockchain Solana dan strateginya terkait optimisasi serta keragaman klien. Bagian 4 membahas konsensus multi-lokal, implementasi praktisnya, dan pertukaran yang dibuatnya dibandingkan dengan konsensus global atau lokal. Bagian 5 membahas pendekatan Fogo untuk menginisialisasi dan memelihara kumpulan validator. Bagian 6 membahas ekstensi prospektif yang mungkin diperkenalkan setelah genesis.

3. Protokol dan Klien
Pada lapisan dasar, Fogo dibangun di atas protokol blockchain yang paling berkinerja tinggi dan banyak digunakan hingga saat ini, Solana. Jaringan Solana sudah dilengkapi dengan berbagai solusi optimisasi, baik dari segi desain protokol maupun implementasi klien. Fogo menargetkan kompatibilitas mundur maksimal dengan Solana, termasuk kompatibilitas penuh pada lapisan eksekusi SVM dan kompatibilitas dekat dengan konsensus TowerBFT, propagasi blok Turbine, rotasi pemimpin Solana, dan semua komponen utama lainnya dari lapisan jaringan dan konsensus. Kompatibilitas ini memungkinkan Fogo untuk dengan mudah mengintegrasikan dan menerapkan program, alat, dan infrastruktur yang ada dari ekosistem Solana; serta mendapatkan manfaat dari peningkatan berkelanjutan dari Solana.
Namun tidak seperti Solana, Fogo akan berjalan dengan satu klien kanonik. Klien kanonik ini akan menjadi klien besar dengan kinerja tertinggi yang berjalan di Solana. Ini memungkinkan Fogo untuk mencapai kinerja yang jauh lebih tinggi karena jaringan akan selalu berjalan pada kecepatan klien tercepat. Sedangkan Solana, yang dibatasi oleh keragaman klien, akan selalu terhambat oleh kecepatan klien paling lambat. Untuk saat ini dan masa mendatang, klien kanonik ini akan berbasis pada stack Firedancer.

3.1 Firedancer
Firedancer adalah implementasi klien Solana-kompatibel berkinerja tinggi dari Jump Crypto, yang menunjukkan throughput pemrosesan transaksi jauh lebih tinggi dibandingkan klien validator saat ini melalui pemrosesan paralel yang dioptimalkan, manajemen memori, dan instruksi SIMD.
Ada dua versi: "Frankendancer," hibrida yang menggunakan mesin pemrosesan Firedancer dengan stack jaringan validator rust, dan implementasi Firedancer penuh dengan penulisan ulang stack jaringan C lengkap, yang saat ini dalam tahap akhir pengembangan.
Kedua versi mempertahankan kompatibilitas protokol Solana sambil memaksimalkan kinerja. Setelah selesai, implementasi pure Firedancer diperkirakan akan menetapkan tolok ukur kinerja baru, menjadikannya ideal untuk kebutuhan throughput tinggi Fogo. Fogo akan memulai dengan jaringan berbasis Frankendancer lalu beralih ke pure Firedancer.

3.2 Klien Kanonik vs. Keragaman Klien
Protokol blockchain beroperasi melalui perangkat lunak klien yang mengimplementasikan aturan dan spesifikasinya. Sementara protokol mendefinisikan aturan operasi jaringan, klien menerjemahkan spesifikasi ini menjadi perangkat lunak yang dapat dijalankan. Keragaman klien secara tradisional memiliki beberapa tujuan: redundansi, verifikasi aturan secara independen, dan pengurangan risiko kerentanan perangkat lunak di seluruh jaringan. Bitcoin menunjukkan preseden di mana Bitcoin Core berfungsi sebagai klien kanonik de facto meskipun ada alternatifnya.
Namun, di jaringan berkinerja tinggi yang mendekati batas perangkat keras fisik, ruang untuk keragaman implementasi menyempit. Implementasi optimal cenderung menuju solusi yang serupa; penyimpangan mengurangi kinerja ke tingkat yang tidak layak. Manfaat keragaman menyusut ketika overhead kompatibilitas antar klien menjadi hambatan.

3.3 Insentif Protokol untuk Klien Berkinerja Tinggi
Fogo mengizinkan klien apa pun yang sesuai, tetapi arsitekturnya memberikan insentif untuk menggunakan klien tercepat. Dalam pengaturan berkolokasi, latensi jaringan minimal, sehingga efisiensi klien menentukan kinerja validator. Parameter blok dinamis menciptakan tekanan ekonomi untuk memaksimalkan throughput; klien yang lebih lambat akan kehilangan blok atau harus memilih secara konservatif, mengurangi pendapatan. Hal ini secara alami memilih implementasi paling efisien tanpa penegakan protokol yang ketat.

4. Konsensus Multi-Lokal
Konsensus multi-lokal secara dinamis menyeimbangkan kinerja kolokasi validator dengan keamanan distribusi geografis. Validator mengoordinasikan lokasi fisik di seluruh epoch sambil mempertahankan identitas kriptografi yang berbeda untuk zona, mencapai konsensus latensi ultra-rendah dalam operasi normal dengan fallback ke konsensus global jika diperlukan.
Model ini terinspirasi dari pola "follow the sun" di pasar tradisional, di mana likuiditas bergerak antara Asia, Eropa, dan Amerika Utara untuk menyeimbangkan operasi berkelanjutan dan konsentrasi likuiditas.

4.1 Zona dan Rotasi Zona
Zona adalah area geografis—idealnya satu pusat data—di mana latensi mendekati batas perangkat keras. Zona dapat diperluas sesuai kebutuhan. Rotasi memberikan desentralisasi yurisdiksi, ketahanan infrastruktur, dan optimisasi kinerja strategis (misalnya, berlokasi dekat sumber informasi sensitif harga).

4.2 Manajemen Kunci
Sistem dua tingkat memisahkan identitas validator global dari partisipasi spesifik zona. Validator menyimpan kunci global untuk tindakan tingkat tinggi dan mendelegasikan ke kunci zona melalui registri on-chain. Delegasi diaktifkan pada batas epoch setelah visibilitas seluruh jaringan.

4.3 Proposal dan Aktivasi Zona
Zona baru diusulkan secara on-chain dengan penundaan wajib bagi validator untuk mempersiapkan infrastruktur, keamanan, jaringan, dan prosedur pemulihan. Hanya setelah penundaan ini zona dapat dipilih melalui pemungutan suara reguler.

4.4 Proses Pemungutan Suara Pemilihan Zona
Validator memberikan suara pada zona masa depan dan waktu blok target menggunakan kunci global berbobot stake. Supermajoritas membentuk kuorum; jika tidak, jaringan default ke konsensus global untuk epoch berikutnya. Jendela ini memungkinkan persiapan infrastruktur dan pemanasan kunci.

4.5 Mode Konsensus Global
Mode fallback dan keamanan dengan parameter konservatif (misalnya, waktu blok 400ms, ukuran blok berkurang). Dipicu oleh kegagalan pemilihan zona atau kegagalan finalitas runtime; setelah dipicu di tengah epoch, mode ini tetap aktif hingga epoch berikutnya.

5. Kumpulan Validator
Fogo menggunakan kumpulan validator terkurasi untuk mencapai batas kinerja fisik dan mengurangi MEV yang merugikan. Awalnya proof-of-authority, bertransisi ke permissioning langsung oleh validator.

5.1 Ukuran dan Konfigurasi Awal
Kumpulan validator memiliki batas protokol; target awal 20–50 validator. Otoritas genesis memilih kumpulan awal dengan kekuasaan manajemen sementara.

5.2 Tata Kelola dan Transisi
Kontrol berpindah ke kumpulan validator; perubahan keanggotaan memerlukan supermajoritas dua pertiga. Pergantian dibatasi kecepatannya untuk menjaga stabilitas.

5.3 Persyaratan Partisipasi
Validator harus memenuhi minimal stake yang didelegasikan dan mendapatkan persetujuan kumpulan untuk memastikan kemampuan dan keselarasan.

5.4 Alasan dan Tata Kelola Jaringan
Mekanisme ini memformalkan penegakan perilaku yang menguntungkan tanpa secara material mengurangi desentralisasi, karena setiap supermajoritas PoS sudah dapat melakukan fork. Mekanisme ini memungkinkan respons terhadap masalah kinerja yang berkelanjutan, MEV yang merugikan, kegagalan meneruskan blok Turbine, dan perilaku berbahaya lainnya.

6. Ekstensi Prospektif
Ekstensi yang sedang dipertimbangkan mempertahankan kompatibilitas Solana.

6.1 Pembayaran Biaya Token SPL
Tipe transaksi fee_payer_unsigned ditambah program biaya on-chain akan memungkinkan pembayaran biaya dalam token SPL melalui pasar relayer tanpa izin, memerlukan perubahan protokol minimal.

7. Kesimpulan
Fogo menggabungkan implementasi klien berkinerja tinggi dengan konsensus multi-lokal dinamis dan kumpulan validator terkurasi untuk mencapai kinerja yang belum pernah terjadi sebelumnya tanpa mengorbankan keamanan inti PoS. Relokasi dinamis memberikan kinerja dan ketahanan dengan fallback yang kuat; insentif selaras secara alami melalui ekonomi.
`
const MALAYSIAN_TEXT = `
Versi 1.0

Abstrak
Kertas ini memperkenalkan Fogo, protokol blockchain lapisan 1 baharu yang memberikan prestasi luar biasa dalam throughput, latensi dan pengurusan kesesakan. Sebagai sambungan kepada protokol Solana, Fogo mengekalkan keserasian penuh pada lapisan pelaksanaan SVM, membolehkan program, peralatan dan infrastruktur Solana sedia ada berpindah dengan lancar sambil mencapai prestasi yang jauh lebih tinggi dan latensi yang lebih rendah.
Fogo menyumbangkan tiga inovasi baharu:
• Pelaksanaan klien bersatu berasaskan pure Firedancer, membuka tahap prestasi yang tidak dapat dicapai oleh rangkaian dengan klien yang lebih perlahan—termasuk Solana sendiri.
• Konsensus multi-lokal dengan kolokasi dinamik, mencapai masa blok dan latensi jauh di bawah mana-mana blockchain utama.
• Set validator terkurasi yang memberi insentif kepada prestasi tinggi dan menghalang tingkah laku pemangsa di peringkat validator.
Inovasi ini memberikan peningkatan prestasi yang ketara sambil mengekalkan desentralisasi dan ketahanan yang penting untuk blockchain lapisan 1.

1. Pengenalan
Rangkaian blockchain berdepan cabaran berterusan dalam mengimbangi prestasi dengan desentralisasi dan keselamatan. Blockchain hari ini mengalami had throughput yang teruk, menjadikannya tidak sesuai untuk aktiviti kewangan global. Ethereum memproses kurang daripada 50 transaksi sesaat (TPS) pada lapisan asasnya. Malah lapisan 2 yang paling berpusat mengendalikan kurang daripada 1,000 TPS. Walaupun Solana direka untuk prestasi yang lebih tinggi, had daripada kepelbagaian klien pada masa ini menyebabkan kesesakan pada 5,000 TPS. Sebaliknya, sistem kewangan tradisional seperti NASDAQ, CME dan Eurex secara rutin memproses lebih daripada 100,000 operasi sesaat.
Latensi adalah satu lagi had kritikal bagi protokol blockchain terdesentralisasi. Dalam pasaran kewangan—terutamanya untuk penemuan harga pada aset yang tidak stabil—latensi rendah adalah penting untuk kualiti pasaran dan kecairan. Peserta pasaran tradisional beroperasi dengan latensi hujung-ke-hujung pada skala milisaat atau sub-milisaat. Kelajuan ini hanya boleh dicapai apabila peserta pasaran boleh berkedudukan bersama dengan persekitaran pelaksanaan disebabkan had kelajuan cahaya.
Seni bina blockchain tradisional menggunakan set validator yang diedarkan secara global tanpa kesedaran geografi, mewujudkan had prestasi asas. Cahaya sendiri mengambil masa lebih 130 milisaat untuk mengelilingi dunia di garisan khatulistiwa, walaupun bergerak dalam bulatan sempurna—dan laluan rangkaian dunia nyata melibatkan jarak tambahan dan kelewatan infrastruktur. Had fizikal ini bertambah apabila konsensus memerlukan beberapa pusingan komunikasi antara validator. Akibatnya, rangkaian mesti melaksanakan masa blok konservatif dan kelewatan finaliti untuk mengekalkan kestabilan. Malah dalam keadaan optimum, mekanisme konsensus teragih global tidak dapat mengatasi kelewatan rangkaian asas ini.
Apabila blockchain semakin berintegrasi dengan sistem kewangan global, pengguna akan menuntut prestasi setara dengan sistem berpusat hari ini. Tanpa reka bentuk yang teliti, memenuhi tuntutan ini boleh menjejaskan desentralisasi dan daya tahan rangkaian blockchain. Untuk menangani cabaran ini, kami mencadangkan blockchain lapisan satu Fogo. Falsafah teras Fogo adalah memaksimumkan throughput dan meminimumkan latensi melalui dua pendekatan utama: pertama, menggunakan perisian klien berprestasi paling tinggi pada set validator yang dioptimumkan secara desentralisasi; dan kedua, menerima konsensus berkolokasi sambil mengekalkan sebahagian besar manfaat desentralisasi daripada konsensus global.

2. Garis Besar
Kertas ini dipecahkan kepada bahagian-bahagian yang merangkumi keputusan reka bentuk utama mengenai Fogo. Seksyen 3 merangkumi hubungan Fogo dengan protokol blockchain Solana dan strateginya berkaitan pengoptimuman klien dan kepelbagaian. Seksyen 4 merangkumi konsensus multi-lokal, pelaksanaan praktikalnya, dan pertukaran yang dibuat berbanding konsensus global atau tempatan. Seksyen 5 merangkumi pendekatan Fogo untuk memulakan dan mengekalkan set validator. Seksyen 6 merangkumi sambungan prospektif yang mungkin diperkenalkan selepas genesis.

3. Protokol dan Klien
Pada lapisan asas, Fogo bermula dengan membina di atas protokol blockchain yang paling berprestasi tinggi dan digunakan secara meluas setakat ini, Solana. Rangkaian Solana sudah mempunyai pelbagai penyelesaian pengoptimuman, dari segi reka bentuk protokol dan pelaksanaan klien. Fogo menyasarkan keserasian ke belakang maksimum dengan Solana, termasuk keserasian penuh pada lapisan pelaksanaan SVM dan keserasian rapat dengan konsensus TowerBFT, penyebaran blok Turbine, giliran pemimpin Solana dan semua komponen utama lain daripada lapisan rangkaian dan konsensus. Keserasian ini membolehkan Fogo mengintegrasi dan menggunakan program, peralatan dan infrastruktur sedia ada daripada ekosistem Solana dengan mudah; serta mendapat manfaat daripada penambahbaikan berterusan daripada Solana.
Namun tidak seperti Solana, Fogo akan berjalan dengan satu klien kanonik. Klien kanonik ini akan menjadi klien utama berprestasi paling tinggi yang berjalan pada Solana. Ini membolehkan Fogo mencapai prestasi yang jauh lebih tinggi kerana rangkaian akan sentiasa berjalan pada kelajuan klien terpantas. Manakala Solana, yang dihadkan oleh kepelbagaian klien, akan sentiasa dibelenggu oleh kelajuan klien paling perlahan. Buat masa sekarang dan masa depan yang dapat dijangka, klien kanonik ini akan berasaskan stack Firedancer.

3.1 Firedancer
Firedancer ialah pelaksanaan klien Solana serasi berprestasi tinggi oleh Jump Crypto, yang menunjukkan throughput pemprosesan transaksi jauh lebih tinggi berbanding klien validator semasa melalui pemprosesan selari yang dioptimumkan, pengurusan memori, dan arahan SIMD.
Terdapat dua versi: "Frankendancer," hibrid yang menggunakan enjin pemprosesan Firedancer dengan stack rangkaian validator rust, dan pelaksanaan Firedancer penuh dengan penulisan semula stack rangkaian C lengkap, yang kini dalam pembangunan peringkat akhir.
Kedua-dua versi mengekalkan keserasian protokol Solana sambil memaksimumkan prestasi. Setelah siap, pelaksanaan pure Firedancer dijangka menetapkan penanda aras prestasi baharu, menjadikannya ideal untuk keperluan throughput tinggi Fogo. Fogo akan bermula dengan rangkaian berasaskan Frankendancer kemudian beralih ke pure Firedancer.

3.2 Klien Kanonik vs. Kepelbagaian Klien
Protokol blockchain beroperasi melalui perisian klien yang melaksanakan peraturan dan spesifikasinya. Walaupun protokol menentukan peraturan operasi rangkaian, klien menterjemahkan spesifikasi ini kepada perisian boleh laku. Kepelbagaian klien secara tradisional berfungsi untuk beberapa tujuan: redundansi, pengesahan peraturan secara bebas, dan pengurangan risiko kelemahan perisian di seluruh rangkaian. Bitcoin menunjukkan preseden di mana Bitcoin Core berfungsi sebagai klien kanonik de facto walaupun terdapat alternatif.
Namun, dalam rangkaian berprestasi tinggi yang hampir dengan had perkakasan fizikal, ruang untuk kepelbagaian pelaksanaan semakin mengecil. Pelaksanaan optimum cenderung menyatu kepada penyelesaian serupa; penyimpangan mengurangkan prestasi ke tahap yang tidak layak. Manfaat kepelbagaian berkurang apabila overhead keserasian antara klien menjadi penghalang.

3.3 Insentif Protokol untuk Klien Berprestasi Tinggi
Fogo membenarkan mana-mana klien yang mematuhi, tetapi arkitekturnya memberi insentif untuk menggunakan klien terpantas. Dalam tetapan berkolokasi, latensi rangkaian adalah minimum, jadi kecekapan klien menentukan prestasi validator. Parameter blok dinamik mewujudkan tekanan ekonomi untuk memaksimumkan throughput; klien yang lebih perlahan sama ada akan terlepas blok atau perlu mengundi secara konservatif, mengurangkan pendapatan. Ini secara semula jadi memilih pelaksanaan paling cekap tanpa penguatkuasaan protokol yang ketat.

4. Konsensus Multi-Lokal
Konsensus multi-lokal secara dinamik mengimbangi prestasi kolokasi validator dengan keselamatan pengedaran geografi. Validator menyelaras lokasi fizikal merentasi epoch sambil mengekalkan identiti kriptografi yang berbeza untuk zon, mencapai konsensus latensi ultra rendah dalam operasi biasa dengan fallback kepada konsensus global apabila diperlukan.
Model ini diilhamkan oleh corak "follow the sun" dalam pasaran tradisional, di mana kecairan bergerak antara Asia, Eropah, dan Amerika Utara untuk mengimbangi operasi berterusan dan kepekatan kecairan.

4.1 Zon dan Putaran Zon
Zon ialah kawasan geografi—idealnya satu pusat data—di mana latensi menghampiri had perkakasan. Zon boleh diperluaskan mengikut keperluan. Putaran memberikan desentralisasi bidang kuasa, ketahanan infrastruktur, dan pengoptimuman prestasi strategik (contohnya, terletak berhampiran sumber maklumat sensitif harga).

4.2 Pengurusan Kunci
Sistem dua peringkat memisahkan identiti validator global daripada penyertaan khusus zon. Validator menyimpan kunci global untuk tindakan peringkat tinggi dan mendelegasikan kepada kunci zon melalui daftar on-chain. Delegasi diaktifkan pada sempadan epoch selepas keterlihatan seluruh rangkaian.

4.3 Cadangan dan Pengaktifan Zon
Zon baharu dicadangkan secara on-chain dengan kelewatan mandatori untuk validator menyediakan infrastruktur, keselamatan, rangkaian, dan prosedur pemulihan. Hanya selepas kelewatan zon boleh dipilih melalui pengundian biasa.

4.4 Proses Pengundian Pemilihan Zon
Validator mengundi zon masa depan dan masa blok sasaran menggunakan kunci global berpemberat pegangan. Supermajoriti mewujudkan kuorum; jika tidak, rangkaian lalai kepada konsensus global untuk epoch berikutnya. Tetingkap ini membolehkan penyediaan infrastruktur dan pemanasan kunci.

4.5 Mod Konsensus Global
Mod fallback dan keselamatan dengan parameter konservatif (contohnya, masa blok 400ms, saiz blok dikurangkan). Dicetuskan oleh kegagalan pemilihan zon atau kegagalan finaliti runtime; setelah dicetuskan di tengah epoch, ia kekal sehingga epoch berikutnya.

5. Set Validator
Fogo menggunakan set validator terkurasi untuk mencapai had prestasi fizikal dan mengurangkan MEV yang memudaratkan. Pada mulanya proof-of-authority, beralih kepada kebenaran terus oleh validator.

5.1 Saiz dan Konfigurasi Awal
Set validator mempunyai had protokol; sasaran awal 20–50 validator. Autoriti genesis memilih set awal dengan kuasa pengurusan sementara.

5.2 Tadbir Urus dan Peralihan
Kawalan beralih kepada set validator; perubahan keahlian memerlukan supermajoriti dua pertiga. Pertukaran dihadkan kadarnya untuk mengekalkan kestabilan.

5.3 Keperluan Penyertaan
Validator mesti memenuhi minimum pegangan yang didelegasikan dan mendapatkan kelulusan set untuk memastikan kemampuan dan penjajaran.

5.4 Rasional dan Tadbir Urus Rangkaian
Mekanisme ini memformalkan penguatkuasaan tingkah laku yang bermanfaat tanpa mengurangkan desentralisasi secara material, kerana mana-mana supermajoriti PoS sudah boleh melakukan fork. Ia membolehkan tindak balas terhadap masalah prestasi yang berterusan, MEV yang memudaratkan, kegagalan menghantar blok Turbine, dan tingkah laku berbahaya lain.

6. Sambungan Prospektif
Sambungan yang sedang dipertimbangkan mengekalkan keserasian Solana.

6.1 Pembayaran Yuran Token SPL
Jenis transaksi fee_payer_unsigned ditambah program yuran on-chain akan membolehkan pembayaran yuran dalam token SPL melalui pasaran relayer tanpa kebenaran, memerlukan perubahan protokol minimum.

7. Kesimpulan
Fogo menggabungkan pelaksanaan klien berprestasi tinggi dengan konsensus multi-lokal dinamik dan set validator terkurasi untuk mencapai prestasi yang belum pernah dicapai tanpa menjejaskan keselamatan teras PoS. Penempatan semula dinamik memberikan prestasi dan ketahanan dengan fallback yang kukuh; insentif sejajar secara semula jadi melalui ekonomi.
`
const CHINESE_TEXT = `
版本 1.0

摘要
本文介绍了 Fogo，这是一种新型的一层区块链协议，在吞吐量、延迟和拥塞管理方面实现了突破性的性能。作为 Solana 协议的扩展，Fogo 在 SVM 执行层保持完全兼容，使现有的 Solana 程序、工具和基础设施能够无缝迁移，同时实现显著更高的性能和更低的延迟。
Fogo 引入了三项创新：
• 基于纯 Firedancer 的统一客户端实现，解锁了其他运行较慢客户端（包括 Solana 自身）网络无法达到的性能水平。
• 具有动态共址的多本地共识，区块时间和延迟远低于任何主要区块链。
• 精选的验证者集合，激励高性能并在验证者层面遏制掠夺性行为。
这些创新在保留一层区块链去中心化和稳健性的同时，带来了显著的性能提升。

1. 引言
区块链网络在平衡性能、去中心化和安全性方面面临持续的挑战。如今的区块链在吞吐量上存在严重限制，使其不适合全球金融活动。以太坊在其基础层每秒处理的交易（TPS）不到 50 笔。即使是最集中的二层网络，每秒处理的交易量也不到 1000 笔。尽管 Solana 的设计目标是更高的性能，但由于客户端多样性的限制，目前在 5000 TPS 时会出现拥塞。相比之下，传统金融系统（如纳斯达克、CME 和 Eurex）经常每秒处理超过 10 万次操作。
延迟是去中心化区块链协议的另一个关键限制。在金融市场，尤其是在波动性资产的价格发现中，低延迟对于市场质量和流动性至关重要。传统市场参与者的端到端延迟可达到毫秒级甚至亚毫秒级。只有当市场参与者能够与执行环境共址时，这种速度才有可能实现，因为受光速限制。
传统区块链架构使用地理分布广泛的验证者集合，缺乏地理意识，从而造成了根本性的性能限制。即便在赤道上光以完美圆形路径环绕地球一周，也需要 130 毫秒以上，而现实中的网络路径还涉及额外的距离和基础设施延迟。当共识需要验证者之间进行多轮通信时，这些物理限制会被放大。因此，为了保持稳定性，网络必须设置保守的区块时间和最终确定性延迟。即使在最佳条件下，全球分布的共识机制也无法克服这些基本的网络延迟。
随着区块链进一步融入全球金融体系，用户将要求其性能与当今的中心化系统相媲美。如果没有精心的设计，满足这些需求可能会严重削弱区块链网络的去中心化和弹性。为了解决这一挑战，我们提出了一层区块链 Fogo。Fogo 的核心理念是通过两种关键方法最大化吞吐量并最小化延迟：首先，使用性能最高的客户端软件运行在最佳去中心化的验证者集合上；其次，在保留大部分全球共识去中心化优势的同时，采用共址共识。

2. 大纲
本文分为几个部分，涵盖了围绕 Fogo 的主要设计决策。第 3 节介绍了 Fogo 与 Solana 区块链协议的关系，以及其在客户端优化和多样性方面的策略。第 4 节介绍了多本地共识、其实用实现及其相对于全球或本地共识的权衡。第 5 节介绍了 Fogo 在初始化和维护验证者集合方面的方法。第 6 节介绍了创世后可能引入的扩展。

3. 协议与客户端
在底层，Fogo 建立在迄今为止性能最高且被广泛使用的区块链协议 Solana 之上。Solana 网络已经在协议设计和客户端实现方面提供了许多优化方案。Fogo 的目标是尽可能与 Solana 保持向后兼容，包括在 SVM 执行层的完全兼容，以及与 TowerBFT 共识、Turbine 区块传播、Solana 领导者轮换和网络与共识层的所有其他主要组件的高度兼容。这种兼容性使 Fogo 能够轻松集成和部署 Solana 生态系统中的现有程序、工具和基础设施，同时受益于 Solana 的持续上游改进。
然而，与 Solana 不同，Fogo 将运行一个单一的规范客户端。该规范客户端将是运行在 Solana 上的性能最高的主要客户端。这使 Fogo 能够实现显著更高的性能，因为网络始终以最快客户端的速度运行。而 Solana 由于受客户端多样性限制，将始终受制于最慢客户端的速度。在目前和可预见的未来，这个规范客户端将基于 Firedancer 技术栈。

3.1 Firedancer
Firedancer 是 Jump Crypto 开发的高性能 Solana 兼容客户端实现，通过优化并行处理、内存管理和 SIMD 指令，实现了比当前验证者客户端更高的交易处理吞吐量。
目前有两个版本：“Frankendancer”，这是一个将 Firedancer 的处理引擎与 Rust 验证者的网络栈相结合的混合版本；以及纯 Firedancer 实现，它完全用 C 语言重写了网络栈，目前处于开发的后期阶段。
这两个版本都保持了 Solana 协议的兼容性，同时最大化了性能。一旦纯 Firedancer 实现完成，预计将创造新的性能基准，非常适合 Fogo 的高吞吐量需求。Fogo 将从基于 Frankendancer 的网络开始，最终过渡到纯 Firedancer。

3.2 规范客户端与客户端多样性
区块链协议通过实现其规则和规范的客户端软件运行。虽然协议定义了网络运行的规则，但客户端将这些规范转化为可执行的软件。客户端多样性传统上有多个目的：冗余、规则的独立验证以及降低全网软件漏洞的风险。比特币的先例表明，即使有替代方案，Bitcoin Core 仍然是事实上的规范客户端。
然而，在接近物理硬件极限的高性能网络中，实现多样性的空间会缩小。最优实现会趋同于相似的解决方案；偏离会将性能降低到不可行的水平。随着跨客户端兼容性开销成为瓶颈，多样性的好处会减少。

3.3 协议对高性能客户端的激励
Fogo 允许任何符合要求的客户端，但其架构会激励使用最快的客户端。在共址环境中，网络延迟极小，因此客户端效率决定了验证者的性能。动态区块参数会产生经济压力以最大化吞吐量；速度较慢的客户端要么错过区块，要么必须保守投票，从而减少收入。这会自然选择出最高效的实现，而无需协议硬性规定。

4. 多本地共识
多本地共识在验证者共址的性能与地理分布的安全性之间动态平衡。验证者在每个周期协调物理位置，同时为各个区域保持独立的加密身份，从而在正常操作中实现超低延迟的共识，并在需要时回退到全球共识。
该模型的灵感来源于传统市场中的“追随太阳”模式，即流动性在亚洲、欧洲和北美之间转移，以平衡连续运营和集中流动性。

4.1 区域与区域轮换
区域是一个地理区域——理想情况下是单个数据中心——其延迟接近硬件极限。必要时可扩展区域。轮换可提供司法管辖去中心化、基础设施弹性和战略性能优化（例如，位于接近价格敏感信息来源的位置）。

4.2 密钥管理
两层系统将全球验证者身份与特定区域参与分开。验证者保留用于高层操作的全球密钥，并通过链上注册表将权限委派给区域密钥。委派在网络范围可见后，于周期边界生效。

4.3 区域提案与激活
新区由链上提议，并设有强制延迟，以便验证者准备基础设施、安全、网络和恢复程序。延迟结束后，才能通过常规投票选择区域。

4.4 区域选择投票流程
验证者使用按权益加权的全球密钥对未来区域和目标区块时间进行投票。超级多数建立法定人数；否则网络将在下一个周期默认为全球共识。此窗口可用于基础设施准备和密钥预热。

4.5 全球共识模式
一种回退和安全模式，采用保守参数（如 400ms 区块时间、减小区块大小）。在区域选择失败或运行时最终性失败时触发；一旦在周期中触发，将持续到下一个周期。

5. 验证者集合
Fogo 使用精选的验证者集合，以达到物理性能极限并减少滥用 MEV 的行为。初期采用权威证明（PoA），随后过渡到验证者直接许可制。

5.1 规模与初始配置
验证者集合有协议限制；初始目标为 20–50 个验证者。创世权威选择初始集合，并拥有临时管理权。

5.2 治理与过渡
控制权过渡到验证者集合；成员变更需要三分之二多数同意。人员更替有限速率，以保持稳定性。

5.3 参与要求
验证者必须满足最低委托权益，并获得集合批准，以确保其能力与一致性。

5.4 理由与网络治理
该机制在不显著降低去中心化的情况下，形式化地执行有益行为，因为任何 PoS 超级多数都可以进行分叉。它能够应对持续的性能问题、滥用 MEV、不转发 Turbine 区块以及其他有害行为。

6. 预期扩展
考虑中的扩展保持与 Solana 的兼容性。

6.1 SPL 代币手续费支付
一种 fee_payer_unsigned 交易类型，加上链上的手续费程序，将允许通过无需许可的中继市场，用 SPL 代币支付手续费，仅需最小化协议更改。

7. 结论
Fogo 结合高性能客户端实现、动态多本地共识和精选的验证者集合，在不损害核心 PoS 安全性的情况下，实现了前所未有的性能。动态迁移在提供性能和弹性的同时，具备稳健的回退机制；激励机制通过经济原理自然对齐。
`
const THAI_TEXT = `
Version 1.0

บทคัดย่อ  
เอกสารนี้นำเสนอ Fogo ซึ่งเป็นโปรโตคอลบล็อกเชนเลเยอร์ 1 แบบใหม่ ที่มอบประสิทธิภาพการทำงานระดับก้าวกระโดดทั้งด้านปริมาณธุรกรรม ความหน่วงต่ำ และการจัดการความหนาแน่นของเครือข่าย  
Fogo พัฒนามาจากโปรโตคอล Solana โดยคงความเข้ากันได้เต็มรูปแบบในชั้นการประมวลผล SVM ทำให้โปรแกรม เครื่องมือ และโครงสร้างพื้นฐานเดิมของ Solana สามารถย้ายมาใช้งานได้อย่างไร้รอยต่อ พร้อมบรรลุประสิทธิภาพที่สูงขึ้นอย่างมากและมีความหน่วงต่ำกว่าเดิม  
Fogo มีนวัตกรรมใหม่หลัก 3 ประการ:  
• การใช้ไคลเอนต์แบบรวมที่พัฒนาจาก Firedancer บริสุทธิ์ ซึ่งปลดล็อกประสิทธิภาพในระดับที่เครือข่ายที่มีไคลเอนต์ช้ากว่า—including Solana เอง—ไม่สามารถทำได้  
• กลไกฉันทามติแบบ multi-local พร้อมการ colocation แบบไดนามิก ที่ทำให้เวลาสร้างบล็อกและความหน่วงต่ำกว่าบล็อกเชนรายใหญ่ใด ๆ  
• ชุดตัวตรวจสอบบล็อก (validator) ที่คัดเลือกอย่างพิถีพิถัน เพื่อสร้างแรงจูงใจให้มีประสิทธิภาพสูง และยับยั้งพฤติกรรมที่เอาเปรียบในระดับ validator  
นวัตกรรมเหล่านี้มอบประสิทธิภาพที่ก้าวกระโดด โดยยังคงรักษาการกระจายศูนย์และความแข็งแกร่งที่จำเป็นต่อบล็อกเชนเลเยอร์ 1

1. บทนำ  
เครือข่ายบล็อกเชนเผชิญความท้าทายอย่างต่อเนื่องในการสร้างสมดุลระหว่างประสิทธิภาพ การกระจายศูนย์ และความปลอดภัย ปัจจุบันบล็อกเชนมีข้อจำกัดรุนแรงด้านปริมาณธุรกรรม ทำให้ไม่เหมาะสมต่อกิจกรรมทางการเงินระดับโลก Ethereum ประมวลผลธุรกรรมได้ไม่ถึง 50 TPS บนเลเยอร์หลัก แม้แต่เลเยอร์ 2 ที่รวมศูนย์มากก็ยังทำได้ไม่ถึง 1,000 TPS ในขณะที่ Solana ถูกออกแบบมาเพื่อให้มีประสิทธิภาพสูงกว่า แต่ข้อจำกัดจากความหลากหลายของไคลเอนต์ทำให้เกิดความหนาแน่นของเครือข่ายที่ประมาณ 5,000 TPS ในทางกลับกัน ระบบการเงินดั้งเดิมเช่น NASDAQ, CME และ Eurex สามารถประมวลผลได้มากกว่า 100,000 รายการต่อวินาทีเป็นประจำ  
ความหน่วงยังเป็นข้อจำกัดสำคัญอีกประการของโปรโตคอลบล็อกเชนแบบกระจายศูนย์ ในตลาดการเงิน—โดยเฉพาะการค้นหาราคาสินทรัพย์ที่ผันผวน—ความหน่วงต่ำเป็นสิ่งจำเป็นต่อคุณภาพตลาดและสภาพคล่อง ผู้เล่นในตลาดดั้งเดิมดำเนินงานด้วยความหน่วงปลายทางต่อปลายทางในระดับมิลลิวินาทีหรือต่ำกว่านั้น ซึ่งทำได้ก็ต่อเมื่อผู้เข้าร่วมตลาดสามารถวางระบบร่วมกับสภาพแวดล้อมการประมวลผล (co-location) เนื่องจากข้อจำกัดของความเร็วแสง  
สถาปัตยกรรมบล็อกเชนแบบดั้งเดิมใช้ชุดตัวตรวจสอบที่กระจายทั่วโลกโดยไม่มีการรับรู้ตำแหน่งทางภูมิศาสตร์ ทำให้เกิดข้อจำกัดเชิงกายภาพอย่างหลีกเลี่ยงไม่ได้ แสงใช้เวลากว่า 130 มิลลิวินาทีในการโคจรรอบโลกแม้ในเส้นทางที่สมบูรณ์แบบ—และเส้นทางเครือข่ายในโลกจริงยังเพิ่มระยะทางและความหน่วงจากโครงสร้างพื้นฐานอีกด้วย เมื่อกลไกฉันทามติต้องสื่อสารหลายรอบระหว่างตัวตรวจสอบ ความล่าช้าทางกายภาพเหล่านี้ยิ่งทวีคูณ ทำให้ต้องใช้เวลาบล็อกและการยืนยันที่ระมัดระวังเพื่อความเสถียร แม้ในสภาพที่เหมาะสมที่สุด กลไกฉันทามติที่กระจายทั่วโลกก็ไม่สามารถเอาชนะข้อจำกัดทางเครือข่ายพื้นฐานนี้ได้  
เมื่อบล็อกเชนผสานเข้ากับระบบการเงินโลกมากขึ้น ผู้ใช้จะต้องการประสิทธิภาพที่ใกล้เคียงกับระบบรวมศูนย์ในปัจจุบัน หากออกแบบอย่างไม่ระวัง การตอบสนองต่อความต้องการนี้อาจลดการกระจายศูนย์และความทนทานของเครือข่ายอย่างมาก เพื่อรับมือกับความท้าทายนี้ เราจึงเสนอ Fogo บล็อกเชนเลเยอร์หนึ่ง ซึ่งมีปรัชญาหลักคือการเพิ่มปริมาณธุรกรรมและลดความหน่วงให้มากที่สุด ด้วย 2 แนวทางหลัก: หนึ่ง ใช้ซอฟต์แวร์ไคลเอนต์ที่มีประสิทธิภาพสูงที่สุดบนชุดตัวตรวจสอบที่กระจายศูนย์อย่างเหมาะสม และสอง ใช้กลไกฉันทามติแบบ co-location โดยยังคงรักษาประโยชน์ส่วนใหญ่ของฉันทามติระดับโลก

2. โครงร่าง  
เอกสารถูกแบ่งเป็นหมวดหมู่ตามการตัดสินใจออกแบบหลักของ Fogo หมวด 3 ครอบคลุมความสัมพันธ์ของ Fogo กับโปรโตคอล Solana และกลยุทธ์ด้านการเพิ่มประสิทธิภาพและความหลากหลายของไคลเอนต์ หมวด 4 ครอบคลุมกลไก multi-local consensus การใช้งานจริง และการแลกเปลี่ยนข้อดีข้อเสียเมื่อเทียบกับฉันทามติระดับโลกหรือท้องถิ่น หมวด 5 ครอบคลุมวิธีการตั้งค่าและดูแลชุดตัวตรวจสอบของ Fogo หมวด 6 ครอบคลุมการขยายที่อาจนำมาใช้หลังจากการเปิดตัว

3. โปรโตคอลและไคลเอนต์  
ในชั้นฐาน Fogo เริ่มจากการสร้างบนโปรโตคอลบล็อกเชนที่มีประสิทธิภาพสูงและถูกใช้งานอย่างกว้างขวางที่สุดในปัจจุบัน คือ Solana เครือข่าย Solana มีการเพิ่มประสิทธิภาพทั้งในแง่การออกแบบโปรโตคอลและการพัฒนาไคลเอนต์อยู่แล้ว Fogo มีเป้าหมายให้เข้ากันได้สูงสุดกับ Solana รวมถึงความเข้ากันได้เต็มที่ในชั้น SVM และเข้ากันได้ใกล้เคียงกับ TowerBFT consensus, Turbine block propagation, การหมุนเวียนผู้นำของ Solana และองค์ประกอบหลักอื่น ๆ ของเครือข่ายและชั้นฉันทามติ ความเข้ากันได้นี้ทำให้ Fogo สามารถนำโปรแกรม เครื่องมือ และโครงสร้างพื้นฐานเดิมจากระบบนิเวศของ Solana มาใช้ได้ทันที รวมถึงได้รับประโยชน์จากการปรับปรุงต่อเนื่องของ Solana ด้วย  
แต่ต่างจาก Solana ตรงที่ Fogo จะใช้ไคลเอนต์เดียวแบบ canonical เท่านั้น ไคลเอนต์นี้จะเป็นไคลเอนต์ที่มีประสิทธิภาพสูงที่สุดในบรรดาไคลเอนต์ที่ทำงานบน Solana ทำให้ Fogo สามารถทำงานได้เร็วกว่าอย่างมาก เพราะเครือข่ายจะทำงานที่ความเร็วของไคลเอนต์ที่เร็วที่สุด ขณะที่ Solana ถูกจำกัดด้วยความหลากหลายของไคลเอนต์ ทำให้ต้องรอไคลเอนต์ที่ช้าที่สุด ในระยะนี้และอนาคตอันใกล้ ไคลเอนต์ canonical นี้จะพัฒนาจากสแต็ก Firedancer

3.1 Firedancer  
Firedancer เป็นการพัฒนาไคลเอนต์ที่เข้ากันได้กับ Solana ของ Jump Crypto ซึ่งมีประสิทธิภาพสูงกว่ามากในด้านการประมวลผลธุรกรรม ด้วยการประมวลผลแบบขนาน การจัดการหน่วยความจำ และคำสั่ง SIMD ที่ได้รับการปรับแต่งแล้ว  
มี 2 เวอร์ชัน: "Frankendancer" ซึ่งเป็นไฮบริดที่ใช้เอนจินประมวลผลของ Firedancer กับระบบเครือข่ายของไคลเอนต์ Rust และเวอร์ชัน Firedancer เต็มรูปแบบซึ่งเขียนระบบเครือข่ายในภาษา C ใหม่ทั้งหมด และอยู่ในขั้นตอนการพัฒนาใกล้เสร็จสมบูรณ์  
ทั้งสองเวอร์ชันยังคงเข้ากันได้กับโปรโตคอล Solana ในขณะที่เพิ่มประสิทธิภาพสูงสุด เมื่อพัฒนาเสร็จ เวอร์ชัน Firedancer บริสุทธิ์คาดว่าจะสร้างมาตรฐานใหม่ด้านประสิทธิภาพ ทำให้เหมาะสมต่อความต้องการปริมาณธุรกรรมสูงของ Fogo Fogo จะเริ่มจากเครือข่ายที่ใช้ Frankendancer และค่อย ๆ เปลี่ยนไปใช้ Firedancer บริสุทธิ์

3.2 ไคลเอนต์ Canonical vs. ความหลากหลายของไคลเอนต์  
โปรโตคอลบล็อกเชนทำงานผ่านซอฟต์แวร์ไคลเอนต์ที่นำกฎและข้อกำหนดไปใช้จริง ขณะที่โปรโตคอลกำหนดกฎของการทำงานของเครือข่าย ไคลเอนต์จะนำข้อกำหนดเหล่านั้นมาสร้างเป็นซอฟต์แวร์ที่ทำงานได้ ความหลากหลายของไคลเอนต์โดยปกติจะมีหลายประโยชน์ เช่น ความซ้ำซ้อน การตรวจสอบกฎอย่างอิสระ และลดความเสี่ยงจากช่องโหว่ของซอฟต์แวร์ที่กระทบทั้งเครือข่าย Bitcoin เป็นตัวอย่างที่ Bitcoin Core ทำหน้าที่เป็นไคลเอนต์ canonical โดยพฤตินัย แม้จะมีไคลเอนต์อื่น ๆ  
อย่างไรก็ตาม ในเครือข่ายที่เน้นประสิทธิภาพสูงใกล้ข้อจำกัดทางฮาร์ดแวร์ ความหลากหลายของการพัฒนามักจะลดลง การพัฒนาที่ดีที่สุดมักจะบรรจบกันที่โซลูชันคล้ายกัน การเบี่ยงเบนไปจากนี้ทำให้ประสิทธิภาพลดลงจนไม่สามารถใช้งานได้จริง และประโยชน์จากความหลากหลายจะลดลงเมื่อค่าใช้จ่ายด้านความเข้ากันได้ระหว่างไคลเอนต์กลายเป็นคอขวด

3.3 แรงจูงใจด้านโปรโตคอลเพื่อให้ใช้ไคลเอนต์ที่มีประสิทธิภาพสูง  
Fogo อนุญาตให้ใช้ไคลเอนต์ใดก็ได้ที่เป็นไปตามข้อกำหนด แต่สถาปัตยกรรมของมันสร้างแรงจูงใจให้ใช้ไคลเอนต์ที่เร็วที่สุด ในสภาพแวดล้อม co-location ความหน่วงเครือข่ายต่ำมาก ดังนั้นประสิทธิภาพของไคลเอนต์จึงเป็นตัวกำหนดความสามารถของ validator พารามิเตอร์บล็อกแบบไดนามิกสร้างแรงกดดันทางเศรษฐกิจให้เพิ่มปริมาณธุรกรรมให้มากที่สุด ไคลเอนต์ที่ช้าจะพลาดการสร้างบล็อกหรือจำเป็นต้องโหวตอย่างระมัดระวังเพื่อลดความเสี่ยง ทำให้รายได้ลดลง ผลที่ได้คือมีการเลือกใช้การพัฒนาที่มีประสิทธิภาพสูงที่สุดโดยไม่ต้องบังคับใช้จากโปรโตคอลโดยตรง

4. Multi-Local Consensus  
กลไก multi-local consensus ปรับสมดุลระหว่างประสิทธิภาพจากการ co-location ของ validator กับความปลอดภัยจากการกระจายทางภูมิศาสตร์ ตัวตรวจสอบจะประสานตำแหน่งจริงในแต่ละ epoch ขณะที่คงตัวตนเข้ารหัสที่แยกกันสำหรับแต่ละโซน เพื่อให้ได้ฉันทามติความหน่วงต่ำมากในสถานการณ์ปกติ และมี fallback ไปที่ฉันทามติระดับโลกเมื่อจำเป็น  
โมเดลนี้ได้แรงบันดาลใจจากรูปแบบ "follow the sun" ในตลาดดั้งเดิม ซึ่งสภาพคล่องจะเคลื่อนระหว่างเอเชีย ยุโรป และอเมริกาเหนือ เพื่อให้การดำเนินงานต่อเนื่องและมีสภาพคล่องสูง

4.1 โซนและการหมุนเวียนโซน  
โซนคือพื้นที่ทางภูมิศาสตร์—โดยอุดมคติคือศูนย์ข้อมูลเดียว—ซึ่งมีความหน่วงใกล้เคียงกับขีดจำกัดฮาร์ดแวร์ โซนอาจขยายได้ตามความจำเป็น การหมุนเวียนโซนช่วยเพิ่มการกระจายศูนย์ในด้านเขตอำนาจ ความทนทานของโครงสร้างพื้นฐาน และการเพิ่มประสิทธิภาพเชิงกลยุทธ์ (เช่น การตั้งใกล้แหล่งข้อมูลราคาที่สำคัญ)

4.2 การจัดการกุญแจ  
ระบบสองชั้นแยกตัวตน validator ระดับโลกออกจากการเข้าร่วมในโซน ตัวตรวจสอบจะเก็บกุญแจระดับโลกเพื่อการกระทำระดับสูง และมอบสิทธิ์ให้กับกุญแจโซนผ่านทะเบียนบนเชน การมอบสิทธิ์จะมีผลเมื่อเริ่ม epoch หลังจากมีการเผยแพร่ให้เครือข่ายรับรู้

4.3 การเสนอและเปิดใช้งานโซน  
การเสนอสร้างโซนใหม่จะทำบนเชน พร้อมระยะเวลาบังคับให้ validator เตรียมโครงสร้างพื้นฐาน ความปลอดภัย เครือข่าย และขั้นตอนการกู้คืน หลังจากครบกำหนดเวลาแล้วจึงจะสามารถเลือกโซนผ่านการโหวตปกติ

4.4 กระบวนการโหวตเลือกโซน  
Validator โหวตเลือกโซนและเวลาบล็อกเป้าหมายในอนาคตด้วยกุญแจระดับโลกที่ถ่วงน้ำหนักตามสัดส่วน stake หากได้คะแนนเกินสองในสามจะเป็นมติ หากไม่ถึงเครือข่ายจะใช้ฉันทามติระดับโลกสำหรับ epoch ถัดไป หน้าต่างเวลานี้เปิดโอกาสให้เตรียมโครงสร้างพื้นฐานและเตรียมกุญแจ

4.5 โหมดฉันทามติระดับโลก  
เป็นโหมด fallback เพื่อความปลอดภัย โดยมีพารามิเตอร์แบบระมัดระวัง (เช่น เวลาบล็อก 400ms และขนาดบล็อกลดลง) ถูกเรียกใช้เมื่อการเลือกโซนล้มเหลวหรือเกิดปัญหาการยืนยันกลาง epoch และจะคงอยู่จนถึง epoch ถัดไป

5. ชุดตัวตรวจสอบ (Validator Set)  
Fogo ใช้ชุด validator ที่คัดเลือกอย่างพิถีพิถันเพื่อให้ถึงขีดจำกัดทางกายภาพและลดการเอาเปรียบ MEV ช่วงแรกใช้ proof-of-authority แล้วค่อยเปลี่ยนไปใช้การอนุญาตโดยตรงจาก validator

5.1 ขนาดและการตั้งค่าเริ่มต้น  
ชุด validator มีขีดจำกัดตามโปรโตคอล โดยเป้าหมายเริ่มต้นอยู่ที่ 20–50 ตัวตรวจสอบ อำนาจเริ่มต้น (genesis authority) จะคัดเลือกชุดแรกและมีสิทธิ์จัดการชั่วคราว

5.2 การกำกับดูแลและการเปลี่ยนผ่าน  
การควบคุมจะส่งต่อไปยังชุด validator การเปลี่ยนสมาชิกต้องใช้เสียงเห็นชอบสองในสาม และมีการจำกัดอัตราการเปลี่ยนเพื่อรักษาเสถียรภาพ

5.3 ข้อกำหนดการเข้าร่วม  
Validator ต้องมี stake ขั้นต่ำและได้รับอนุมัติจากชุดเพื่อยืนยันความสามารถและความสอดคล้อง

5.4 เหตุผลและการกำกับดูแลเครือข่าย  
กลไกนี้เป็นการบังคับใช้พฤติกรรมที่เป็นประโยชน์อย่างเป็นทางการโดยไม่ลดการกระจายศูนย์อย่างมีนัยสำคัญ เนื่องจาก PoS supermajority สามารถ fork ได้อยู่แล้ว และยังช่วยให้ตอบสนองต่อปัญหาประสิทธิภาพถาวร MEV ที่เป็นอันตราย การไม่ส่งต่อบล็อก Turbine และพฤติกรรมที่เป็นอันตรายอื่น ๆ

6. การขยายในอนาคต  
การขยายที่พิจารณาอยู่จะยังคงความเข้ากันได้กับ Solana

6.1 การจ่ายค่าธรรมเนียมด้วยโทเคน SPL  
ธุรกรรมประเภท fee_payer_unsigned ร่วมกับโปรแกรมค่าธรรมเนียมบนเชน จะเปิดให้จ่ายค่าธรรมเนียมด้วยโทเคน SPL ผ่านตลาด relayer แบบ permissionless โดยต้องเปลี่ยนแปลงโปรโตคอลเพียงเล็กน้อย

7. สรุป  
Fogo ผสานไคลเอนต์ประสิทธิภาพสูงกับกลไก multi-local consensus แบบไดนามิก และชุด validator ที่คัดเลือกมาเพื่อให้ได้ประสิทธิภาพสูงสุดโดยไม่กระทบความปลอดภัยของ PoS การย้ายตำแหน่งแบบไดนามิกสร้างทั้งประสิทธิภาพและความทนทาน พร้อม fallback ที่แข็งแกร่ง และแรงจูงใจที่สอดคล้องกันผ่านกลไกทางเศรษฐศาสตร์
`
const KOREAN_TEXT = `
버전 1.0

초록  
본 논문은 처리량, 지연 시간, 혼잡 관리 측면에서 획기적인 성능을 제공하는 새로운 레이어 1 블록체인 프로토콜인 Fogo를 소개한다. Solana 프로토콜의 확장으로서, Fogo는 SVM 실행 계층에서 완전한 호환성을 유지하여 기존 Solana 프로그램, 도구, 인프라를 성능 저하 없이 원활하게 이전할 수 있도록 하며, 동시에 훨씬 더 높은 성능과 낮은 지연 시간을 달성한다.  
Fogo는 세 가지 혁신을 도입한다:  
• 순수 Firedancer 기반의 단일화된 클라이언트 구현을 통해 느린 클라이언트를 사용하는 네트워크(심지어 Solana 자체 포함)가 도달할 수 없는 수준의 성능을 실현.  
• 동적 코로케이션을 적용한 멀티 로컬 합의로, 주요 블록체인 중 최단 블록 타임과 지연 시간을 달성.  
• 검증인 수준에서의 고성능을 유도하고 포식적 행위를 억제하는 큐레이션된 검증인 집합.  

이러한 혁신들은 레이어 1 블록체인에 필수적인 탈중앙성과 안정성을 유지하면서도 상당한 성능 향상을 제공한다.  

1. 서론  
블록체인 네트워크는 성능과 탈중앙성, 보안의 균형을 유지하는 지속적인 과제에 직면해 있다. 현재의 블록체인들은 전 세계 금융 활동에 적합하지 않을 정도의 심각한 처리량 한계를 가지고 있다. 이더리움은 기본 계층에서 초당 50건 미만의 거래(TPS)를 처리하며, 가장 중앙화된 레이어 2조차 초당 1,000건 미만을 처리한다. Solana는 더 높은 성능을 목표로 설계되었지만, 클라이언트 다양성에서 오는 제약으로 인해 약 5,000 TPS에서 혼잡이 발생한다. 반면, NASDAQ, CME, Eurex와 같은 전통 금융 시스템은 초당 100,000건 이상의 작업을 처리한다.  

지연 시간 또한 분산형 블록체인 프로토콜의 또 다른 중요한 제약 요소다. 특히 변동성이 큰 자산의 가격 발견에서 저지연은 시장 품질과 유동성에 필수적이다. 전통 금융 시장 참여자들은 밀리초 또는 서브 밀리초 단위의 종단 간 지연 시간으로 운영한다. 이는 빛의 속도 한계로 인해 시장 참여자가 실행 환경과 물리적으로 함께 위치(co-location)할 때만 가능하다.  

전통적인 블록체인 아키텍처는 지리적 인식을 고려하지 않는 전 세계적으로 분산된 검증인 집합을 사용하며, 이는 근본적인 성능 한계를 만든다. 빛조차 지구 적도를 한 바퀴 도는 데 이상적인 상황에서 130ms 이상이 소요되며, 실제 네트워크 경로는 더 긴 거리와 인프라 지연을 포함한다. 이러한 물리적 한계는 합의가 검증인 간 다중 통신 라운드를 요구할 때 복합적으로 작용한다. 그 결과, 네트워크는 안정성을 위해 보수적인 블록 타임과 최종성 지연을 구현해야 한다. 최적의 조건에서도 전 세계 분산 합의 메커니즘은 이러한 네트워크 지연의 물리적 한계를 극복할 수 없다.  

블록체인이 전 세계 금융 시스템과 더 깊이 통합될수록, 사용자는 오늘날 중앙화 시스템에 버금가는 성능을 요구하게 될 것이다. 신중한 설계 없이 이러한 요구를 충족하려 하면 블록체인 네트워크의 탈중앙성과 회복력을 크게 훼손할 수 있다. 이를 해결하기 위해, 우리는 Fogo 레이어 1 블록체인을 제안한다. Fogo의 핵심 철학은 두 가지 접근을 통해 처리량을 극대화하고 지연 시간을 최소화하는 것이다. 첫째, 최적의 탈중앙성을 갖춘 검증인 집합에서 가장 성능이 뛰어난 클라이언트 소프트웨어를 사용하는 것, 둘째, 전 세계 합의의 대부분의 장점을 유지하면서 코로케이트된 합의를 수용하는 것이다.  

2. 개요  
본 논문은 Fogo의 주요 설계 결정을 다루는 섹션으로 구성된다.  
- 3장은 Fogo와 Solana 블록체인 프로토콜과의 관계, 그리고 클라이언트 최적화와 다양성에 대한 전략을 다룬다.  
- 4장은 멀티 로컬 합의, 그 실질적 구현, 전 세계 합의 또는 로컬 합의 대비 트레이드오프를 다룬다.  
- 5장은 Fogo의 검증인 집합 초기화 및 유지 방식에 대해 다룬다.  
- 6장은 제네시스 이후 도입될 수 있는 잠재적 확장 기능을 다룬다.  

3. 프로토콜과 클라이언트  
기본적으로 Fogo는 현재까지 가장 널리 사용되는 고성능 블록체인 프로토콜인 Solana 위에 구축된다. Solana 네트워크는 이미 프로토콜 설계와 클라이언트 구현 모두에서 수많은 최적화 솔루션을 갖추고 있다. Fogo는 SVM 실행 계층에서 완전한 호환성과 TowerBFT 합의, Turbine 블록 전파, Solana 리더 로테이션 및 기타 주요 네트워킹·합의 구성 요소와의 긴밀한 호환성을 포함해 Solana와 최대한의 역호환성을 목표로 한다. 이를 통해 Fogo는 Solana 생태계의 기존 프로그램, 도구, 인프라를 쉽게 통합·배포할 수 있으며 Solana의 지속적인 업스트림 개선 혜택을 누릴 수 있다.  

그러나 Solana와 달리, Fogo는 단일 표준(정식) 클라이언트를 실행한다. 이 표준 클라이언트는 Solana에서 실행되는 주요 클라이언트 중 가장 높은 성능을 갖춘 것이다. 이를 통해 Fogo는 항상 가장 빠른 클라이언트 속도로 네트워크가 운영되기 때문에 훨씬 더 높은 성능을 달성할 수 있다. 반면 Solana는 클라이언트 다양성으로 인해 항상 가장 느린 클라이언트의 속도에 병목이 걸린다. 당분간 그리고 예측 가능한 미래에는 이 표준 클라이언트가 Firedancer 스택을 기반으로 할 것이다.  

3.1 Firedancer  
Firedancer는 Jump Crypto가 개발한 고성능 Solana 호환 클라이언트 구현으로, 최적화된 병렬 처리, 메모리 관리, SIMD 명령어를 통해 현재의 검증인 클라이언트보다 훨씬 높은 거래 처리량을 보여준다.  
두 가지 버전이 존재한다: Firedancer의 처리 엔진과 Rust 검증인 네트워킹 스택을 결합한 하이브리드인 "Frankendancer", 그리고 완전한 C 네트워킹 스택을 재작성한 풀 Firedancer 구현으로 현재 개발 막바지 단계에 있다.  
두 버전 모두 Solana 프로토콜 호환성을 유지하면서 성능을 극대화한다. 완전한 Firedancer 구현이 완료되면 새로운 성능 기준을 세울 것으로 예상되며, 이는 Fogo의 고처리량 요구에 이상적이다. Fogo는 Frankendancer 기반 네트워크로 시작한 뒤 순수 Firedancer로 점진적으로 전환할 것이다.  

3.2 표준 클라이언트 vs. 클라이언트 다양성  
블록체인 프로토콜은 네트워크 규칙과 명세를 구현하는 클라이언트 소프트웨어를 통해 운영된다. 프로토콜이 네트워크 운영 규칙을 정의하면, 클라이언트는 이를 실행 가능한 소프트웨어로 변환한다. 클라이언트 다양성은 전통적으로 중복성, 규칙의 독립적 검증, 네트워크 전체 소프트웨어 취약성 위험 감소 등 여러 목적을 가진다. 비트코인의 경우 Bitcoin Core가 사실상 표준 클라이언트 역할을 하면서도 대안이 존재하는 선례가 있다.  

그러나 물리적 하드웨어 한계에 가까운 고성능 네트워크에서는 구현 다양성의 폭이 줄어든다. 최적의 구현은 유사한 해법으로 수렴하며, 다른 접근은 성능을 비현실적인 수준으로 떨어뜨린다. 다양성의 이점은 클라이언트 간 호환성 유지 오버헤드가 병목이 될수록 줄어든다.  

3.3 고성능 클라이언트를 위한 프로토콜 인센티브  
Fogo는 규격에 맞는 모든 클라이언트를 허용하지만, 아키텍처상 가장 빠른 클라이언트를 사용하도록 유인한다. 코로케이션 환경에서는 네트워크 지연이 최소화되므로 검증인 성능은 클라이언트 효율성에 의해 결정된다. 동적 블록 파라미터는 처리량 극대화를 위한 경제적 압박을 만든다. 느린 클라이언트는 블록을 놓치거나 보수적으로 투표해야 하며, 이는 수익 감소로 이어진다. 이는 강제하지 않아도 자연스럽게 가장 효율적인 구현을 선택하게 한다.  

4. 멀티 로컬 합의  
멀티 로컬 합의는 검증인 코로케이션 성능과 지리적 분산 보안을 동적으로 균형 잡는다. 검증인들은 각 구역(zone)별로 구분된 암호학적 신원을 유지하면서도 에포크마다 물리적 위치를 조율하여, 평시에는 초저지연 합의를 달성하고 필요 시 전 세계 합의로 폴백한다.  
이 모델은 전통 시장의 "follow the sun" 패턴에서 영감을 받았다. 아시아, 유럽, 북미로 유동성이 이동하며 연속 운영과 집중 유동성을 균형 있게 유지하는 방식이다.  

4.1 구역과 구역 회전  
구역(zone)은 지연 시간이 하드웨어 한계에 근접하는 지리적 영역(이상적으로 단일 데이터센터)이다. 필요 시 확장 가능하다. 회전을 통해 관할권 분산, 인프라 회복력, 전략적 성능 최적화(예: 가격 민감 정보 근처 배치)를 제공한다.  

4.2 키 관리  
2계층 시스템은 글로벌 검증인 ID와 구역별 참여를 분리한다. 검증인은 고급 작업을 위한 글로벌 키를 보유하고, 온체인 레지스트리를 통해 구역 키에 위임한다. 위임은 네트워크 전체에 표시된 후 에포크 경계에서 활성화된다.  

4.3 구역 제안과 활성화  
신규 구역은 온체인에서 제안되며, 검증인이 인프라·보안·네트워킹·복구 절차를 준비할 수 있는 의무 지연 기간을 거친다. 지연 후 정규 투표를 통해 선택 가능하다.  

4.4 구역 선택 투표 절차  
검증인은 글로벌 키를 사용해 향후 구역과 목표 블록 타임에 대해 지분 가중 투표를 한다. 초다수(supermajority)가 정족수를 형성하면 채택되고, 그렇지 않으면 다음 에포크에는 전 세계 합의가 기본값이 된다. 준비 및 키 활성화 기간을 제공한다.  

4.5 글로벌 합의 모드  
보수적 파라미터(예: 400ms 블록 타임, 블록 크기 축소)를 가진 폴백 및 안전 모드다. 구역 선택 실패나 런타임 최종성 실패 시 트리거되며, 한 번 트리거되면 해당 에포크가 끝날 때까지 유지된다.  

5. 검증인 집합  
Fogo는 물리적 성능 한계 도달 및 악의적 MEV 완화를 위해 큐레이션된 검증인 집합을 사용한다. 초기에는 권한증명(PoA) 기반이며, 이후 검증인 주도 권한 부여 방식으로 전환된다.  

5.1 규모 및 초기 구성  
검증인 집합은 프로토콜 한도를 가지며, 초기 목표는 20~50명이다. 제네시스 권한자가 초기 집합을 선정하고 일시적 관리 권한을 가진다.  

5.2 거버넌스 및 전환  
제어권은 검증인 집합으로 이전되며, 구성원 변경은 3분의 2 초다수 동의가 필요하다. 안정성을 위해 교체율은 제한된다.  

5.3 참여 요건  
검증인은 최소 위임 지분을 충족해야 하며, 능력과 목표 일치성을 보장하기 위해 집합 승인을 받아야 한다.  

5.4 근거 및 네트워크 거버넌스  
이는 PoS 초다수가 이미 포크를 수행할 수 있는 상황에서 탈중앙성을 실질적으로 줄이지 않으면서 유익한 행위를 강제하는 메커니즘을 공식화한다. Turbine 블록 전달 실패, 지속적인 성능 문제, 악의적 MEV 등 해로운 행위에 대응할 수 있다.  

6. 잠재적 확장  
제안된 확장은 Solana 호환성을 유지한다.  

6.1 SPL 토큰 수수료 지불  
fee_payer_unsigned 거래 유형과 온체인 수수료 프로그램을 통해 SPL 토큰으로 수수료를 지불할 수 있도록 하며, 이는 허가 없는 릴레이어 마켓플레이스를 통해 처리된다. 최소한의 프로토콜 변경만 필요하다.  

7. 결론  
Fogo는 고성능 클라이언트 구현, 동적 멀티 로컬 합의, 큐레이션된 검증인 집합을 결합하여 핵심 PoS 보안을 훼손하지 않으면서 전례 없는 성능을 달성한다. 동적 재배치는 강력한 폴백과 함께 성능과 회복력을 제공하며, 인센티브는 경제 메커니즘을 통해 자연스럽게 정렬된다.
`
const FILIPINO_TEXT = `
Bersyon 1.0

Abstrak
Ang papel na ito ay nagpapakilala sa Fogo, isang makabagong layer 1 blockchain protocol na naghahatid ng pambihirang pagganap sa throughput, latency, at pamamahala ng congestion. Bilang ekstensyon ng Solana protocol, pinapanatili ng Fogo ang buong pagiging tugma sa SVM execution layer, na nagbibigay-daan sa kasalukuyang mga Solana program, tooling, at imprastruktura na lumipat nang walang aberya habang nakakamit ng mas mataas na pagganap at mas mababang latency.
Nag-aambag ang Fogo ng tatlong makabagong inobasyon:
• Isang pinag-isang client implementation na batay sa purong Firedancer, na nagbubukas ng antas ng pagganap na hindi kayang maabot ng mga network na may mas mabagal na kliyente—kabilang na ang mismong Solana.
• Multi-local consensus na may dynamic colocation, na nakakamit ng mga oras ng block at latency na mas mababa kaysa sa anumang pangunahing blockchain.
• Isang piniling validator set na nagbibigay-insentibo sa mataas na pagganap at pumipigil sa mapanirang asal sa antas ng validator.
Ang mga inobasyong ito ay naghahatid ng malaking pagtaas sa pagganap habang pinapanatili ang desentralisasyon at tibay na mahalaga sa isang layer 1 blockchain.

1. Panimula
Nahaharap ang mga blockchain network sa patuloy na hamon ng pagbabalanse sa pagitan ng pagganap, desentralisasyon, at seguridad. Ang mga blockchain ngayon ay may malubhang limitasyon sa throughput na ginagawa silang hindi angkop para sa pandaigdigang aktibidad sa pananalapi. Ang Ethereum ay nagpoproseso ng mas mababa sa 50 transaksyon kada segundo (TPS) sa base layer nito. Kahit ang pinaka-sentralisadong layer 2 ay may mas mababa sa 1,000 TPS. Habang ang Solana ay idinisenyo para sa mas mataas na pagganap, ang mga limitasyon mula sa pagkakaiba-iba ng kliyente ay kasalukuyang nagdudulot ng congestion sa 5,000 TPS. Sa kabilang banda, ang mga tradisyunal na sistemang pampinansyal tulad ng NASDAQ, CME, at Eurex ay regular na nagpoproseso ng higit sa 100,000 operasyon bawat segundo.
Ang latency ay isa pang kritikal na limitasyon para sa mga desentralisadong blockchain protocol. Sa mga pamilihang pampinansyal—lalo na sa pagtuklas ng presyo sa mga pabagu-bagong asset—mahalaga ang mababang latency para sa kalidad at likididad ng merkado. Ang mga tradisyunal na kalahok sa merkado ay gumagana sa end-to-end latencies na nasa millisecond o sub-millisecond. Ang mga bilis na ito ay posible lamang kapag ang mga kalahok ay maaaring mag-co-locate sa execution environment dahil sa limitasyon ng bilis ng liwanag.
Ang mga tradisyunal na arkitektura ng blockchain ay gumagamit ng pandaigdigang ipinamamahaging validator sets na gumagana nang walang kamalayan sa heograpiya, na lumilikha ng mga pangunahing limitasyon sa pagganap. Ang liwanag mismo ay nangangailangan ng higit sa 130 millisecond upang umikot sa mundo sa ekwador, kahit na sa isang perpektong bilog—at ang mga totoong ruta ng network ay may dagdag na distansya at pagkaantala mula sa imprastruktura. Ang mga limitasyong pisikal na ito ay mas lumalala kapag nangangailangan ng maraming communication rounds sa pagitan ng mga validator para sa consensus. Bilang resulta, dapat magpatupad ang mga network ng konserbatibong oras ng block at pagkaantala sa finality upang mapanatili ang katatagan. Kahit sa pinakamainam na kondisyon, ang isang pandaigdigang ipinamamahaging mekanismo ng consensus ay hindi kayang lampasan ang mga pangunahing pagkaantalang ito sa networking.
Habang higit na nagsasama ang mga blockchain sa pandaigdigang sistemang pampinansyal, hihilingin ng mga gumagamit ang pagganap na maihahambing sa mga kasalukuyang sentralisadong sistema. Kung walang maingat na disenyo, ang pagtugon sa mga kahilingang ito ay maaaring makompromiso ang desentralisasyon at katatagan ng mga blockchain network. Upang tugunan ang hamong ito, iminungkahi namin ang Fogo layer one blockchain. Ang pangunahing pilosopiya ng Fogo ay i-maximize ang throughput at i-minimize ang latency sa pamamagitan ng dalawang pangunahing paraan: una, paggamit ng pinaka-performant na software client sa isang optimal na desentralisadong validator set; at pangalawa, pagtanggap ng co-located consensus habang pinapanatili ang karamihan sa benepisyo ng desentralisadong global consensus.

2. Balangkas
Ang papel ay hinati sa mga seksyon na tumatalakay sa mga pangunahing desisyon sa disenyo ng Fogo. Ang Seksyon 3 ay tumatalakay sa relasyon ng Fogo sa Solana blockchain protocol at ang estratehiya nito kaugnay sa pag-optimize at diversity ng kliyente. Ang Seksyon 4 ay tumatalakay sa multi-local consensus, ang praktikal na implementasyon nito, at ang mga kompromisong ginagawa nito kumpara sa global o lokal na consensus. Ang Seksyon 5 ay tumatalakay sa paraan ng Fogo sa pag-inisyalisa at pagpapanatili ng validator set. Ang Seksyon 6 ay tumatalakay sa mga inaasahang ekstensyon na maaaring ipakilala pagkatapos ng genesis.

3. Protocol at Mga Kliyente
Sa base layer, nagsisimula ang Fogo sa pamamagitan ng pagbuo sa pinaka-performant at malawak na ginagamit na blockchain protocol hanggang ngayon—ang Solana. Mayroon nang maraming solusyon sa pag-optimize ang Solana network, parehong sa disenyo ng protocol at sa mga client implementation. Target ng Fogo ang pinakamataas na posibleng backward compatibility sa Solana, kabilang ang buong pagiging tugma sa SVM execution layer at malapit na pagiging tugma sa TowerBFT consensus, Turbine block propagation, Solana leader rotation at lahat ng iba pang pangunahing bahagi ng networking at consensus layers. Ang pagiging tugmang ito ay nagbibigay-daan sa Fogo na madaling mag-integrate at mag-deploy ng kasalukuyang mga programa, tooling, at imprastruktura mula sa ekosistemang Solana; pati na rin makinabang sa patuloy na mga pagpapabuti mula sa upstream ng Solana.
Gayunpaman, hindi tulad ng Solana, tatakbo ang Fogo gamit ang isang canonical client lamang. Ang canonical client na ito ang magiging pinakamataas ang pagganap sa mga pangunahing client na tumatakbo sa Solana. Dahil dito, nakakamit ng Fogo ang mas mataas na pagganap dahil palaging tatakbo ang network sa bilis ng pinakamabilis na client. Samantalang ang Solana, na limitado ng diversity ng client, ay palaging mababagal ng pinakamahinang client. Sa ngayon at sa nakikitang hinaharap, ang canonical client na ito ay ibabatay sa Firedancer stack.

3.1 Firedancer
Ang Firedancer ay ang high-performance na Solana-compatible client implementation ng Jump Crypto, na nagpapakita ng mas mataas na transaction processing throughput kaysa sa kasalukuyang mga validator client sa pamamagitan ng optimized parallel processing, memory management, at SIMD instructions.
May dalawang bersyon: "Frankendancer," isang hybrid na gumagamit ng Firedancer processing engine na may Rust validator networking stack, at ang full Firedancer implementation na may kumpletong C networking stack rewrite, na kasalukuyang nasa huling yugto ng development.
Parehong bersyon ay nagpapanatili ng pagiging tugma sa Solana protocol habang pinu-push ang maximum na pagganap. Kapag natapos, inaasahan na ang purong Firedancer implementation ay magtatakda ng bagong benchmark sa performance, kaya’t perpekto ito para sa high-throughput na pangangailangan ng Fogo. Magsisimula ang Fogo gamit ang Frankendancer-based network at kalaunan ay lilipat sa purong Firedancer.

3.2 Canonical Clients vs. Client Diversity
Ang mga blockchain protocol ay nagpapatakbo sa pamamagitan ng client software na nagpapatupad ng kanilang mga patakaran at espesipikasyon. Habang tinutukoy ng protocol ang mga patakaran ng pagpapatakbo ng network, isinasalin naman ng mga client ang mga espesipikasyong ito sa executable software. Karaniwang nagsisilbi ang diversity ng client para sa maraming layunin: redundancy, independiyenteng beripikasyon ng mga patakaran, at pagbawas sa panganib ng malawakang software vulnerabilities sa buong network. Ipinapakita ng Bitcoin ang precedent kung saan ang Bitcoin Core ay nagsisilbing de facto canonical client kahit may mga alternatibo.
Gayunpaman, sa mga high-performance network na malapit na sa pisikal na limitasyon ng hardware, lumiit ang espasyo para sa pagkakaiba-iba ng implementasyon. Ang optimal na implementasyon ay nagko-converge sa magkatulad na solusyon; ang mga paglihis ay nagpapababa sa performance sa hindi katanggap-tanggap na antas. Bumababa ang benepisyo ng diversity habang ang compatibility overhead sa pagitan ng client ay nagiging bottleneck.

3.3 Mga Insentibo ng Protocol para sa Performant na Kliyente
Pinapayagan ng Fogo ang anumang conforming client, ngunit hinihikayat ng arkitektura nito ang paggamit ng pinakamabilis na kliyente. Sa co-located settings, minimal ang latency ng network, kaya’t ang kahusayan ng kliyente ang tumutukoy sa performance ng validator. Ang dynamic block parameters ay lumilikha ng ekonomikong presyon upang i-maximize ang throughput; ang mas mabagal na kliyente ay nawawalan ng mga block o kailangang mag-vote nang konserbatibo, na nagpapababa sa kita. Natural na pinipili nito ang pinaka-episyenteng implementasyon nang walang matigas na pagpapatupad ng protocol.

4. Multi-Local Consensus
Ang multi-local consensus ay dynamic na binabalanse ang pagganap ng co-location ng validator at ang seguridad ng heograpikong distribusyon. Nagkokordina ang mga validator ng pisikal na lokasyon sa bawat epoch habang pinapanatili ang magkakaibang cryptographic identity para sa mga zone, na nakakamit ng ultra-low latency consensus sa normal na operasyon na may fallback sa global consensus kung kinakailangan.
Ang modelo ay humuhugot ng inspirasyon mula sa "follow the sun" na pattern sa tradisyunal na merkado, kung saan ang likididad ay gumagalaw sa pagitan ng Asia, Europe, at North America upang balansehin ang tuloy-tuloy na operasyon at konsentradong likididad.

4.1 Mga Zone at Zone Rotation
Ang zone ay isang heograpikong lugar—mainam na isang data center—kung saan ang latency ay malapit sa limitasyon ng hardware. Maaaring palawakin ang mga zone kung kinakailangan. Ang rotation ay nagbibigay ng hurisdiksiyonal na desentralisasyon, tibay ng imprastruktura, at estratehikong pag-optimize ng pagganap (hal., paglalagay malapit sa mga pinagmumulan ng sensitibong impormasyon sa presyo).

4.2 Pamamahala ng Susi
Isang two-tier system ang naghihiwalay sa global validator identity mula sa zone-specific participation. Pinapanatili ng mga validator ang global key para sa high-level na aksyon at nagde-delegate sa mga zone key sa pamamagitan ng on-chain registry. Ang mga delegasyon ay nag-a-activate sa epoch boundaries pagkatapos ng network-wide visibility.

4.3 Panukala at Pag-activate ng Zone
Ang mga bagong zone ay ipinanukala on-chain na may mandatory delay para makapaghanda ang mga validator ng imprastruktura, seguridad, networking, at mga recovery procedure. Pagkatapos lamang ng delay maaaring piliin ang isang zone sa pamamagitan ng regular na pagboto.

4.4 Proseso ng Pagboto sa Zone Selection
Bumoboto ang mga validator sa mga susunod na zone at target block times gamit ang stake-weighted global keys. Isang supermajority ang nagtatatag ng quorum; kung hindi, ang network ay default sa global consensus para sa susunod na epoch. Ang window ay nagbibigay ng oras para sa paghahanda ng imprastruktura at pag-init ng susi.

4.5 Global Consensus Mode
Isang fallback at safety mode na may konserbatibong parameter (hal., 400ms block time, nabawasang block size). Na-a-activate kapag nabigo ang zone selection o nagkaroon ng finality failure sa runtime; kapag na-trigger sa gitna ng epoch, nananatili ito hanggang sa susunod na epoch.

5. Validator Set
Gumagamit ang Fogo ng piniling validator set upang maabot ang pisikal na limitasyon ng pagganap at mabawasan ang mapanirang MEV. Sa simula ay proof-of-authority, lilipat sa validator-direct permissioning.

5.1 Laki at Inisyal na Konfigurasyon
May protocol bounds ang validator set; inisyal na target ang 20–50 validator. Isang genesis authority ang pipili ng inisyal na set na may pansamantalang kapangyarihang pamamahala.

5.2 Pamamahala at Transisyon
Lilipas ang kontrol sa validator set; ang pagbabago ng miyembro ay mangangailangan ng two-thirds supermajority. Limitado ang turnover rate upang mapanatili ang katatagan.

5.3 Mga Kinakailangan sa Partisipasyon
Dapat matugunan ng mga validator ang minimum delegated stake at makakuha ng set approval upang matiyak ang kakayahan at pagkakahanay.

5.4 Rasyonal at Pamamahala ng Network
Pormal nitong ipinapatupad ang mabuting asal nang hindi lubos na binabawasan ang desentralisasyon, dahil ang anumang PoS supermajority ay maaaring mag-fork. Pinapahintulutan nito ang pagtugon sa patuloy na isyu sa pagganap, mapanirang MEV, pagkabigong magpasa ng Turbine blocks, at iba pang mapaminsalang asal.

6. Mga Inaasahang Ekstensyon
Ang mga ekstensyong isasaalang-alang ay nagpapanatili ng pagiging tugma sa Solana.

6.1 Pagbabayad ng Bayad gamit ang SPL Token
Isang fee_payer_unsigned transaction type kasama ang isang on-chain fee program ang magpapahintulot sa pagbabayad ng fees gamit ang SPL tokens sa pamamagitan ng permissionless relayer marketplace, na nangangailangan ng minimal na pagbabago sa protocol.

7. Konklusyon
Pinagsasama ng Fogo ang high-performance na client implementation sa dynamic multi-local consensus at piniling validator set upang makamit ang walang kapantay na pagganap nang hindi sinasakripisyo ang core PoS security. Nagbibigay ang dynamic relocation ng pagganap at tibay na may matatag na fallback; natural na naaayon ang mga insentibo sa pamamagitan ng ekonomiya.
`
const UKRAINIAN_TEXT = `
Version 1.0

Анотація
У цій роботі представлено Fogo — новий протокол блокчейну рівня 1, що забезпечує проривну продуктивність за пропускною здатністю, затримкою та управлінням перевантаженнями. Як розширення протоколу Solana, Fogo зберігає повну сумісність на рівні виконання SVM, що дозволяє існуючим програмам, інструментам та інфраструктурі Solana безперешкодно мігрувати, досягаючи значно вищої продуктивності та нижчої затримки.
Fogo пропонує три ключові інновації:
• Уніфікований клієнт, реалізований на основі чистого Firedancer, який забезпечує рівні продуктивності, недосяжні для мереж із повільнішими клієнтами — включно із самою Solana.
• Багатомісний консенсус із динамічним розміщенням, що забезпечує час створення блоків та затримки значно нижчі, ніж у будь-якого великого блокчейну.
• Кураторський набір валідаторів, який стимулює високу продуктивність і запобігає хижацькій поведінці на рівні валідаторів.
Ці інновації забезпечують суттєве зростання продуктивності, зберігаючи децентралізацію та надійність, що є критично важливими для блокчейну рівня 1.

1. Вступ
Блокчейн-мережі постійно стикаються з викликом балансування продуктивності з децентралізацією та безпекою. Сучасні блокчейни мають суттєві обмеження пропускної здатності, що робить їх непридатними для глобальної фінансової діяльності. Ethereum обробляє менше ніж 50 транзакцій на секунду (TPS) на базовому рівні. Навіть найбільш централізовані рішення рівня 2 обробляють менше ніж 1 000 TPS. Хоча Solana створювалася для високої продуктивності, обмеження через різноманітність клієнтів зараз призводять до перевантажень уже на рівні 5 000 TPS. Для порівняння, традиційні фінансові системи, такі як NASDAQ, CME та Eurex, регулярно обробляють понад 100 000 операцій на секунду.
Затримка є ще одним критичним обмеженням для децентралізованих блокчейн-протоколів. У фінансових ринках — особливо для визначення ціни на волатильні активи — низька затримка є необхідною для якості ринку та ліквідності. Традиційні учасники ринку працюють із наскрізними затримками на рівні мілісекунд або навіть субмілісекунд. Такі швидкості можливі лише тоді, коли учасники ринку можуть розміщуватися поруч із середовищем виконання через обмеження, пов’язані зі швидкістю світла.
Традиційні архітектури блокчейнів використовують глобально розподілені набори валідаторів, які функціонують без географічної прив’язки, створюючи фундаментальні обмеження продуктивності. Світлу потрібно понад 130 мілісекунд, щоб облетіти земну кулю по екватору навіть за ідеальної траєкторії, а реальні мережеві маршрути додають ще більшу відстань і затримки інфраструктури. Ці фізичні обмеження поглиблюються, коли консенсус вимагає кількох раундів обміну повідомленнями між валідаторами. Як наслідок, мережі змушені впроваджувати консервативний час блоків і затримки фіналізації для підтримання стабільності. Навіть за оптимальних умов глобальний механізм консенсусу не може подолати ці базові мережеві затримки.
У міру інтеграції блокчейнів у глобальну фінансову систему користувачі вимагатимуть продуктивності, співставної з сучасними централізованими системами. Без ретельного проєктування задоволення цих вимог може суттєво знизити децентралізацію та стійкість блокчейнів. Щоб вирішити цю проблему, ми пропонуємо блокчейн рівня один — Fogo. Основна філософія Fogo полягає у максимізації пропускної здатності та мінімізації затримки двома ключовими підходами: перший — використання найпродуктивнішого клієнтського ПЗ на оптимально децентралізованому наборі валідаторів; другий — впровадження консенсусу з розміщенням у дата-центрах при збереженні більшості переваг глобального консенсусу.

2. Структура
Стаття поділена на розділи, які охоплюють ключові дизайнерські рішення щодо Fogo. Розділ 3 описує взаємозв’язок Fogo з протоколом блокчейну Solana та його стратегію щодо оптимізації й різноманітності клієнтів. Розділ 4 описує багатомісний консенсус, його практичну реалізацію та компроміси порівняно з глобальним чи локальним консенсусом. Розділ 5 описує підхід Fogo до ініціалізації та підтримання набору валідаторів. Розділ 6 охоплює можливі розширення, які можуть бути впроваджені після запуску мережі.

3. Протокол і клієнти
На базовому рівні Fogo будується поверх найпродуктивнішого з широко використовуваних блокчейн-протоколів — Solana. Мережа Solana вже містить численні оптимізації як у дизайні протоколу, так і в реалізаціях клієнтів. Fogo прагне максимальної зворотної сумісності із Solana, включно з повною сумісністю на рівні виконання SVM і тісною сумісністю з консенсусом TowerBFT, поширенням блоків Turbine, ротацією лідерів Solana та всіма іншими ключовими компонентами мережевого та консенсусного рівнів. Ця сумісність дозволяє Fogo легко інтегрувати та розгортати наявні програми, інструменти та інфраструктуру з екосистеми Solana, а також отримувати користь від безперервних покращень Solana.
Однак, на відміну від Solana, Fogo працюватиме з одним канонічним клієнтом. Цей канонічний клієнт буде найпродуктивнішим серед основних клієнтів, що працюють на Solana. Це дає змогу Fogo досягати значно вищої продуктивності, адже мережа завжди працюватиме на швидкості найшвидшого клієнта. У той час як Solana, обмежена різноманітністю клієнтів, завжди буде стримуватись швидкістю найповільнішого клієнта. Наразі й у найближчому майбутньому цей канонічний клієнт буде базуватися на стеку Firedancer.

3.1 Firedancer
Firedancer — це високопродуктивна реалізація клієнта Solana від Jump Crypto, що демонструє значно вищу пропускну здатність обробки транзакцій, ніж поточні клієнти-валідатори, завдяки оптимізованій паралельній обробці, керуванню пам’яттю та використанню SIMD-інструкцій.
Існують дві версії: "Frankendancer" — гібрид, що використовує обчислювальний рушій Firedancer із мережевим стеком Rust-валідатора, та повна реалізація Firedancer із повністю переписаним мережевим стеком на C, яка зараз перебуває на фінальній стадії розробки.
Обидві версії зберігають сумісність із протоколом Solana та максимізують продуктивність. Після завершення чиста реалізація Firedancer, імовірно, встановить нові стандарти продуктивності, що робить її ідеальною для вимог високої пропускної здатності Fogo. Fogo почне з мережі на базі Frankendancer і згодом перейде на чистий Firedancer.

3.2 Канонічні клієнти проти різноманітності клієнтів
Блокчейн-протоколи працюють через клієнтське програмне забезпечення, яке реалізує їхні правила та специфікації. Хоча протоколи визначають правила роботи мережі, клієнти перетворюють ці специфікації на виконуване ПЗ. Різноманітність клієнтів традиційно виконує кілька функцій: резервування, незалежну перевірку правил і зменшення ризику вразливостей, що охоплюють усю мережу. Bitcoin демонструє прецедент, де Bitcoin Core фактично є канонічним клієнтом, навіть за наявності альтернатив.
Однак у високопродуктивних мережах, що працюють на межі фізичних можливостей обладнання, простір для різноманітності реалізацій скорочується. Оптимальні реалізації сходяться до подібних рішень; відхилення знижують продуктивність до неприйнятного рівня. Переваги різноманітності зменшуються, коли витрати на сумісність між клієнтами стають вузьким місцем.

3.3 Протокольні стимули для продуктивних клієнтів
Fogo дозволяє будь-який сумісний клієнт, але його архітектура стимулює використання найшвидшого. У середовищах із розташуванням у дата-центрах затримка мережі мінімальна, тому ефективність клієнта визначає продуктивність валідатора. Динамічні параметри блоків створюють економічний тиск на максимізацію пропускної здатності; повільніші клієнти або пропускають блоки, або повинні голосувати обережно, зменшуючи дохід. Це природно відбирає найефективнішу реалізацію без жорсткого протокольного примусу.

4. Багатомісний консенсус
Багатомісний консенсус динамічно поєднує продуктивність розміщення валідаторів у дата-центрах із безпекою географічного розподілу. Валідатори координують фізичні місця розташування між епохами, зберігаючи окремі криптографічні ідентичності для зон, що дозволяє досягати наднизької затримки в нормальному режимі та переходити на глобальний консенсус у разі потреби.
Модель надихається патерном "follow the sun" у традиційних ринках, де ліквідність переміщується між Азією, Європою та Північною Америкою для забезпечення безперервної роботи та концентрації ліквідності.

4.1 Зони та ротація зон
Зона — це географічна область, бажано один дата-центр, де затримка наближається до апаратних меж. Зони можуть розширюватися за потреби. Ротація забезпечує юрисдикційну децентралізацію, стійкість інфраструктури та стратегічну оптимізацію продуктивності (наприклад, розміщення поблизу джерел цінової інформації).

4.2 Управління ключами
Дворівнева система відокремлює глобальну ідентичність валідатора від участі в конкретній зоні. Валідатори зберігають глобальний ключ для високорівневих дій і делегують ключі зони через ончейн-реєстр. Делегування активується на межі епох після загальної видимості в мережі.

4.3 Пропозиція та активація зони
Нові зони пропонуються ончейн із обов’язковою затримкою для підготовки валідаторами інфраструктури, безпеки, мережі та процедур відновлення. Лише після цієї затримки зону можна обрати через регулярне голосування.

4.4 Процес голосування за вибір зони
Валідатори голосують за майбутні зони та цільовий час блоків, використовуючи глобальні ключі зі зваженням на частку стейку. Супербільшість формує кворум; інакше мережа переходить до глобального консенсусу в наступній епосі. Вікно дає час на підготовку інфраструктури та активацію ключів.

4.5 Режим глобального консенсусу
Режим резерву та безпеки з консервативними параметрами (наприклад, час блоку 400 мс, зменшений розмір блоку). Активується у разі невдалої вибірки зони або збою фіналізації під час роботи; після активації в середині епохи залишається до її завершення.

5. Набір валідаторів
Fogo використовує кураторський набір валідаторів, щоб досягти фізичних меж продуктивності та зменшити шкідливий MEV. Спочатку — proof-of-authority, з переходом на пряме дозволення валідаторами.

5.1 Розмір і початкова конфігурація
Набір валідаторів має протокольні обмеження; початкова ціль — 20–50 валідаторів. Орган генезису обирає початковий набір із тимчасовими повноваженнями управління.

5.2 Управління та переходи
Контроль переходить до набору валідаторів; зміни складу вимагають двох третин голосів. Частота змін обмежується для збереження стабільності.

5.3 Вимоги до участі
Валідатори повинні мати мінімальний делегований стейк і отримати схвалення набору, щоб підтвердити можливості та узгодженість.

5.4 Обґрунтування та управління мережею
Цей механізм формалізує забезпечення корисної поведінки без суттєвого зменшення децентралізації, оскільки будь-яка PoS-супербільшість уже може форкнути мережу. Це дозволяє реагувати на стійкі проблеми з продуктивністю, шкідливий MEV, відмову передавати блоки Turbine та інші шкідливі дії.

6. Можливі розширення
Розширення, що розглядаються, зберігають сумісність із Solana.

6.1 Оплата комісій токенами SPL
Тип транзакції fee_payer_unsigned у поєднанні з ончейн-програмою комісій дозволить оплачувати комісії токенами SPL через бездозвільний релейний маркетплейс, що вимагає мінімальних змін протоколу.

7. Висновок
Fogo поєднує високопродуктивну реалізацію клієнта з динамічним багатомісним консенсусом і кураторським набором валідаторів, щоб досягти безпрецедентної продуктивності без компромісів із безпекою PoS. Динамічне переміщення забезпечує продуктивність і стійкість із надійними резервними режимами; стимули природно узгоджуються через економічні механізми.
`
const PORTUGUESE_TEXT = `
Versão 1.0

Resumo
Este documento apresenta o Fogo, um novo protocolo blockchain de camada 1 que oferece um desempenho revolucionário em taxa de transferência, latência e gestão de congestionamento. Como uma extensão do protocolo Solana, o Fogo mantém total compatibilidade na camada de execução SVM, permitindo que programas, ferramentas e infraestrutura existentes da Solana migrem de forma contínua, ao mesmo tempo em que alcançam um desempenho significativamente maior e menor latência.
O Fogo traz três inovações inéditas:
• Uma implementação unificada de cliente baseada puramente no Firedancer, desbloqueando níveis de desempenho inalcançáveis por redes com clientes mais lentos — incluindo a própria Solana.
• Consenso multi-local com colocação dinâmica, atingindo tempos de bloco e latências muito inferiores aos de qualquer blockchain de grande porte.
• Um conjunto de validadores curado que incentiva alto desempenho e desencoraja comportamentos predatórios no nível do validador.
Essas inovações oferecem ganhos substanciais de desempenho, preservando a descentralização e a robustez essenciais para um blockchain de camada 1.

1. Introdução
As redes blockchain enfrentam um desafio contínuo em equilibrar desempenho com descentralização e segurança. As blockchains atuais sofrem com severas limitações de taxa de transferência que as tornam inadequadas para atividades financeiras globais. O Ethereum processa menos de 50 transações por segundo (TPS) em sua camada base. Mesmo as camadas 2 mais centralizadas processam menos de 1.000 TPS. Embora a Solana tenha sido projetada para maior desempenho, limitações decorrentes da diversidade de clientes atualmente causam congestionamento em 5.000 TPS. Em contraste, sistemas financeiros tradicionais como NASDAQ, CME e Eurex processam regularmente mais de 100.000 operações por segundo.
A latência apresenta outra limitação crítica para protocolos blockchain descentralizados. Nos mercados financeiros — especialmente na descoberta de preços de ativos voláteis — baixa latência é essencial para a qualidade e liquidez do mercado. Participantes de mercado tradicionais operam com latências fim a fim na escala de milissegundos ou sub-milissegundos. Essas velocidades só são alcançáveis quando os participantes podem se co-localizar com o ambiente de execução, devido às limitações impostas pela velocidade da luz.
Arquiteturas blockchain tradicionais utilizam conjuntos de validadores distribuídos globalmente que operam sem consciência geográfica, criando limitações fundamentais de desempenho. A própria luz leva mais de 130 milissegundos para dar a volta ao mundo no equador, mesmo viajando em um círculo perfeito — e caminhos de rede do mundo real envolvem distâncias adicionais e atrasos de infraestrutura. Essas limitações físicas se agravam quando o consenso exige múltiplas rodadas de comunicação entre validadores. Como resultado, as redes precisam implementar tempos de bloco conservadores e atrasos de finalização para manter a estabilidade. Mesmo nas melhores condições, um mecanismo de consenso distribuído globalmente não pode superar essas limitações básicas de rede.
À medida que as blockchains se integram ainda mais ao sistema financeiro global, os usuários exigirão desempenho comparável aos sistemas centralizados atuais. Sem um design cuidadoso, atender a essas demandas pode comprometer significativamente a descentralização e a resiliência das redes blockchain. Para enfrentar esse desafio, propomos o blockchain de camada um Fogo. A filosofia central do Fogo é maximizar a taxa de transferência e minimizar a latência por meio de duas abordagens principais: primeiro, usar o software cliente mais eficiente em um conjunto de validadores descentralizado de forma otimizada; e segundo, adotar o consenso co-localizado enquanto preserva a maior parte dos benefícios da descentralização do consenso global.

2. Estrutura
O documento está dividido em seções que cobrem as principais decisões de design do Fogo. A Seção 3 aborda a relação do Fogo com o protocolo blockchain Solana e sua estratégia em relação à otimização e diversidade de clientes. A Seção 4 trata do consenso multi-local, sua implementação prática e as compensações que faz em relação ao consenso global ou local. A Seção 5 cobre a abordagem do Fogo para inicializar e manter o conjunto de validadores. A Seção 6 aborda extensões potenciais que podem ser introduzidas após o gênese.

3. Protocolo e Clientes
Na camada base, o Fogo começa construindo sobre o protocolo blockchain mais eficiente e amplamente utilizado até hoje, o Solana. A rede Solana já conta com inúmeras soluções de otimização, tanto em termos de design de protocolo quanto de implementações de clientes. O Fogo busca a máxima compatibilidade retroativa possível com a Solana, incluindo compatibilidade total na camada de execução SVM e compatibilidade próxima com o consenso TowerBFT, propagação de blocos Turbine, rotação de líderes Solana e todos os outros principais componentes das camadas de rede e consenso. Essa compatibilidade permite que o Fogo integre e implemente facilmente programas, ferramentas e infraestrutura existentes do ecossistema Solana, além de se beneficiar de melhorias contínuas provenientes do desenvolvimento da Solana.
No entanto, ao contrário da Solana, o Fogo rodará com um único cliente canônico. Esse cliente canônico será o cliente de maior desempenho em execução na Solana. Isso permite que o Fogo alcance um desempenho significativamente superior, pois a rede sempre operará na velocidade do cliente mais rápido. Enquanto a Solana, limitada pela diversidade de clientes, sempre estará restrita pela velocidade do cliente mais lento. No presente e no futuro próximo, esse cliente canônico será baseado no stack Firedancer.

3.1 Firedancer
O Firedancer é a implementação de cliente de alto desempenho compatível com Solana desenvolvida pela Jump Crypto, apresentando uma taxa de processamento de transações substancialmente maior que os clientes validadores atuais, por meio de processamento paralelo otimizado, gerenciamento de memória e instruções SIMD.
Existem duas versões: "Frankendancer", um híbrido que utiliza o mecanismo de processamento do Firedancer com o stack de rede do validador em Rust, e a implementação completa do Firedancer, com uma reescrita total do stack de rede em C, atualmente em fase final de desenvolvimento.
Ambas as versões mantêm a compatibilidade com o protocolo Solana, maximizando o desempenho. Uma vez concluída, a implementação pura do Firedancer deverá estabelecer novos padrões de desempenho, tornando-se ideal para as exigências de alta taxa de transferência do Fogo. O Fogo começará com uma rede baseada no Frankendancer e, eventualmente, fará a transição para o Firedancer puro.

3.2 Clientes Canônicos vs. Diversidade de Clientes
Os protocolos blockchain operam por meio de softwares clientes que implementam suas regras e especificações. Enquanto os protocolos definem as regras de operação da rede, os clientes traduzem essas especificações em software executável. A diversidade de clientes tradicionalmente serve a múltiplos propósitos: redundância, verificação independente das regras e redução do risco de vulnerabilidades de software que afetem toda a rede. O Bitcoin mostra um precedente em que o Bitcoin Core serve como cliente canônico de fato, mesmo havendo alternativas.
No entanto, em redes de alto desempenho próximas aos limites físicos do hardware, o espaço para diversidade de implementação se contrai. Implementações ótimas convergem para soluções semelhantes; desvios reduzem o desempenho a níveis inviáveis. Os benefícios da diversidade diminuem à medida que a sobrecarga de compatibilidade entre clientes se torna um gargalo.

3.3 Incentivos do Protocolo para Clientes de Alto Desempenho
O Fogo permite qualquer cliente compatível, mas sua arquitetura incentiva o uso do cliente mais rápido. Em ambientes co-localizados, a latência de rede é mínima, portanto, a eficiência do cliente determina o desempenho do validador. Parâmetros dinâmicos de bloco criam pressão econômica para maximizar a taxa de transferência; clientes mais lentos perdem blocos ou precisam votar de forma conservadora, reduzindo a receita. Isso seleciona naturalmente a implementação mais eficiente sem imposição rígida pelo protocolo.

4. Consenso Multi-Local
O consenso multi-local equilibra dinamicamente o desempenho da co-localização de validadores com a segurança da distribuição geográfica. Os validadores coordenam localizações físicas entre épocas, mantendo identidades criptográficas distintas para zonas, alcançando consenso de latência ultrabaixa em operação normal, com fallback para consenso global quando necessário.
O modelo se inspira no padrão "follow the sun" dos mercados tradicionais, onde a liquidez se desloca entre Ásia, Europa e América do Norte para equilibrar operação contínua e liquidez concentrada.

4.1 Zonas e Rotação de Zonas
Uma zona é uma área geográfica — idealmente um único data center — onde a latência se aproxima dos limites do hardware. As zonas podem ser expandidas conforme necessário. A rotação proporciona descentralização jurisdicional, resiliência de infraestrutura e otimização estratégica de desempenho (por exemplo, localização próxima a fontes de informações sensíveis a preços).

4.2 Gestão de Chaves
Um sistema de dois níveis separa a identidade global do validador da participação específica da zona. Os validadores mantêm uma chave global para ações de alto nível e delegam para chaves de zona por meio de um registro on-chain. As delegações são ativadas nos limites de época após visibilidade em toda a rede.

4.3 Proposta e Ativação de Zonas
Novas zonas são propostas on-chain com um atraso obrigatório para que os validadores preparem infraestrutura, segurança, rede e procedimentos de recuperação. Somente após o atraso uma zona pode ser selecionada por votação regular.

4.4 Processo de Votação de Seleção de Zonas
Os validadores votam sobre zonas futuras e tempos-alvo de bloco usando chaves globais ponderadas por stake. Uma supermaioria estabelece quórum; caso contrário, a rede retorna ao consenso global para a próxima época. A janela permite preparação de infraestrutura e aquecimento de chaves.

4.5 Modo de Consenso Global
Um modo de fallback e segurança com parâmetros conservadores (por exemplo, tempo de bloco de 400 ms, tamanho de bloco reduzido). É acionado por falha na seleção de zonas ou falha de finalização em tempo de execução; uma vez acionado no meio de uma época, permanece até a próxima.

5. Conjunto de Validadores
O Fogo utiliza um conjunto de validadores curado para atingir os limites físicos de desempenho e mitigar MEV abusivo. Inicialmente, prova de autoridade, com transição para permissão direta por validadores.

5.1 Tamanho e Configuração Inicial
O conjunto de validadores possui limites definidos pelo protocolo; alvo inicial de 20–50 validadores. Uma autoridade gênese seleciona o conjunto inicial com poderes temporários de gestão.

5.2 Governança e Transições
O controle é transferido para o conjunto de validadores; mudanças de membros exigem supermaioria de dois terços. A rotatividade é limitada para preservar a estabilidade.

5.3 Requisitos de Participação
Os validadores devem atender a um stake delegado mínimo e obter aprovação do conjunto para garantir capacidade e alinhamento.

5.4 Fundamentação e Governança da Rede
Esse mecanismo formaliza a aplicação de comportamentos benéficos sem reduzir materialmente a descentralização, uma vez que qualquer supermaioria PoS já pode realizar um fork. Permite respostas a problemas persistentes de desempenho, MEV abusivo, falha em encaminhar blocos Turbine e outros comportamentos prejudiciais.

6. Extensões Potenciais
Extensões em consideração mantêm a compatibilidade com a Solana.

6.1 Pagamento de Taxas com Token SPL
Um tipo de transação fee_payer_unsigned mais um programa de taxas on-chain permitiria o pagamento de taxas em tokens SPL por meio de um mercado permissionless de retransmissores, exigindo mudanças mínimas no protocolo.

7. Conclusão
O Fogo combina implementação de cliente de alto desempenho com consenso multi-local dinâmico e conjuntos de validadores curados para alcançar um desempenho sem precedentes sem comprometer a segurança central do PoS. A relocação dinâmica proporciona desempenho e resiliência com mecanismos robustos de fallback; os incentivos se alinham naturalmente por meio da economia.
`
const FRENCH_TEXT = `
Version 1.0

Résumé
Cet article présente Fogo, un nouveau protocole blockchain de couche 1 offrant des performances révolutionnaires en termes de débit, de latence et de gestion de la congestion. En tant qu’extension du protocole Solana, Fogo conserve une compatibilité totale au niveau de la couche d’exécution SVM, permettant aux programmes, outils et infrastructures existants de Solana de migrer en toute transparence tout en atteignant des performances nettement supérieures et une latence réduite.
Fogo apporte trois innovations majeures :
• Une implémentation client unifiée basée sur le pur Firedancer, atteignant des niveaux de performance inaccessibles aux réseaux utilisant des clients plus lents — y compris Solana elle-même.
• Un consensus multi-local avec colocalisation dynamique, atteignant des temps de bloc et des latences bien inférieurs à ceux de toute blockchain majeure.
• Un ensemble validateur sélectionné qui incite à la haute performance et décourage les comportements prédateurs au niveau des validateurs.
Ces innovations procurent des gains de performance substantiels tout en préservant la décentralisation et la robustesse essentielles à une blockchain de couche 1.

1. Introduction
Les réseaux blockchain sont confrontés à un défi permanent : équilibrer performance, décentralisation et sécurité. Les blockchains actuelles souffrent de limitations sévères de débit les rendant inadaptées à une activité financière mondiale. Ethereum traite moins de 50 transactions par seconde (TPS) sur sa couche de base. Même les couches 2 les plus centralisées gèrent moins de 1 000 TPS. Bien que Solana ait été conçue pour des performances plus élevées, la diversité des clients limite actuellement son débit à 5 000 TPS, provoquant de la congestion. En comparaison, les systèmes financiers traditionnels comme NASDAQ, CME et Eurex traitent régulièrement plus de 100 000 opérations par seconde.
La latence constitue une autre limite critique pour les protocoles blockchain décentralisés. Dans les marchés financiers — notamment pour la découverte des prix sur des actifs volatils — une faible latence est essentielle à la qualité et à la liquidité du marché. Les acteurs traditionnels opèrent avec des latences de bout en bout de l’ordre de la milliseconde, voire inférieures. Ces vitesses ne sont réalisables que lorsque les participants au marché peuvent se localiser physiquement près de l’environnement d’exécution, en raison des contraintes imposées par la vitesse de la lumière.
Les architectures blockchain traditionnelles utilisent des ensembles de validateurs distribués mondialement, sans conscience géographique, ce qui crée des limites de performance fondamentales. La lumière elle-même met plus de 130 millisecondes pour faire le tour de la Terre à l’équateur, même sur un trajet parfaitement circulaire — et les chemins réseau réels impliquent des distances supplémentaires et des délais d’infrastructure. Ces limites physiques s’aggravent lorsque le consensus exige plusieurs tours de communication entre validateurs. En conséquence, les réseaux doivent implémenter des temps de bloc et des délais de finalité conservateurs pour rester stables. Même dans des conditions optimales, un mécanisme de consensus globalement distribué ne peut surmonter ces délais réseau de base.
À mesure que les blockchains s’intègrent davantage au système financier mondial, les utilisateurs exigeront des performances comparables à celles des systèmes centralisés actuels. Sans conception prudente, satisfaire ces exigences pourrait compromettre fortement la décentralisation et la résilience des réseaux blockchain. Pour relever ce défi, nous proposons la blockchain Fogo couche 1. La philosophie centrale de Fogo est de maximiser le débit et de minimiser la latence grâce à deux approches clés : premièrement, utiliser le logiciel client le plus performant sur un ensemble de validateurs décentralisé de manière optimale ; et deuxièmement, adopter un consensus colocalisé tout en préservant la majorité des avantages de la décentralisation d’un consensus global.

2. Plan
L’article est divisé en sections couvrant les principales décisions de conception de Fogo. La section 3 traite de la relation entre Fogo et le protocole blockchain Solana ainsi que de sa stratégie en matière d’optimisation et de diversité des clients. La section 4 décrit le consensus multi-local, son implémentation pratique et les compromis qu’il effectue par rapport au consensus global ou local. La section 5 présente l’approche de Fogo pour initialiser et maintenir l’ensemble des validateurs. La section 6 couvre les extensions potentielles qui pourraient être introduites après le lancement.

3. Protocole et Clients
À la couche de base, Fogo commence par s’appuyer sur le protocole blockchain le plus performant et le plus largement utilisé à ce jour : Solana. Le réseau Solana dispose déjà de nombreuses solutions d’optimisation, tant en matière de conception de protocole que d’implémentations clients. Fogo vise la compatibilité maximale possible avec Solana, y compris une compatibilité totale au niveau de la couche d’exécution SVM et une compatibilité étroite avec le consensus TowerBFT, la propagation de blocs Turbine, la rotation des leaders Solana et tous les autres composants majeurs des couches réseau et consensus. Cette compatibilité permet à Fogo d’intégrer et de déployer facilement les programmes, outils et infrastructures existants de l’écosystème Solana, ainsi que de bénéficier des améliorations continues provenant de Solana.
Cependant, à la différence de Solana, Fogo fonctionnera avec un client canonique unique. Ce client canonique sera le client majeur le plus performant fonctionnant sur Solana. Cela permet à Fogo d’atteindre des performances nettement supérieures car le réseau fonctionnera toujours à la vitesse du client le plus rapide. Alors que Solana, limitée par la diversité des clients, sera toujours contrainte par la vitesse du plus lent. Pour l’instant et dans un avenir prévisible, ce client canonique sera basé sur la pile Firedancer.

3.1 Firedancer
Firedancer est l’implémentation cliente haute performance de Solana compatible développée par Jump Crypto, offrant un débit de traitement des transactions nettement supérieur aux clients validateurs actuels grâce à un traitement parallèle optimisé, une gestion mémoire optimisée et des instructions SIMD.
Deux versions existent : « Frankendancer », un hybride utilisant le moteur de traitement de Firedancer avec la pile réseau du validateur Rust, et l’implémentation complète de Firedancer avec une réécriture complète de la pile réseau en C, actuellement en phase de développement avancée.
Les deux versions conservent la compatibilité avec le protocole Solana tout en maximisant les performances. Une fois achevée, l’implémentation pure de Firedancer devrait établir de nouvelles références en matière de performance, la rendant idéale pour les exigences de haut débit de Fogo. Fogo commencera avec un réseau basé sur Frankendancer puis passera progressivement à Firedancer pur.

3.2 Clients Canoniques vs Diversité des Clients
Les protocoles blockchain fonctionnent grâce à des logiciels clients implémentant leurs règles et spécifications. Si les protocoles définissent les règles du fonctionnement du réseau, les clients traduisent ces spécifications en logiciels exécutables. La diversité des clients sert traditionnellement plusieurs objectifs : redondance, vérification indépendante des règles et réduction du risque de vulnérabilités logicielles à l’échelle du réseau. Bitcoin montre un précédent où Bitcoin Core sert de client canonique de facto, même avec des alternatives.
Cependant, dans les réseaux à haute performance proches des limites physiques matérielles, l’espace pour la diversité d’implémentation se réduit. Les implémentations optimales convergent vers des solutions similaires ; toute déviation réduit les performances à des niveaux non viables. Les bénéfices de la diversité diminuent à mesure que la surcharge de compatibilité inter-client devient un goulot d’étranglement.

3.3 Incitations Protocolaires pour des Clients Performants
Fogo autorise tout client conforme, mais son architecture incite à utiliser le plus rapide. Dans les environnements colocalisés, la latence réseau est minimale, donc l’efficacité du client détermine la performance du validateur. Les paramètres de bloc dynamiques créent une pression économique pour maximiser le débit ; les clients plus lents manquent des blocs ou doivent voter de manière conservatrice, réduisant leurs revenus. Cela sélectionne naturellement l’implémentation la plus efficace sans contrainte protocolaire stricte.

4. Consensus Multi-Local
Le consensus multi-local équilibre dynamiquement la performance de la colocalisation des validateurs avec la sécurité de la distribution géographique. Les validateurs coordonnent leurs emplacements physiques à travers les époques tout en conservant des identités cryptographiques distinctes pour les zones, atteignant un consensus à très faible latence en fonctionnement normal avec bascule vers un consensus global si nécessaire.
Le modèle s’inspire du schéma « follow the sun » des marchés traditionnels, où la liquidité se déplace entre l’Asie, l’Europe et l’Amérique du Nord pour équilibrer fonctionnement continu et liquidité concentrée.

4.1 Zones et Rotation des Zones
Une zone est une aire géographique — idéalement un seul centre de données — où la latence se rapproche des limites matérielles. Les zones peuvent s’étendre si nécessaire. La rotation offre une décentralisation juridictionnelle, une résilience de l’infrastructure et une optimisation stratégique des performances (par ex., proximité de sources d’informations sensibles aux prix).

4.2 Gestion des Clés
Un système à deux niveaux sépare l’identité globale du validateur de sa participation spécifique à une zone. Les validateurs conservent une clé globale pour les actions de haut niveau et délèguent à des clés de zone via un registre on-chain. Les délégations s’activent aux limites d’époques après visibilité à l’échelle du réseau.

4.3 Proposition et Activation de Zone
De nouvelles zones sont proposées on-chain avec un délai obligatoire permettant aux validateurs de préparer l’infrastructure, la sécurité, le réseau et les procédures de récupération. Ce n’est qu’après ce délai qu’une zone peut être sélectionnée par vote régulier.

4.4 Processus de Vote pour la Sélection des Zones
Les validateurs votent sur les futures zones et les temps de bloc cibles en utilisant des clés globales pondérées par la mise. Une supermajorité établit le quorum ; sinon, le réseau revient au consensus global pour l’époque suivante. La fenêtre permet la préparation de l’infrastructure et l’amorçage des clés.

4.5 Mode de Consensus Global
Mode de repli et de sécurité avec paramètres conservateurs (par ex., temps de bloc de 400 ms, taille de bloc réduite). Déclenché en cas d’échec de la sélection des zones ou de défaillance de finalité à l’exécution ; une fois déclenché en milieu d’époque, il reste actif jusqu’à la suivante.

5. Ensemble de Validateurs
Fogo utilise un ensemble de validateurs sélectionné pour atteindre les limites physiques de performance et réduire le MEV abusif. Initialement en preuve d’autorité, avec transition vers une permission directe par les validateurs.

5.1 Taille et Configuration Initiale
L’ensemble de validateurs a des limites protocolaires ; objectif initial de 20 à 50 validateurs. Une autorité de genèse sélectionne l’ensemble initial avec des pouvoirs temporaires de gestion.

5.2 Gouvernance et Transitions
Le contrôle est transféré à l’ensemble de validateurs ; les changements de membres nécessitent une supermajorité des deux tiers. Le renouvellement est limité pour préserver la stabilité.

5.3 Exigences de Participation
Les validateurs doivent disposer d’une mise déléguée minimale et obtenir l’approbation de l’ensemble pour garantir leurs capacités et leur alignement.

5.4 Justification et Gouvernance Réseau
Ce mécanisme formalise l’application des comportements bénéfiques sans réduire sensiblement la décentralisation, car toute supermajorité PoS peut déjà bifurquer. Il permet de réagir aux problèmes de performance persistants, au MEV abusif, au non-transfert des blocs Turbine et à d’autres comportements nuisibles.

6. Extensions Potentielles
Les extensions envisagées conservent la compatibilité avec Solana.

6.1 Paiement des Frais en Jetons SPL
Un type de transaction fee_payer_unsigned, plus un programme on-chain de gestion des frais, permettrait de payer les frais en jetons SPL via un marché de relais sans permission, nécessitant des changements protocolaires minimes.

7. Conclusion
Fogo combine une implémentation client haute performance avec un consensus multi-local dynamique et un ensemble de validateurs sélectionné pour atteindre des performances inédites sans compromettre la sécurité PoS de base. La relocalisation dynamique offre performance et résilience avec des solutions de repli robustes ; les incitations s’alignent naturellement par l’économie.
`
const TURKISH_TEXT = `
Sürüm 1.0

Özet
Bu makale, işlem hacmi, gecikme süresi ve tıkanıklık yönetiminde çığır açan performans sunan yeni bir katman 1 blok zinciri protokolü olan Fogo’yu tanıtmaktadır. Solana protokolünün bir uzantısı olarak Fogo, SVM yürütme katmanında tam uyumluluğu koruyarak mevcut Solana programlarının, araçlarının ve altyapısının sorunsuz bir şekilde taşınmasına olanak tanırken, önemli ölçüde daha yüksek performans ve daha düşük gecikme süresi sağlar.
Fogo üç yenilikçi katkı sunar:
• Yavaş istemcilere sahip ağların — Solana dahil — erişemeyeceği performans seviyelerinin kilidini açan, tamamen Firedancer tabanlı birleşik bir istemci uygulaması.
• Herhangi bir büyük blok zincirinden çok daha düşük blok süreleri ve gecikme süreleri elde eden dinamik birlikte konumlandırmalı çoklu-yerel konsensüs.
• Yüksek performansı teşvik eden ve doğrulayıcı seviyesindeki yırtıcı davranışları caydıran seçilmiş bir doğrulayıcı kümesi.
Bu yenilikler, katman 1 blok zinciri için gerekli olan merkeziyetsizlik ve sağlamlığı korurken önemli performans artışları sağlar.

1. Giriş
Blok zincir ağları, performansı merkeziyetsizlik ve güvenlik ile dengeleme konusunda sürekli bir zorlukla karşı karşıyadır. Günümüzün blok zincirleri, küresel finansal faaliyetler için uygun olmalarını engelleyen ciddi işlem hacmi sınırlamaları yaşamaktadır. Ethereum, temel katmanında saniyede 50’den az işlem (TPS) gerçekleştirir. En merkezi ikinci katman çözümleri bile saniyede 1.000’den az TPS işleyebilir. Solana daha yüksek performans için tasarlanmış olsa da, istemci çeşitliliğinden kaynaklanan sınırlamalar şu anda 5.000 TPS’de tıkanıklığa neden olmaktadır. Buna karşılık NASDAQ, CME ve Eurex gibi geleneksel finans sistemleri düzenli olarak saniyede 100.000’den fazla işlemi işler.
Gecikme süresi, merkeziyetsiz blok zinciri protokolleri için bir diğer kritik sınırlamadır. Finansal piyasalarda — özellikle dalgalı varlıkların fiyat keşfi için — düşük gecikme süresi piyasa kalitesi ve likidite açısından kritik öneme sahiptir. Geleneksel piyasa katılımcıları, ışık hızının getirdiği sınırlamalar nedeniyle yalnızca yürütme ortamıyla birlikte konumlandıklarında erişilebilen milisaniye veya milisaniyenin altındaki uçtan uca gecikmelerle çalışır.
Geleneksel blok zinciri mimarileri, coğrafi farkındalığı olmayan küresel olarak dağıtılmış doğrulayıcı kümeleri kullanır, bu da temel performans sınırlamaları yaratır. Işık bile, mükemmel bir daire boyunca ekvatoru dolanmak için 130 milisaniyeden fazla zaman alır ve gerçek dünyadaki ağ yolları ek mesafeler ve altyapı gecikmeleri içerir. Konsensüsün doğrulayıcılar arasında birden fazla iletişim turu gerektirmesi, bu fiziksel sınırlamaları daha da artırır. Sonuç olarak ağlar, istikrarı korumak için temkinli blok süreleri ve kesinlik gecikmeleri uygulamak zorundadır. En iyi koşullar altında bile, küresel olarak dağıtılmış bir konsensüs mekanizması bu temel ağ gecikmelerinin üstesinden gelemez.
Blok zincirler küresel finans sistemiyle daha fazla entegre oldukça, kullanıcılar günümüzün merkezi sistemlerine kıyasla benzer performans talep edecektir. Dikkatli bir tasarım olmadan, bu talepleri karşılamak blok zincir ağlarının merkeziyetsizliğini ve dayanıklılığını önemli ölçüde tehlikeye atabilir. Bu zorluğu aşmak için Fogo katman 1 blok zincirini öneriyoruz. Fogo’nun temel felsefesi, iki ana yaklaşımla işlem hacmini en üst düzeye çıkarmak ve gecikmeyi en aza indirmektir: birincisi, en yüksek performanslı istemci yazılımını optimal merkeziyetsiz doğrulayıcı kümesinde kullanmak; ikincisi ise, küresel konsensüsün çoğu merkeziyetsizlik avantajını korurken birlikte konumlandırılmış konsensüsü benimsemektir.

2. Taslak
Makale, Fogo’nun temel tasarım kararlarını kapsayan bölümlere ayrılmıştır. 3. bölüm, Fogo’nun Solana blok zinciri protokolüyle ilişkisini ve istemci optimizasyonu ile çeşitliliğine ilişkin stratejisini kapsar. 4. bölüm, çoklu-yerel konsensüsü, pratik uygulamasını ve küresel veya yerel konsensüse kıyasla yaptığı değiş tokuşları kapsar. 5. bölüm, Fogo’nun doğrulayıcı kümesini başlatma ve sürdürme yaklaşımını kapsar. 6. bölüm, genesis sonrası tanıtılabilecek olası uzantıları kapsar.

3. Protokol ve İstemciler
Temel katmanda Fogo, bugüne kadarki en yüksek performanslı yaygın blok zinciri protokolü olan Solana’nın üzerine inşa edilir. Solana ağı, hem protokol tasarımı hem de istemci uygulamaları açısından çok sayıda optimizasyon çözümü ile birlikte gelir. Fogo, SVM yürütme katmanında tam uyumluluk ve TowerBFT konsensüsü, Turbine blok yayılımı, Solana lider rotasyonu ve ağ ile konsensüs katmanlarındaki tüm diğer ana bileşenlerle yakın uyumluluk dahil olmak üzere Solana ile mümkün olan en yüksek geriye dönük uyumluluğu hedefler. Bu uyumluluk, Fogo’nun mevcut programları, araçları ve Solana ekosisteminden altyapıyı kolayca entegre edip dağıtmasına olanak tanır; ayrıca Solana’daki sürekli yukarı akış iyileştirmelerinden faydalanır.
Ancak Solana’nın aksine, Fogo tek bir kanonik istemci ile çalışacaktır. Bu kanonik istemci, Solana üzerinde çalışan en yüksek performanslı ana istemci olacaktır. Bu, ağın her zaman en hızlı istemcinin hızında çalışmasını sağlayarak Fogo’nun çok daha yüksek performansa ulaşmasını sağlar. Solana ise istemci çeşitliliği nedeniyle her zaman en yavaş istemcinin hızıyla sınırlı kalacaktır. Şimdilik ve öngörülebilir gelecekte bu kanonik istemci Firedancer yığınına dayanacaktır.

3.1 Firedancer
Firedancer, Jump Crypto’nun yüksek performanslı Solana uyumlu istemci uygulamasıdır ve optimize edilmiş paralel işleme, bellek yönetimi ve SIMD talimatları sayesinde mevcut doğrulayıcı istemcilerden önemli ölçüde daha yüksek işlem işleme kapasitesi gösterir.
İki sürümü vardır: Firedancer’ın işlem motorunu rust doğrulayıcı ağ yığını ile birleştiren “Frankendancer” hibriti ve şu anda son geliştirme aşamasında olan, tamamen C ağ yığını yeniden yazımına sahip tam Firedancer uygulaması.
Her iki sürüm de Solana protokolü ile uyumu korurken performansı en üst düzeye çıkarır. Tam Firedancer uygulaması tamamlandığında yeni performans standartları belirlemesi beklenmektedir ve bu da onu Fogo’nun yüksek işlem hacmi gereksinimleri için ideal kılar. Fogo, Frankendancer tabanlı bir ağ ile başlayacak ve sonunda tam Firedancer’a geçecektir.

3.2 Kanonik İstemciler vs. İstemci Çeşitliliği
Blok zinciri protokolleri, kurallarını ve spesifikasyonlarını uygulayan istemci yazılımları aracılığıyla çalışır. Protokoller ağın çalışma kurallarını tanımlarken, istemciler bu spesifikasyonları çalıştırılabilir yazılıma çevirir. İstemci çeşitliliği geleneksel olarak yedeklilik, kuralların bağımsız doğrulanması ve ağ genelinde yazılım açıklarının riskini azaltma gibi birden çok amaca hizmet eder. Bitcoin, alternatifler olsa bile Bitcoin Core’un fiili kanonik istemci olarak hizmet verdiği bir örnektir.
Ancak fiziksel donanım sınırlarına yakın yüksek performanslı ağlarda, uygulama çeşitliliği için alan daralır. Optimal uygulamalar benzer çözümlerde birleşir; sapmalar performansı yaşanabilir seviyelerin altına düşürür. Çeşitliliğin faydaları, istemciler arası uyumluluk yükü bir darboğaz haline geldikçe azalır.

3.3 Yüksek Performanslı İstemciler için Protokol Teşvikleri
Fogo, uyumlu herhangi bir istemciye izin verir, ancak mimarisi en hızlı istemciyi kullanmayı teşvik eder. Birlikte konumlandırılmış ortamlarda ağ gecikmesi minimum düzeyde olduğundan, istemci verimliliği doğrulayıcı performansını belirler. Dinamik blok parametreleri, işlem hacmini en üst düzeye çıkarmak için ekonomik baskı yaratır; daha yavaş istemciler ya blokları kaçırır ya da temkinli oy kullanmak zorunda kalır, bu da gelirlerini azaltır. Bu durum, sert protokol zorlaması olmaksızın en verimli uygulamanın doğal olarak seçilmesini sağlar.

4. Çoklu-Yerel Konsensüs
Çoklu-yerel konsensüs, doğrulayıcıların birlikte konumlandırılmasının performansını, coğrafi dağılımın güvenliğiyle dinamik olarak dengeler. Doğrulayıcılar, bölgeler için farklı kriptografik kimlikleri korurken, dönemler boyunca fiziksel konumları koordine eder ve normal çalışmada ultra düşük gecikmeli konsensüs sağlarken gerektiğinde küresel konsensüse geri döner.
Model, sürekli operasyon ile yoğun likiditeyi dengelemek için likiditenin Asya, Avrupa ve Kuzey Amerika arasında hareket ettiği geleneksel piyasalardaki “güneşi takip et” deseninden esinlenmiştir.

4.1 Bölgeler ve Bölge Rotasyonu
Bölge, gecikmenin donanım sınırlarına yaklaştığı coğrafi bir alandır — ideal olarak tek bir veri merkezi. Bölgeler gerektiğinde genişleyebilir. Rotasyon, yargı yetkisi açısından merkeziyetsizlik, altyapı dayanıklılığı ve stratejik performans optimizasyonu (ör. fiyat hassasiyeti yüksek bilgilerin kaynağına yakın konumlandırma) sağlar.

4.2 Anahtar Yönetimi
İki katmanlı bir sistem, küresel doğrulayıcı kimliğini bölgeye özel katılımdan ayırır. Doğrulayıcılar yüksek seviyeli eylemler için küresel bir anahtar saklar ve zincir üzerindeki bir kayıt aracılığıyla bölge anahtarlarına yetki verir. Yetkilendirmeler, ağ genelinde görünür olduktan sonra dönem sınırlarında etkinleşir.

4.3 Bölge Teklifi ve Etkinleştirme
Yeni bölgeler, doğrulayıcıların altyapı, güvenlik, ağ ve kurtarma prosedürlerini hazırlaması için zorunlu bir gecikme ile zincir üzerinde teklif edilir. Gecikmeden sonra, bölge düzenli oylama yoluyla seçilebilir.

4.4 Bölge Seçim Oylama Süreci
Doğrulayıcılar, stake ağırlıklı küresel anahtarlar kullanarak gelecekteki bölgeler ve hedef blok süreleri üzerinde oy kullanır. Nitelikli çoğunluk, yeter sayıyı sağlar; aksi takdirde ağ, bir sonraki dönem için küresel konsensüse varsayılan olarak döner. Bu pencere, altyapı hazırlığı ve anahtar ısındırma için süre tanır.

4.5 Küresel Konsensüs Modu
Temkinli parametrelerle (ör. 400ms blok süresi, azaltılmış blok boyutu) güvenli bir geri dönüş modudur. Bölge seçimi başarısız olduğunda veya çalışma sırasında kesinlik sağlanamadığında tetiklenir; dönem ortasında tetiklendiğinde, bir sonraki döneme kadar devam eder.

5. Doğrulayıcı Kümesi
Fogo, fiziksel performans sınırlarına ulaşmak ve kötüye kullanılan MEV’yi azaltmak için seçilmiş bir doğrulayıcı kümesi kullanır. Başlangıçta yetki kanıtı (PoA), ardından doğrulayıcı doğrudan izinlendirmesine geçiş yapılır.

5.1 Boyut ve Başlangıç Yapılandırması
Doğrulayıcı kümesinin protokol sınırları vardır; başlangıç hedefi 20–50 doğrulayıcıdır. Genesis otoritesi, geçici yönetim yetkileriyle başlangıç kümesini seçer.

5.2 Yönetişim ve Geçişler
Kontrol, doğrulayıcı kümesine geçer; üyelik değişiklikleri üçte iki çoğunluk gerektirir. Devir hızı, istikrarı korumak için sınırlıdır.

5.3 Katılım Gereksinimleri
Doğrulayıcıların minimum delege stake’ini karşılaması ve yetenek ile uyumu sağlamak için kümeden onay alması gerekir.

5.4 Gerekçe ve Ağ Yönetişimi
Bu mekanizma, PoS çoğunluğunun zaten çatallama yapabileceği gerçeğini değiştirmeden faydalı davranışın uygulanmasını resmileştirir. Kalıcı performans sorunları, kötüye kullanılan MEV, Turbine bloklarının iletilmemesi ve diğer zararlı davranışlara karşı tepki verilmesini sağlar.

6. Olası Uzantılar
Düşünülen uzantılar, Solana uyumluluğunu korur.

6.1 SPL Token Ücreti Ödemesi
İzin gerektirmeyen bir aktarıcı pazarı aracılığıyla SPL tokenlerinde ücret ödemeyi sağlayacak, imzasız fee_payer işlemi türü ve zincir üzeri bir ücret programı, minimum protokol değişikliği ile mümkün olacaktır.

7. Sonuç
Fogo, yüksek performanslı istemci uygulamasını, dinamik çoklu-yerel konsensüs ve seçilmiş doğrulayıcı kümeleri ile birleştirerek, çekirdek PoS güvenliğinden ödün vermeden benzeri görülmemiş performans sağlar. Dinamik yer değiştirme, güçlü geri dönüş mekanizmalarıyla birlikte performans ve dayanıklılık sunar; teşvikler, ekonomi yoluyla doğal olarak hizalanır.
`
const HAUSA_TEXT = `
Sigar 1.0

Takaitaccen Bayani
Wannan takarda tana gabatar da Fogo, sabon yarjejeniya ta blockchain na Layer 1 wanda ke kawo ci gaba mai ban mamaki a fannin throughput, latency, da kuma gudanar da cunkoson hanyoyin sadarwa. A matsayin tsawaita yarjejeniyar Solana, Fogo tana kiyaye cikakkiyar dacewa a matakin aiwatar da SVM, tana bai wa shirye-shiryen Solana na yanzu, kayan aiki, da tsarin aikin damar matsawa cikin sauƙi tare da samun ƙarfin aiki mafi girma da ƙarancin jinkiri.  
Fogo tana bayar da sabbin abubuwa guda uku:  
• Haɗaɗɗen abokin ciniki guda ɗaya wanda aka gina bisa cikakken Firedancer, wanda ke buɗe matakan aiki da ba za a iya samu ba ta hanyar hanyoyin sadarwa da suke amfani da abokan ciniki masu jinkiri — har da Solana kanta.  
• Yarjejeniyar multi-local consensus tare da dynamic colocation, wadda ke cimma lokutan toshewa da jinkiri ƙasa da duk wani manyan blockchain.  
• Tsararren saitin masu tabbatarwa wanda ke ƙarfafa babban aiki kuma yana hana halayen masu cutarwa a matakin mai tabbatarwa.  
Waɗannan abubuwan sabuntawa suna kawo gagarumin ci gaba yayin kiyaye rarrabuwar kai da ƙarfi da ake buƙata a blockchain na Layer 1.

1. Gabatarwa  
Hanyoyin sadarwa na blockchain suna fuskantar ƙalubalen da ke ci gaba wajen daidaita aiki tare da rarrabuwar kai da tsaro. Blockchains na yau suna fama da iyakancewar throughput mai tsanani wanda ke sa ba su dace da mu’amalolin kuɗi na duniya ba. Ethereum na sarrafa ƙasa da ma’amaloli 50 a cikin daƙiƙa (TPS) a matakin asali. Ko da Layer 2 mafi mayar da hankali yana sarrafa ƙasa da TPS 1,000. Duk da cewa an ƙera Solana don aiki mafi girma, iyakancewa daga bambancin abokan ciniki yanzu yana haifar da cunkoso a TPS 5,000. A gefe guda, tsarin kuɗi na gargajiya irin su NASDAQ, CME, da Eurex na sarrafa sama da ayyuka 100,000 a cikin daƙiƙa.  
Latency (jinkiri) shima wani babban ƙuntatawa ne ga yarjejeniyoyin blockchain da aka rarraba. A kasuwannin kuɗi — musamman wajen gano farashi a kan dukiya masu saurin sauyin farashi — ƙarancin jinkiri yana da matuƙar muhimmanci ga ingancin kasuwa da likitiditi. Masu shiga kasuwanni na gargajiya suna aiki da jinkiri daga farko zuwa ƙarshe a matakin millisecond ko ƙasa da haka. Wannan saurin na samuwa ne kawai idan masu kasuwa suna iya zama kusa da wurin aiwatarwa saboda iyakar saurin haske.  
Tsarin blockchain na gargajiya suna amfani da saitin masu tabbatarwa da aka rarraba a duniya ba tare da la’akari da wurin ƙasa ba, wanda hakan ke haifar da iyakokin aiki na asali. Hasken kansa yana ɗaukar fiye da millisecond 130 don kewaye duniya a madaidaicin zagaye — kuma hanyoyin sadarwa na ainihi suna ƙara nisan hanya da jinkirin kayan aiki. Waɗannan iyakokin na zahiri suna ƙaruwa idan yarjejeniya na bukatar zagayen sadarwa da dama tsakanin masu tabbatarwa. Sakamakon haka, hanyoyin sadarwa suna buƙatar aiwatar da lokutan toshewa masu tsaro da jinkirin tabbatarwa don kiyaye kwanciyar hankali. Ko a mafi kyawun yanayi, tsarin yarjejeniya na duniya ba zai iya shawo kan waɗannan jinkirin sadarwa na asali ba.  
Yayin da blockchains ke haɗuwa da tsarin kuɗi na duniya, masu amfani za su nemi aiki daidai da tsarin tsakiya na yau. Ba tare da tsara sosai ba, cika waɗannan bukatun zai iya rage rarrabuwar kai da ƙarfinsa sosai. Don magance wannan ƙalubale, muna gabatar da Fogo Layer 1 blockchain. Ka'idar asali ta Fogo ita ce haɓaka throughput da rage latency ta hanyoyi biyu: na farko, amfani da mafi ingancin abokin ciniki a kan saitin masu tabbatarwa da aka rarraba yadda ya dace; na biyu, rungumar yarjejeniyar co-located consensus yayin kiyaye mafi yawan fa’idodin rarrabuwar kai na duniya.

2. Tsarin Takarda  
An raba wannan takarda zuwa sassa da ke rufe manyan shawarwarin ƙira na Fogo. Sashe na 3 yana rufe dangantakar Fogo da yarjejeniyar blockchain ta Solana da dabarunta game da haɓaka abokan ciniki da bambanci. Sashe na 4 yana rufe multi-local consensus, yadda ake aiwatar da shi a zahiri, da musayar da yake yi idan aka kwatanta da global ko local consensus. Sashe na 5 yana rufe tsarin fara da kuma kula da saitin masu tabbatarwa. Sashe na 6 yana rufe tsawaitawa masu yiwuwa da za a gabatar bayan haihuwar genesis.

3. Yarjejeniya da Abokan Ciniki  
A matakin asali Fogo tana gina kanta a kan mafi ingancin yarjejeniyar blockchain da aka fi amfani da ita zuwa yau, wato Solana. Hanyar sadarwar Solana tana da dama daga cikin mafita na haɓakawa, duka ta fuskar ƙira da aiwatarwa na abokan ciniki. Fogo tana niyya ga cikakkiyar dacewar baya da Solana, ciki har da cikakkiyar dacewa a matakin aiwatar da SVM da kusan dacewa da TowerBFT consensus, Turbine block propagation, Solana leader rotation da duk sauran manyan sassa na hanyar sadarwa da yarjejeniya. Wannan dacewa tana bai wa Fogo damar haɗa da kaddamar da shirye-shiryen da ake da su, kayan aiki, da tsarin Solana cikin sauƙi; tare da cin gajiyar ci gaban da ake samu daga Solana kai tsaye.  
Sai dai, ba kamar Solana ba, Fogo za ta gudana da abokin ciniki guda ɗaya na hukuma (canonical client). Wannan zai kasance abokin ciniki mafi inganci da ke aiki a kan Solana. Wannan yana bai wa Fogo damar cimma aikin da ya fi yawa saboda cibiyar sadarwa za ta yi aiki koyaushe da saurin mafi ingancin abokin ciniki. A Solana, bambancin abokan ciniki na rage gudu saboda ana iyakancewa da jinkirin mafi raunin abokin ciniki. A yanzu da nan gaba, wannan abokin ciniki na hukuma zai kasance bisa tsarin Firedancer.

3.1 Firedancer  
Firedancer shi ne abokin ciniki na Solana mai inganci sosai daga Jump Crypto, wanda yake nuna ƙarfin sarrafa ma'amala mai yawa fiye da abokan ciniki na yanzu ta hanyar haɓaka aikin layi-layi, sarrafa ƙwaƙwalwa, da umarnin SIMD.  
Akwai nau’i biyu: "Frankendancer," haɗin gwiwa da ke amfani da injin sarrafa Firedancer tare da tsarin sadarwar rust validator, da cikakken Firedancer wanda aka sake rubuta tsarin sadarwar C gaba ɗaya, wanda yake a matakin ƙarshe na haɓakawa.  
Duka nau’ukan suna kiyaye dacewar yarjejeniyar Solana yayin da suke haɓaka aiki. Da zarar an kammala, ana sa ran cikakken Firedancer zai kafa sabon ma’aunin aiki, wanda ya dace da bukatun throughput na Fogo. Fogo za ta fara da cibiyar sadarwa mai tushe akan Frankendancer sannan daga baya ta koma cikakken Firedancer.

3.2 Abokan Ciniki na Hukuma vs. Bambancin Abokan Ciniki  
Yarjejeniyoyin blockchain suna aiki ta hanyar software na abokin ciniki wanda ke aiwatar da dokoki da ƙayyadaddun ka’idoji. Duk da cewa yarjejeniyoyi suna ayyana dokokin aikin cibiyar sadarwa, abokan ciniki suna fassara waɗannan ƙayyadaddun zuwa software mai gudana. Bambancin abokan ciniki na gargajiya yana ba da fa'idodi da dama: redundanci, tabbatar da dokoki ta hanyoyi daban-daban, da rage haɗarin matsalar software ta gaba ɗaya. Bitcoin na nuna misali inda Bitcoin Core ya zama tamkar abokin ciniki na hukuma koda akwai madadin.  
Sai dai, a cikin hanyoyin sadarwa masu inganci sosai da ke kusa da iyakar kayan aiki, sarari na bambancin aiwatarwa yana raguwa. Ingantattun aiwatarwa suna haɗuwa zuwa mafita iri ɗaya; bambance-bambance suna rage aiki zuwa matakan da ba za su yiwu ba. Fa'idodin bambanci suna raguwa yayin da ƙarin dacewar tsakanin abokan ciniki ke zama cikas.

3.3 Tsarin Yarjejeniya Don Ƙarfafa Abokan Ciniki Masu Inganci  
Fogo tana bari kowanne abokin ciniki mai bin ka’ida ya shiga, amma tsarin ta yana ƙarfafa amfani da mafi sauri. A yanayin co-located, jinkirin cibiyar sadarwa yana da ƙanƙanta sosai, don haka ingancin abokin ciniki ne ke ƙayyade aikin mai tabbatarwa. Canje-canjen block masu motsi suna haifar da matsin tattalin arziki don haɓaka throughput; abokan ciniki masu jinkiri suna rasa toshewa ko kuma sai sun yi ƙuri’a cikin taka tsantsan, suna rage kuɗin shiga. Wannan yana sa mafi ingancin aiwatarwa ta zaɓi kai tsaye ba tare da tilasta shi ta yarjejeniya ba.

4. Multi-Local Consensus  
Multi-local consensus yana daidaita aiki tsakanin haɗa wuraren masu tabbatarwa da tsaron rarrabuwar ƙasa. Masu tabbatarwa suna tsara wurin zahiri a kowane lokaci (epoch) yayin da suke kiyaye mabudin sirri daban-daban ga kowanne yanki, suna cimma yarjejeniya mai ƙarancin jinkiri a cikin aiki na yau da kullum tare da komawa zuwa global consensus idan ya zama dole.  
Wannan tsarin yana jan darasi daga tsarin "follow the sun" a kasuwannin gargajiya, inda likitiditi ke motsawa tsakanin Asiya, Turai, da Arewacin Amurka don kiyaye aiki na ci gaba da kuma mayar da hankali kan likitiditi.

4.1 Yankuna da Juyawar Yanki  
Yanki wuri ne na ƙasa — mafi dacewa shi ne cibiyar bayanai guda ɗaya — inda jinkiri ya kai matakin iyakar kayan aiki. Ana iya faɗaɗa yankuna idan an buƙata. Juyawa yana bayar da rarrabuwar ƙasa ta shari’a, juriya na kayan aiki, da kuma haɓaka aikin da aka tsara (misali, saita kusa da tushen bayanai masu tasiri a farashi).

4.2 Gudanar da Mabudi  
Tsarin matakai biyu yana raba asalin mai tabbatarwa na duniya daga shiga yanki. Masu tabbatarwa suna riƙe mabudi na duniya don manyan ayyuka kuma suna ba da izini ga mabuɗan yanki ta hanyar rijistar on-chain. Bayar da izini yana aiki a farkon epoch bayan ganin shi a duk cibiyar sadarwa.

4.3 Shawarar Yanki da Kunna shi  
Ana ba da shawarwarin sabbin yankuna akan blockchain tare da jinkiri na tilas don masu tabbatarwa su shirya kayan aiki, tsaro, hanyar sadarwa, da hanyoyin murmurewa. Bayan wannan jinkiri ne kawai za a iya zaɓar yanki ta hanyar ƙuri’ar yau da kullum.

4.4 Tsarin Zaɓen Yanki  
Masu tabbatarwa suna ƙuri’a kan yankuna masu zuwa da lokutan toshewa da ake nufi ta amfani da mabuɗan duniya bisa nauyin hannun jari. Rinjin yawanci yana kafa damar aiki; idan ba a samu ba, cibiyar sadarwa ta koma ga global consensus a epoch mai zuwa. Wannan taga lokaci yana ba damar shirya kayan aiki da dumama mabudi.

4.5 Yanayin Global Consensus  
Yanayin kariya tare da saitunan tsaro (misali, 400ms block time, rage girman block). Ana kunna shi idan zaɓen yanki ya kasa ko kuma kuskuren tabbatarwa ya faru; idan aka kunna a tsakiyar epoch, yana ci gaba har sai na gaba.

5. Saitin Masu Tabbatarwa  
Fogo tana amfani da saitin masu tabbatarwa da aka tsara don kaiwa iyakar aikin zahiri da rage MEV mai cutarwa. Da farko proof-of-authority, sannan ta koma ga izinin kai tsaye daga masu tabbatarwa.

5.1 Girma da Saitin Farko  
Saitin masu tabbatarwa yana da iyaka daga yarjejeniya; burin farko shine masu tabbatarwa 20–50. Hukumar genesis za ta zaɓi saitin farko tare da ikon gudanarwa na wucin gadi.

5.2 Gudanarwa da Sauye-sauye  
Ikon yana wucewa zuwa saitin masu tabbatarwa; sauye-sauyen mambobi suna buƙatar rinjin kashi biyu bisa uku. Ana iyakance sauye-sauyen don kiyaye kwanciyar hankali.

5.3 Bukatun Shiga  
Masu tabbatarwa dole ne su samu mafi ƙarancin stake da aka ba su kuma su samu amincewar saitin don tabbatar da ƙwarewa da daidaituwa.

5.4 Dalili da Gudanar da Cibiyar Sadarwa  
Wannan tsarin yana aiwatar da tilasta halaye masu amfani ba tare da rage rarrabuwar kai sosai ba, tun da kowane rinjin PoS na iya yin fork. Yana ba da damar amsawa ga matsalolin aiki na dindindin, MEV mai cutarwa, gazawar aika Turbine blocks, da sauran halaye masu cutarwa.

6. Tsawaitawa Masu Yiwuwa  
Tsawaitawar da ake la’akari da su suna kiyaye dacewar Solana.

6.1 Biyan Kudin SPL Token  
Nau’in ma’amala fee_payer_unsigned da shirin biyan kuɗi akan blockchain zai ba da damar biyan kuɗi da SPL tokens ta hanyar kasuwar relayer mara izini, tare da ƙaramin canje-canjen yarjejeniya.

7. Kammalawa  
Fogo ta haɗa aiwatar da abokin ciniki mai inganci sosai tare da multi-local consensus mai motsi da saitin masu tabbatarwa na musamman don cimma aikin da ba a taɓa gani ba ba tare da rage tsaron PoS na asali ba. Motsin wurare yana ba da aiki da juriya tare da hanyoyin kariya masu ƙarfi; tattalin arziki yana daidaita ƙarfafawa ta hanyar yanayin kasuwa.
`
const SPANISH_TEXT = `
Versión 1.0

Resumen
Este documento presenta Fogo, un novedoso protocolo de blockchain de capa 1 que ofrece un rendimiento revolucionario en throughput, latencia y gestión de congestión. Como una extensión del protocolo Solana, Fogo mantiene plena compatibilidad en la capa de ejecución SVM, permitiendo que los programas, herramientas e infraestructuras existentes de Solana migren sin problemas mientras logran un rendimiento significativamente mayor y una latencia más baja.
Fogo aporta tres innovaciones novedosas:
• Una implementación unificada del cliente basada en Firedancer puro, desbloqueando niveles de rendimiento inalcanzables por redes con clientes más lentos, incluida la propia Solana.
• Consenso multi-local con colocalización dinámica, logrando tiempos de bloque y latencias muy por debajo de los de cualquier blockchain importante.
• Un conjunto curado de validadores que incentiva un alto rendimiento y disuade comportamientos depredadores a nivel de validador.
Estas innovaciones entregan ganancias sustanciales de rendimiento mientras preservan la descentralización y robustez esenciales para una blockchain de capa 1.

1. Introducción
Las redes blockchain enfrentan un desafío continuo en equilibrar rendimiento con descentralización y seguridad. Las blockchains actuales sufren limitaciones severas de throughput que las hacen inadecuadas para la actividad financiera global. Ethereum procesa menos de 50 transacciones por segundo (TPS) en su capa base. Incluso las layer 2 más centralizadas manejan menos de 1,000 TPS. Aunque Solana fue diseñada para mayor rendimiento, las limitaciones derivadas de la diversidad de clientes causan congestión a 5,000 TPS. En contraste, sistemas financieros tradicionales como NASDAQ, CME y Eurex procesan regularmente más de 100,000 operaciones por segundo.
La latencia presenta otra limitación crítica para protocolos blockchain descentralizados. En mercados financieros —especialmente para el descubrimiento de precios en activos volátiles— la baja latencia es esencial para la calidad del mercado y la liquidez. Los participantes tradicionales del mercado operan con latencias de extremo a extremo en escalas de milisegundos o sub-milisegundos. Estas velocidades sólo son alcanzables cuando los participantes pueden colocalizarse con el entorno de ejecución debido a las limitaciones de la velocidad de la luz.
Las arquitecturas blockchain tradicionales usan conjuntos de validadores distribuidos globalmente que operan sin conciencia geográfica, creando limitaciones fundamentales de rendimiento. La luz misma tarda más de 130 milisegundos en circunnavegar el globo en el ecuador, incluso viajando en un círculo perfecto —y las rutas de red del mundo real implican distancia e infraestructuras adicionales que agregan demora. Estas limitaciones físicas se agravan cuando el consenso requiere múltiples rondas de comunicación entre validadores. Como resultado, las redes deben implementar tiempos de bloque y retrasos de finalización conservadores para mantener la estabilidad. Incluso en condiciones óptimas, un mecanismo de consenso distribuido globalmente no puede superar estos retrasos básicos de red.
A medida que las blockchains se integran más con el sistema financiero global, los usuarios demandarán rendimiento comparable con los sistemas centralizados actuales. Sin un diseño cuidadoso, cumplir estas demandas podría comprometer significativamente la descentralización y resiliencia de las redes blockchain. Para enfrentar este desafío, proponemos la blockchain de capa uno Fogo. La filosofía central de Fogo es maximizar throughput y minimizar latencia mediante dos enfoques clave: primero, usando el software cliente más eficiente en un conjunto de validadores óptimamente descentralizado; y segundo, adoptando consenso colocalizado mientras se preservan la mayoría de los beneficios de descentralización del consenso global.

2. Esquema
El documento se divide en secciones que cubren las decisiones principales de diseño alrededor de Fogo. La Sección 3 aborda la relación de Fogo con el protocolo blockchain Solana y su estrategia respecto a la optimización y diversidad de clientes. La Sección 4 trata el consenso multi-local, su implementación práctica y las compensaciones que hace en relación al consenso global o local. La Sección 5 describe el enfoque de Fogo para inicializar y mantener el conjunto de validadores. La Sección 6 abarca extensiones prospectivas que pueden introducirse tras el génesis.

3. Protocolo y Clientes
En la capa base, Fogo comienza construyendo sobre el protocolo blockchain más eficiente y ampliamente usado hasta la fecha, Solana. La red Solana ya incluye numerosas soluciones de optimización, tanto en términos de diseño del protocolo como de implementaciones cliente. Fogo apunta a la máxima compatibilidad retroactiva posible con Solana, incluyendo plena compatibilidad en la capa de ejecución SVM y compatibilidad cercana con el consenso TowerBFT, la propagación de bloques Turbine, la rotación de líderes de Solana y todos los demás componentes principales de las capas de red y consenso. Esta compatibilidad permite a Fogo integrar y desplegar fácilmente programas, herramientas e infraestructura existentes del ecosistema Solana, así como beneficiarse de las mejoras continuas en Solana.
Sin embargo, a diferencia de Solana, Fogo ejecutará un único cliente canónico. Este cliente canónico será el cliente mayoritario de mayor rendimiento que funcione en Solana. Esto permite que Fogo logre un rendimiento significativamente mayor porque la red siempre funcionará a la velocidad del cliente más rápido. Mientras que Solana, limitada por la diversidad de clientes, siempre estará limitada por la velocidad del cliente más lento. Por ahora y en el futuro previsible, este cliente canónico estará basado en la pila Firedancer.

3.1 Firedancer
Firedancer es la implementación cliente compatible con Solana y de alto rendimiento de Jump Crypto, mostrando un throughput de procesamiento de transacciones sustancialmente mayor que los clientes validadores actuales mediante procesamiento paralelo optimizado, gestión de memoria y instrucciones SIMD.
Existen dos versiones: "Frankendancer," un híbrido que usa el motor de procesamiento de Firedancer con la pila de red del validador en Rust, y la implementación completa de Firedancer con una reescritura total de la pila de red en C, actualmente en etapa avanzada de desarrollo.
Ambas versiones mantienen la compatibilidad con el protocolo Solana mientras maximizan el rendimiento. Una vez completada, la implementación pura de Firedancer se espera que establezca nuevos puntos de referencia de rendimiento, haciéndola ideal para los requisitos de alto throughput de Fogo. Fogo comenzará con una red basada en Frankendancer para luego hacer la transición a Firedancer puro.

3.2 Clientes Canónicos vs. Diversidad de Clientes
Los protocolos blockchain operan a través de software cliente que implementa sus reglas y especificaciones. Mientras que los protocolos definen las reglas de operación de la red, los clientes traducen estas especificaciones en software ejecutable. La diversidad de clientes tradicionalmente cumple múltiples propósitos: redundancia, verificación independiente de reglas y reducción del riesgo de vulnerabilidades de software a nivel de red. Bitcoin muestra un precedente donde Bitcoin Core sirve como cliente canónico de facto a pesar de existir alternativas.
Sin embargo, en redes de alto rendimiento cercanas a los límites físicos del hardware, el espacio para la diversidad de implementaciones se reduce. Las implementaciones óptimas convergen en soluciones similares; las desviaciones reducen el rendimiento a niveles no viables. Los beneficios de la diversidad disminuyen a medida que la sobrecarga de compatibilidad entre clientes se convierte en un cuello de botella.

3.3 Incentivos del Protocolo para Clientes Performantes
Fogo permite cualquier cliente que cumpla con el protocolo, pero su arquitectura incentiva el uso del cliente más rápido. En entornos colocalizados, la latencia de red es mínima, por lo que la eficiencia del cliente determina el rendimiento del validador. Parámetros dinámicos de bloque crean presión económica para maximizar el throughput; los clientes más lentos o pierden bloques o deben votar de manera conservadora, reduciendo sus ingresos. Esto selecciona naturalmente la implementación más eficiente sin imponerlo con reglas estrictas.

4. Consenso Multi-Local
El consenso multi-local equilibra dinámicamente el rendimiento de la colocalización de validadores con la seguridad de la distribución geográfica. Los validadores coordinan ubicaciones físicas a través de épocas manteniendo identidades criptográficas distintas para zonas, logrando un consenso de latencia ultra baja en operación normal con un mecanismo de respaldo a consenso global cuando sea necesario.
El modelo se inspira en el patrón "seguir al sol" en mercados tradicionales, donde la liquidez se mueve entre Asia, Europa y Norteamérica para balancear operación continua y liquidez concentrada.

4.1 Zonas y Rotación de Zonas
Una zona es un área geográfica — idealmente un solo centro de datos — donde la latencia se acerca a los límites del hardware. Las zonas pueden expandirse según necesidad. La rotación provee descentralización jurisdiccional, resiliencia de infraestructura y optimización estratégica del rendimiento (por ejemplo, ubicándose cerca de fuentes de información sensible al precio).

4.2 Gestión de Claves
Un sistema de dos niveles separa la identidad global del validador de la participación específica por zona. Los validadores mantienen una clave global para acciones de alto nivel y delegan a claves por zona vía un registro on-chain. Las delegaciones se activan en los límites de época tras visibilidad de red.

4.3 Propuesta y Activación de Zonas
Las nuevas zonas se proponen on-chain con un retraso obligatorio para que los validadores preparen infraestructura, seguridad, redes y procedimientos de recuperación. Sólo tras este retraso una zona puede seleccionarse mediante votación regular.

4.4 Proceso de Votación para Selección de Zona
Los validadores votan sobre zonas futuras y tiempos objetivo de bloque usando claves globales ponderadas por stake. Una supermayoría establece quórum; si no se alcanza, la red usa consenso global para la próxima época. Esta ventana permite preparación de infraestructura y calentamiento de claves.

4.5 Modo de Consenso Global
Un modo de respaldo y seguridad con parámetros conservadores (p. ej., tiempo de bloque de 400ms, tamaño reducido de bloque). Se activa por fallo en la selección de zona o fallo de finalización en tiempo de ejecución; una vez activado a mitad de época, permanece hasta la siguiente época.

5. Conjunto de Validadores
Fogo usa un conjunto curado de validadores para alcanzar límites físicos de rendimiento y mitigar MEV abusivo. Inicialmente es proof-of-authority, con transición a permiso directo gestionado por validadores.

5.1 Tamaño y Configuración Inicial
El conjunto de validadores tiene límites protocolarios; objetivo inicial de 20 a 50 validadores. Una autoridad de génesis selecciona el conjunto inicial con poderes temporales de gestión.

5.2 Gobernanza y Transiciones
El control pasa al conjunto de validadores; los cambios de membresía requieren supermayoría de dos tercios. La rotación está limitada en ritmo para preservar estabilidad.

5.3 Requisitos de Participación
Los validadores deben cumplir un mínimo de stake delegado y obtener aprobación del conjunto para garantizar capacidad y alineación.

5.4 Razonamiento y Gobernanza de Red
Este mecanismo formaliza la aplicación de comportamientos beneficiosos sin reducir materialmente la descentralización, dado que cualquier supermayoría PoS ya puede hacer fork. Permite respuestas a problemas persistentes de rendimiento, MEV abusivo, fallos en el reenvío de bloques Turbine y otros comportamientos dañinos.

6. Extensiones Prospectivas
Las extensiones bajo consideración mantienen compatibilidad con Solana.

6.1 Pago de Tarifas con Token SPL
Un tipo de transacción fee_payer_unsigned más un programa de tarifas on-chain permitirían pagar tarifas en tokens SPL mediante un mercado de relayers permissionless, requiriendo cambios mínimos en el protocolo.

7. Conclusión
Fogo combina una implementación cliente de alto rendimiento con consenso multi-local dinámico y conjuntos curados de validadores para lograr un rendimiento sin precedentes sin comprometer la seguridad central PoS. La reubicación dinámica provee rendimiento y resiliencia con mecanismos robustos de respaldo; los incentivos se alinean naturalmente mediante la economía.
`
const BENGALI_TEXT = `
সংস্করণ ১.০

সারসংক্ষেপ
এই গবেষণাপত্রটি ফোগোকে উপস্থাপন করে, একটি নতুন লেয়ার ১ ব্লকচেইন প্রোটোকল যা থ্রুপুট, ল্যাটেন্সি এবং কনজেশন ম্যানেজমেন্টে যুগান্তকারী পারফরম্যান্স প্রদান করে। সোলানা প্রোটোকলের একটি সম্প্রসারণ হিসেবে, ফোগো SVM এক্সিকিউশন স্তরে সম্পূর্ণ সামঞ্জস্য বজায় রাখে, যার ফলে বিদ্যমান সোলানা প্রোগ্রাম, টুলিং এবং অবকাঠামো নির্বিঘ্নে মাইগ্রেট করতে পারে এবং উল্লেখযোগ্যভাবে উচ্চতর পারফরম্যান্স ও কম ল্যাটেন্সি অর্জন করে।
ফোগো তিনটি নতুন উদ্ভাবন প্রদান করে:
• বিশুদ্ধ Firedancer ভিত্তিক এককায়ী ক্লায়েন্ট বাস্তবায়ন, যা ধীর ক্লায়েন্ট বিশিষ্ট নেটওয়ার্কগুলোর (সোলানা সহ) জন্য অনুপলব্ধ পারফরম্যান্স স্তর উন্মোচন করে।
• ডায়নামিক কলোকেশন সহ মাল্টি-লোকাল কনসেনসাস, যা যেকোনো প্রধান ব্লকচেইনের চেয়ে অনেক কম ব্লক সময় এবং ল্যাটেন্সি অর্জন করে।
• একটি নির্বাচনকৃত ভ্যালিডেটর সেট যা উচ্চ পারফরম্যান্সকে উৎসাহিত করে এবং ভ্যালিডেটর স্তরে শিকারী আচরণ রোধ করে।
এই উদ্ভাবনগুলি উল্লেখযোগ্য পারফরম্যান্স উন্নতি প্রদান করে এবং লেয়ার ১ ব্লকচেইনের জন্য অপরিহার্য বিকেন্দ্রীকরণ ও দৃঢ়তা সংরক্ষণ করে।

১। পরিচিতি
ব্লকচেইন নেটওয়ার্কগুলি পারফরম্যান্সের সাথে বিকেন্দ্রীকরণ ও সুরক্ষা সঠিকভাবে সামঞ্জস্য করার একটি চলমান চ্যালেঞ্জের সম্মুখীন। আজকের ব্লকচেইনগুলো মারাত্মক থ্রুপুট সীমাবদ্ধতার সম্মুখীন, যা গ্লোবাল আর্থিক কার্যক্রমের জন্য অপ্রযোজ্য করে তোলে। ইথেরিয়াম তার বেস লেয়ারে প্রতি সেকেন্ডে ৫০ টিরও কম লেনদেন (TPS) প্রক্রিয়া করে। সবচেয়ে কেন্দ্রীভূত লেয়ার ২ গুলোও ১,০০০ TPS এর নিচে পরিচালনা করে। যদিও সোলানা উচ্চ পারফরম্যান্সের জন্য ডিজাইন করা হয়েছে, ক্লায়েন্ট বৈচিত্র্যের কারণে বর্তমানে ৫,০০০ TPS এ কনজেশন সৃষ্টি হয়। তুলনায়, প্রচলিত আর্থিক ব্যবস্থা যেমন NASDAQ, CME এবং Eurex নিয়মিত ১ লক্ষেরও বেশি অপারেশন প্রতি সেকেন্ডে প্রক্রিয়া করে।
ল্যাটেন্সিও বিকেন্দ্রীকৃত ব্লকচেইন প্রোটোকলের আরেকটি গুরুত্বপূর্ণ সীমাবদ্ধতা। আর্থিক বাজারে — বিশেষত অস্থির সম্পদের মূল্য আবিষ্কারের জন্য — নিম্ন ল্যাটেন্সি বাজারের গুণমান ও তরলতার জন্য অপরিহার্য। প্রচলিত বাজার অংশগ্রহণকারীরা মিলিসেকেন্ড অথবা সাব-মিলিসেকেন্ড স্তরের এন্ড-টু-এন্ড ল্যাটেন্সিতে কাজ করে। এই গতি কেবল তখনই সম্ভব যখন বাজার অংশগ্রহণকারীরা কার্যকরী পরিবেশের সাথে কলোকেট থাকতে পারে, কারণ আলো গতির সীমাবদ্ধতা রয়েছে।
প্রচলিত ব্লকচেইন স্থাপত্যগুলি ভূগোলগত সচেতনতা ছাড়া বিশ্বব্যাপী বিতরণকৃত ভ্যালিডেটর সেট ব্যবহার করে, যা মৌলিক পারফরম্যান্স সীমাবদ্ধতা সৃষ্টি করে। আলো কেবল সরল বৃত্তে বিশ্বজুড়ে ঘুরতে ১৩০ মিলিসেকেন্ডের বেশি সময় নেয় এবং বাস্তব বিশ্বের নেটওয়ার্ক পথ অতিরিক্ত দূরত্ব ও অবকাঠামোগত বিলম্ব যুক্ত করে। এই শারীরিক সীমাবদ্ধতাগুলি যখন কনসেনসাসের জন্য একাধিক যোগাযোগ রাউন্ড প্রয়োজন হয় তখন বহুগুণে বৃদ্ধি পায়। ফলস্বরূপ, নেটওয়ার্কগুলিকে স্থিতিশীলতা বজায় রাখতে রক্ষণশীল ব্লক সময় এবং ফাইনালিটি বিলম্ব কার্যকর করতে হয়। আদর্শ পরিস্থিতিতেও, বিশ্বব্যাপী বিতরণকৃত কনসেনসাস মেকানিজম এই মৌলিক নেটওয়ার্ক বিলম্ব অতিক্রম করতে পারে না।
ব্লকচেইন যখন গ্লোবাল আর্থিক সিস্টেমের সাথে আরও একীকৃত হয়, ব্যবহারকারীরা আজকের কেন্দ্রীভূত সিস্টেমের তুলনীয় পারফরম্যান্স আশা করবে। সাবধান ডিজাইন ছাড়া, এই চাহিদা পূরণ ব্লকচেইন নেটওয়ার্কের বিকেন্দ্রীকরণ ও স্থায়িত্বকে গুরুতর প্রভাবিত করতে পারে। এই চ্যালেঞ্জ মোকাবেলার জন্য, আমরা ফোগো লেয়ার ১ ব্লকচেইন প্রস্তাব করছি। ফোগোর মূল দার্শনিকতা হল সর্বোচ্চ থ্রুপুট এবং সর্বনিম্ন ল্যাটেন্সি অর্জন করা দুইটি প্রধান পদ্ধতির মাধ্যমে: প্রথম, সর্বোচ্চ পারফরম্যান্স সম্পন্ন ক্লায়েন্ট সফটওয়্যার ব্যবহার করে একটি অপ্টিমালি বিকেন্দ্রীকৃত ভ্যালিডেটর সেট; এবং দ্বিতীয়, কো-লোকেটেড কনসেনসাস গ্রহণ করা, যা বিশ্বব্যাপী কনসেনসাসের বেশিরভাগ বিকেন্দ্রীকরণ সুবিধা বজায় রাখে।

২। রূপরেখা
গবেষণাপত্রটি ফোগোর প্রধান ডিজাইন সিদ্ধান্তগুলি নিয়ে আলোচনা করে। ধারা ৩ ফোগোর সোলানা ব্লকচেইন প্রোটোকলের সাথে সম্পর্ক এবং ক্লায়েন্ট অপ্টিমাইজেশন ও বৈচিত্র্য নিয়ে কৌশল আলোচনা করে। ধারা ৪ মাল্টি-লোকাল কনসেনসাস, এর ব্যবহারিক বাস্তবায়ন এবং বিশ্বব্যাপী বা স্থানীয় কনসেনসাসের সাথে এর ট্রেডঅফ নিয়ে আলোচনা করে। ধারা ৫ ভ্যালিডেটর সেট প্রারম্ভ ও রক্ষণাবেক্ষণ নিয়ে আলোচনা করে। ধারা ৬ প্রাথমিক পরবর্তী সম্প্রসারণ নিয়ে আলোচনা করে যা উত্থাপিত হতে পারে।

৩। প্রোটোকল এবং ক্লায়েন্ট
বেস স্তরে ফোগো আজকের সবচেয়ে পারফরম্যান্ট ব্যাপকভাবে ব্যবহৃত ব্লকচেইন প্রোটোকল, সোলানার উপর নির্মিত। সোলানা নেটওয়ার্ক ইতিমধ্যেই প্রোটোকল ডিজাইন ও ক্লায়েন্ট বাস্তবায়নে বহু অপ্টিমাইজেশন নিয়ে এসেছে। ফোগো সর্বোচ্চ সম্ভব ব্যাকওয়ার্ড সামঞ্জস্যতা লক্ষ্য করে, যার মধ্যে SVM এক্সিকিউশন স্তরে পূর্ণ সামঞ্জস্য এবং TowerBFT কনসেনসাস, Turbine ব্লক প্রচার, সোলানা লিডার রোটেশনসহ অন্যান্য প্রধান নেটওয়ার্কিং ও কনসেনসাস উপাদানের সাথে ঘনিষ্ঠ সামঞ্জস্যতা অন্তর্ভুক্ত। এই সামঞ্জস্যতা ফোগোকে বিদ্যমান সোলানা প্রোগ্রাম, টুলিং ও অবকাঠামো সহজেই ইন্টিগ্রেট ও ডিপ্লয় করতে দেয়; এবং সোলানার ধারাবাহিক আপস্ট্রিম উন্নতির সুবিধা নিতে সক্ষম করে।
তবে সোলানার বিপরীতে, ফোগো একটি একক canonical ক্লায়েন্ট চালাবে। এই canonical ক্লায়েন্ট হবে সোলানার সর্বোচ্চ পারফরম্যান্স সম্পন্ন প্রধান ক্লায়েন্ট। এর ফলে ফোগো উল্লেখযোগ্যভাবে উচ্চতর পারফরম্যান্স অর্জন করতে পারবে কারণ নেটওয়ার্ক সর্বদা দ্রুততম ক্লায়েন্টের গতিতে চলবে। যেখানে সোলানা ক্লায়েন্ট বৈচিত্র্যের কারণে সর্বনিম্ন গতির ক্লায়েন্ট দ্বারা সীমাবদ্ধ থাকে। বর্তমানে এবং অদূর ভবিষ্যতে এই canonical ক্লায়েন্ট Firedancer স্ট্যাক ভিত্তিক হবে।

৩.১ Firedancer
Firedancer হলো Jump Crypto এর উচ্চ পারফরম্যান্স সোলানা-সামঞ্জস্যপূর্ণ ক্লায়েন্ট বাস্তবায়ন, যা উন্নত প্যারালাল প্রসেসিং, মেমরি ব্যবস্থাপনা, এবং SIMD নির্দেশাবলীর মাধ্যমে বর্তমান ভ্যালিডেটর ক্লায়েন্টগুলোর তুলনায় উল্লেখযোগ্য বেশি লেনদেন প্রক্রিয়াকরণ থ্রুপুট প্রদর্শন করে।
দুটি সংস্করণ রয়েছে: "Frankendancer," যা Firedancer এর প্রসেসিং ইঞ্জিন ব্যবহার করে কিন্তু রাষ্ট_validator এর নেটওয়ার্কিং স্ট্যাকের সাথে হাইব্রিড; এবং সম্পূর্ণ Firedancer বাস্তবায়ন, যা সম্পূর্ণ C নেটওয়ার্কিং স্ট্যাক পুনর্লিখন, বর্তমানে শেষ ধাপে রয়েছে।
উভয় সংস্করণ সোলানা প্রোটোকল সামঞ্জস্যতা বজায় রাখে এবং পারফরম্যান্স সর্বাধিক করে। সম্পন্ন হলে, বিশুদ্ধ Firedancer বাস্তবায়ন নতুন পারফরম্যান্স মানদণ্ড স্থাপন করবে, যা ফোগোর উচ্চ-থ্রুপুট প্রয়োজনীয়তার জন্য আদর্শ। ফোগো প্রথমে Frankendancer ভিত্তিক নেটওয়ার্ক দিয়ে শুরু করবে এবং পরে বিশুদ্ধ Firedancer এ স্থানান্তর করবে।

৩.২ Canonical ক্লায়েন্ট বনাম ক্লায়েন্ট বৈচিত্র্য
ব্লকচেইন প্রোটোকলগুলো তাদের নিয়ম ও স্পেসিফিকেশন বাস্তবায়ন করে ক্লায়েন্ট সফটওয়্যারের মাধ্যমে কাজ করে। প্রোটোকল নেটওয়ার্ক অপারেশনের নিয়ম নির্ধারণ করে, ক্লায়েন্ট তা নির্বাহযোগ্য সফটওয়্যারে অনুবাদ করে। ক্লায়েন্ট বৈচিত্র্য ঐতিহ্যগতভাবে বহু উদ্দেশ্যে ব্যবহৃত হয়: পুনরাবৃত্তি, নিয়মের স্বতন্ত্র যাচাইকরণ, এবং নেটওয়ার্ক-ব্যাপী সফটওয়্যার দুর্বলতার ঝুঁকি হ্রাস। বিটকয়েনের উদাহরণ আছে যেখানে বিটকয়েন কোর একটি কার্যত canonical ক্লায়েন্ট হিসেবে কাজ করে যদিও বিকল্প রয়েছে।
তবে, হার্ডওয়্যার সীমার নিকটে উচ্চ-পারফরম্যান্স নেটওয়ার্কে, বাস্তবায়ন বৈচিত্র্যের ক্ষেত্র সংকুচিত হয়। অপ্টিমাল বাস্তবায়নগুলি অনুরূপ সমাধানে মিলিত হয়; বিচ্যুতি পারফরম্যান্সকে অকার্যকর পর্যায়ে নামিয়ে আনে। বৈচিত্র্যের সুবিধা কমে যায় যখন আন্তঃ-ক্লায়েন্ট সামঞ্জস্যতা ওভারহেড বাধা হয়ে দাঁড়ায়।

৩.৩ পারফরম্যান্ট ক্লায়েন্টদের জন্য প্রোটোকল উদ্দীপনা
ফোগো যেকোনো সামঞ্জস্যপূর্ণ ক্লায়েন্টকে অনুমতি দেয়, তবে এর স্থাপত্য দ্রুততম ক্লায়েন্ট ব্যবহারে উদ্দীপিত করে। কো-লোকেটেড পরিবেশে, নেটওয়ার্ক ল্যাটেন্সি ন্যূনতম, তাই ক্লায়েন্ট দক্ষতা নির্ধারণ করে ভ্যালিডেটরের পারফরম্যান্স। ডায়নামিক ব্লক প্যারামিটার অর্থনৈতিক চাপ সৃষ্টি করে থ্রুপুট সর্বাধিক করার জন্য; ধীর ক্লায়েন্ট ব্লক মিস করে বা সংরক্ষিত ভোট দিতে বাধ্য হয়, যা আয় হ্রাস করে। এভাবেই সবচেয়ে কার্যকর বাস্তবায়ন স্বাভাবিকভাবে নির্বাচিত হয় কঠোর প্রোটোকল প্রয়োগ ছাড়া।

৪। মাল্টি-লোকাল কনসেনসাস
মাল্টি-লোকাল কনসেনসাস ভ্যালিডেটর কলোকেশনের পারফরম্যান্সকে ভূগোলিক বণ্টনের সুরক্ষার সাথে গতিশীলভাবে সামঞ্জস্য করে। ভ্যালিডেটররা যুগ অনুযায়ী শারীরিক অবস্থান সমন্বয় করে, জোনের জন্য পৃথক ক্রিপ্টোগ্রাফিক পরিচয় বজায় রেখে, স্বাভাবিক পরিচালনায় অতিনিম্ন ল্যাটেন্সির কনসেনসাস অর্জন করে এবং প্রয়োজনে গ্লোবাল কনসেনসাসে ফিরে যায়।
মডেলটি প্রচলিত বাজারের "ফলো দ্য সান" প্যাটার্ন থেকে অনুপ্রাণিত, যেখানে লিকুইডিটি এশিয়া, ইউরোপ, এবং উত্তর আমেরিকার মধ্যে সঞ্চালিত হয় যাতে ক্রমাগত কার্যক্রম ও কেন্দ্রীভূত তরলতা বজায় থাকে।

৪.১ জোন এবং জোন রোটেশন
জোন হলো একটি ভূগোলিক এলাকা — আদর্শভাবে একটি ডেটা সেন্টার — যেখানে ল্যাটেন্সি হার্ডওয়্যার সীমার কাছাকাছি। প্রয়োজনে জোন বাড়ানো যেতে পারে। রোটেশন প্রশাসনিক বিকেন্দ্রীকরণ, অবকাঠামো স্থায়িত্ব এবং কৌশলগত পারফরম্যান্স অপ্টিমাইজেশন প্রদান করে (যেমন মূল্য-সংবেদনশীল তথ্যের উৎসের কাছে অবস্থিত হওয়া)।

৪.২ কী ম্যানেজমেন্ট
একটি দুই-স্তরের সিস্টেম গ্লোবাল ভ্যালিডেটর পরিচয়কে জোন-নির্দিষ্ট অংশগ্রহণ থেকে আলাদা করে। ভ্যালিডেটররা উচ্চ-স্তরের কার্যক্রমের জন্য একটি গ্লোবাল কী রাখে এবং অন-চেইন রেজিস্ট্রির মাধ্যমে জোন কীগুলোর প্রতিনিধিত্ব করে। ডেলিগেশনগুলো যুগের সীমান্তে সক্রিয় হয় নেটওয়ার্ক-ব্যাপী দৃশ্যমানতার পরে।

৪.৩ জোন প্রস্তাবনা এবং সক্রিয়করণ
নতুন জোন অন-চেইনে প্রস্তাবিত হয়, যেখানে একটি বাধ্যতামূলক বিলম্ব থাকে ভ্যালিডেটরদের অবকাঠামো, সুরক্ষা, নেটওয়ার্কিং এবং পুনরুদ্ধার প্রক্রিয়া প্রস্তুত করার জন্য। বিলম্বের পরে নিয়মিত ভোটের মাধ্যমে একটি জোন নির্বাচন করা হয়।

৪.৪ জোন নির্বাচন ভোট প্রক্রিয়া
ভ্যালিডেটররা স্টেক-ওজনযুক্ত গ্লোবাল কীগুলো ব্যবহার করে ভবিষ্যত জোন এবং লক্ষ্য ব্লক সময় নিয়ে ভোট দেয়। একটি সুপারমেজরিটি কোয়ারাম স্থাপন করে; অন্যথায় নেটওয়ার্ক পরবর্তী যুগের জন্য গ্লোবাল কনসেনসাসে ডিফল্ট হয়। এই সময়সীমা অবকাঠামো প্রস্তুতি ও কী ওয়ার্ম-আপের সুযোগ দেয়।

৪.৫ গ্লোবাল কনসেনসাস মোড
একটি ফ্যালব্যাক এবং নিরাপত্তা মোড যার মধ্যে রক্ষণশীল প্যারামিটার থাকে (যেমন ৪০০ মি.সেক ব্লক সময়, হ্রাসকৃত ব্লক সাইজ)। জোন নির্বাচন ব্যর্থ হলে বা রানটাইম ফাইনালিটি ব্যর্থ হলে এটি সক্রিয় হয়; একবার সক্রিয় হলে তা পরবর্তী যুগ পর্যন্ত থাকে।

৫। ভ্যালিডেটর সেট
ফোগো শারীরিক পারফরম্যান্স সীমা পৌঁছাতে এবং অপব্যবহারকারী MEV হ্রাস করতে একটি নির্বাচিত ভ্যালিডেটর সেট ব্যবহার করে। প্রাথমিকভাবে প্রুফ-অফ-অথরিটি এবং পরে ভ্যালিডেটর-ডিরেক্ট পারমিশনিংয়ে রূপান্তর।

৫.১ আকার এবং প্রাথমিক কনফিগারেশন
ভ্যালিডেটর সেটের প্রোটোকল সীমা রয়েছে; প্রাথমিক লক্ষ্য ২০-৫০ জন ভ্যালিডেটর। একটি জন্ম কর্তৃপক্ষ প্রাথমিক সেট নির্বাচন করে এবং অস্থায়ী ব্যবস্থাপনা ক্ষমতা রাখে।

৫.২ গভর্নেন্স এবং রূপান্তর
নিয়ন্ত্রণ ভ্যালিডেটর সেটে হস্তান্তরিত হয়; সদস্যপদ পরিবর্তনের জন্য দুই-তৃতীয়াংশ সুপারমেজরিটি প্রয়োজন। স্থিতিশীলতা রক্ষার জন্য টার্নওভার সীমাবদ্ধ।

৫.৩ অংশগ্রহণের শর্তাদি
ভ্যালিডেটরদের অবশ্যই ন্যূনতম প্রতিনিধি স্টেক পূরণ করতে হবে এবং সক্ষমতা ও সামঞ্জস্য নিশ্চিত করতে সেট অনুমোদন পেতে হবে।

৫.৪ যুক্তি এবং নেটওয়ার্ক গভর্নেন্স
এই পদ্ধতি উপকারী আচরণের জোরদার প্রয়োগকে আনুষ্ঠানিক করে, বিকেন্দ্রীকরণকে উল্লেখযোগ্যভাবে হ্রাস না করে, কারণ যেকোন PoS সুপারমেজরিটি ইতিমধ্যেই ফর্ক করতে পারে। এটি স্থায়ী পারফরম্যান্স সমস্যা, অপব্যবহারকারী MEV, Turbine ব্লক ফরওয়ার্ড করতে ব্যর্থতা এবং অন্যান্য ক্ষতিকর আচরণের বিরুদ্ধে প্রতিক্রিয়া সক্ষম করে।

৬। সম্ভাব্য সম্প্রসারণ
সম্প্রসারণগুলো সোলানা সামঞ্জস্যতা বজায় রাখার উদ্দেশ্যে বিবেচিত হচ্ছে।

৬.১ SPL টোকেন ফি পেমেন্ট
একটি fee_payer_unsigned লেনদেন টাইপ এবং অন-চেইন ফি প্রোগ্রাম SPL টোকেন দিয়ে ফি পরিশোধের অনুমতি দেবে পারমিশনলেস রিলেয়ার মার্কেটপ্লেসের মাধ্যমে, যা প্রোটোকলে সর্বনিম্ন পরিবর্তন প্রয়োজন।

৭। উপসংহার
ফোগো উচ্চ-পারফরম্যান্স ক্লায়েন্ট বাস্তবায়ন, গতিশীল মাল্টি-লোকাল কনসেনসাস এবং নির্বাচিত ভ্যালিডেটর সেট একত্রিত করে অভূতপূর্ব পারফরম্যান্স অর্জন করে মূল PoS সুরক্ষা কম্প্রোমাইজ না করে। গতিশীল পুনর্বিন্যাস পারফরম্যান্স এবং স্থায়িত্ব প্রদান করে শক্তিশালী ফ্যালব্যাক সহ; উদ্দীপনাগুলো অর্থনীতির মাধ্যমে স্বাভাবিকভাবে সঙ্গতিপূর্ণ হয়।
`
const POLISH_TEXT = `
Wersja 1.0

Streszczenie
Niniejszy dokument przedstawia Fogo, nowatorski protokół blockchain warstwy 1, oferujący przełomową wydajność pod względem przepustowości, opóźnień oraz zarządzania przeciążeniami. Jako rozszerzenie protokołu Solana, Fogo zachowuje pełną kompatybilność na poziomie wykonawczym SVM, pozwalając istniejącym programom, narzędziom i infrastrukturze Solana na płynną migrację, jednocześnie osiągając znacząco wyższą wydajność i niższe opóźnienia.
Fogo wnosi trzy nowatorskie innowacje:
• Zunifikowaną implementację klienta opartą wyłącznie na Firedancerze, umożliwiającą osiągnięcie poziomów wydajności niedostępnych dla sieci z wolniejszymi klientami — w tym samej Solany.
• Wielolokalny konsensus z dynamicznym współlokowaniem, osiągający czasy bloków i opóźnienia znacznie poniżej tych obserwowanych w głównych blockchainach.
• Selekcjonowany zestaw walidatorów, który motywuje do wysokiej wydajności i zniechęca do drapieżnych zachowań na poziomie walidatora.
Te innowacje przynoszą istotne zyski wydajnościowe przy jednoczesnym zachowaniu decentralizacji i odporności, niezbędnych dla blockchaina warstwy 1.

1. Wprowadzenie
Sieci blockchain stoją przed nieustannym wyzwaniem pogodzenia wydajności z decentralizacją i bezpieczeństwem. Dzisiejsze blockchainy cierpią na poważne ograniczenia przepustowości, które czynią je nieodpowiednimi dla globalnej działalności finansowej. Ethereum przetwarza mniej niż 50 transakcji na sekundę (TPS) na swojej warstwie bazowej. Nawet najbardziej scentralizowane rozwiązania warstwy 2 obsługują mniej niż 1000 TPS. Choć Solana została zaprojektowana z myślą o wyższej wydajności, ograniczenia wynikające z różnorodności klientów powodują obecnie przeciążenia przy 5000 TPS. Dla porównania, tradycyjne systemy finansowe, takie jak NASDAQ, CME czy Eurex, regularnie obsługują ponad 100 000 operacji na sekundę.
Opóźnienie to kolejny istotny problem dla zdecentralizowanych protokołów blockchain. Na rynkach finansowych — szczególnie przy ustalaniu cen aktywów o dużej zmienności — niskie opóźnienia są kluczowe dla jakości rynku i płynności. Tradycyjni uczestnicy rynku działają przy opóźnieniach end-to-end na poziomie milisekund lub submilisekund. Takie szybkości są możliwe tylko wtedy, gdy uczestnicy rynku mogą współlokować się z środowiskiem wykonawczym ze względu na ograniczenia prędkości światła.
Tradycyjna architektura blockchain wykorzystuje globalnie rozproszony zestaw walidatorów działających bez świadomości geograficznej, co tworzy fundamentalne ograniczenia wydajności. Światło potrzebuje ponad 130 milisekund, aby okrążyć kulę ziemską wzdłuż równika, nawet przy idealnym okrążeniu — a rzeczywiste trasy sieciowe wiążą się z dodatkowymi opóźnieniami infrastrukturalnymi. Te fizyczne ograniczenia się kumulują, gdy konsensus wymaga wielu rund komunikacji między walidatorami. W efekcie sieci muszą stosować konserwatywne czasy bloków i opóźnienia finalizacji, by utrzymać stabilność. Nawet w optymalnych warunkach globalny mechanizm konsensusu nie jest w stanie pokonać tych podstawowych ograniczeń sieciowych.
W miarę jak blockchainy coraz bardziej integrują się z globalnym systemem finansowym, użytkownicy będą wymagać wydajności porównywalnej z dzisiejszymi scentralizowanymi systemami. Bez starannego projektu spełnienie tych wymagań mogłoby znacząco osłabić decentralizację i odporność sieci blockchain. Aby sprostać temu wyzwaniu, proponujemy blockchain warstwy pierwszej Fogo. Podstawową filozofią Fogo jest maksymalizacja przepustowości i minimalizacja opóźnień poprzez dwa kluczowe podejścia: po pierwsze, wykorzystanie najbardziej wydajnego oprogramowania klienta na optymalnie zdecentralizowanym zestawie walidatorów; po drugie, zastosowanie współlokowanego konsensusu przy zachowaniu większości korzyści decentralizacji globalnej.

2. Zarys
Dokument podzielony jest na sekcje omawiające główne decyzje projektowe dotyczące Fogo. Sekcja 3 opisuje relację Fogo do protokołu blockchain Solana oraz strategię dotyczącą optymalizacji i różnorodności klientów. Sekcja 4 omawia wielolokalny konsensus, jego praktyczną implementację oraz kompromisy w stosunku do konsensusu globalnego lub lokalnego. Sekcja 5 przedstawia podejście Fogo do inicjalizacji i utrzymania zestawu walidatorów. Sekcja 6 opisuje potencjalne rozszerzenia, które mogą zostać wprowadzone po starcie sieci.

3. Protokół i klienci
Na najniższym poziomie Fogo buduje się na bazie najbardziej wydajnego i powszechnie używanego do tej pory protokołu blockchain, czyli Solany. Sieć Solana już zawiera wiele rozwiązań optymalizacyjnych, zarówno pod względem projektowania protokołu, jak i implementacji klientów. Fogo celuje w maksymalną możliwą kompatybilność wsteczną z Solaną, w tym pełną kompatybilność na poziomie wykonawczym SVM oraz ścisłą kompatybilność z konsensusem TowerBFT, propagacją bloków Turbine, rotacją liderów Solany oraz wszystkimi innymi kluczowymi komponentami warstw sieci i konsensusu. Taka kompatybilność pozwala Fogo na łatwą integrację i wdrażanie istniejących programów, narzędzi i infrastruktury ekosystemu Solana, a także korzystanie z ciągłych usprawnień w Solanie.
Jednak w przeciwieństwie do Solany, Fogo będzie działać z jednym kanonicznym klientem. Ten kanoniczny klient będzie najwyżej wydajnym głównym klientem działającym na Solanie. Pozwala to Fogo osiągnąć znacznie wyższą wydajność, ponieważ sieć będzie działać zawsze z prędkością najszybszego klienta. W Solanie, ze względu na różnorodność klientów, wydajność jest ograniczona przez najsłabszego klienta. Obecnie i w przewidywalnej przyszłości ten kanoniczny klient będzie oparty na stosie Firedancer.

3.1 Firedancer
Firedancer to wysoko wydajna, kompatybilna z Solaną implementacja klienta stworzona przez Jump Crypto, wykazująca znacznie wyższą przepustowość przetwarzania transakcji niż obecne klienty walidatorów dzięki zoptymalizowanemu przetwarzaniu równoległemu, zarządzaniu pamięcią oraz instrukcjom SIMD.
Istnieją dwie wersje: "Frankendancer" — hybryda używająca silnika przetwarzania Firedancer z sieciową warstwą Rust validatora, oraz pełna implementacja Firedancer z całkowitym przepisaniem stosu sieciowego w C, obecnie w fazie końcowej rozwoju.
Obie wersje zachowują kompatybilność z protokołem Solana, maksymalizując jednocześnie wydajność. Po ukończeniu pełna implementacja Firedancer ma ustanowić nowe standardy wydajności, czyniąc ją idealną dla wymagań Fogo dotyczących wysokiej przepustowości. Fogo rozpocznie z siecią opartą na Frankendancer, a następnie przejdzie do czystego Firedancer.

3.2 Klienci kanoniczni kontra różnorodność klientów
Protokoły blockchain działają poprzez oprogramowanie klientów implementujące ich zasady i specyfikacje. Protokół definiuje reguły działania sieci, a klienci przekładają te specyfikacje na wykonalne oprogramowanie. Różnorodność klientów tradycyjnie pełniła kilka ról: redundancję, niezależną weryfikację reguł oraz zmniejszenie ryzyka podatności całej sieci na błędy w oprogramowaniu. Przykładem jest Bitcoin, gdzie Bitcoin Core jest klientem kanonicznym, mimo istnienia alternatyw.
Jednak w sieciach o wysokiej wydajności bliskiej fizycznym ograniczeniom sprzętowym, przestrzeń dla różnorodności implementacji kurczy się. Optymalne implementacje zbliżają się do podobnych rozwiązań; odchylenia zmniejszają wydajność do poziomów nieakceptowalnych. Korzyści z różnorodności maleją, gdy narzut kompatybilności między klientami staje się wąskim gardłem.

3.3 Zachęty protokołu do wydajnych klientów
Fogo dopuszcza dowolnego klienta zgodnego z protokołem, ale jego architektura zachęca do używania najszybszego klienta. W środowiskach współlokowanych opóźnienia sieci są minimalne, więc efektywność klienta determinuje wydajność walidatora. Dynamiczne parametry bloków tworzą presję ekonomiczną na maksymalizację przepustowości; wolniejsze klienty albo tracą bloki, albo głosują ostrożnie, co zmniejsza przychody. To naturalnie wybiera najwydajniejszą implementację bez konieczności twardych wymagań protokołowych.

4. Wielolokalny konsensus
Wielolokalny konsensus dynamicznie równoważy wydajność współlokowania walidatorów z bezpieczeństwem geograficznej dystrybucji. Walidatory koordynują swoje lokalizacje fizyczne pomiędzy epokami, zachowując odrębne kryptograficzne tożsamości dla stref, osiągając ultraniskie opóźnienia konsensusu w normalnej pracy, z możliwością przejścia na konsensus globalny w razie potrzeby.
Model czerpie inspirację z modelu "follow the sun" na tradycyjnych rynkach, gdzie płynność przesuwa się pomiędzy Azją, Europą i Ameryką Północną, by zapewnić ciągłość działania i skoncentrowaną płynność.

4.1 Strefy i rotacja stref
Strefa to obszar geograficzny — idealnie jeden data center — gdzie opóźnienia zbliżają się do granic sprzętowych. Strefy mogą się rozszerzać w razie potrzeby. Rotacja zapewnia decentralizację jurysdykcyjną, odporność infrastruktury oraz strategiczną optymalizację wydajności (np. lokalizacja blisko źródeł informacji wrażliwych cenowo).

4.2 Zarządzanie kluczami
Dwuwarstwowy system oddziela globalną tożsamość walidatora od udziału specyficznego dla stref. Walidatory posiadają globalny klucz do działań na wysokim poziomie i delegują do kluczy strefowych poprzez rejestr na łańcuchu. Delegacje aktywują się na granicach epok po sieciowej widoczności.

4.3 Propozycja i aktywacja stref
Nowe strefy są proponowane na łańcuchu z obowiązkowym opóźnieniem, by walidatory mogły przygotować infrastrukturę, bezpieczeństwo, sieć i procedury odzyskiwania. Dopiero po upływie tego czasu strefa może zostać wybrana w ramach normalnego głosowania.

4.4 Proces głosowania nad wyborem stref
Walidatory głosują nad przyszłymi strefami i docelowymi czasami bloków przy użyciu globalnych kluczy ważonych stakami. Superwiększość ustanawia kworum; w przeciwnym wypadku sieć domyślnie przechodzi do konsensusu globalnego na następną epokę. Okno czasowe umożliwia przygotowanie infrastruktury i rozgrzewkę kluczy.

4.5 Tryb konsensusu globalnego
Tryb awaryjny i zabezpieczający z konserwatywnymi parametrami (np. 400 ms czas bloku, zmniejszony rozmiar bloku). Aktywowany w przypadku niepowodzenia wyboru strefy lub awarii finalizacji w czasie wykonywania; po aktywacji w trakcie epoki pozostaje aktywny do końca tej epoki.

5. Zestaw walidatorów
Fogo korzysta z selekcjonowanego zestawu walidatorów, aby osiągnąć fizyczne granice wydajności i ograniczyć nadużycia MEV. Początkowo opiera się na dowodzie autorytetu (PoA), przechodząc do autoryzowanego, kierowanego przez walidatorów systemu.

5.1 Wielkość i konfiguracja początkowa
Zestaw walidatorów ma granice protokołowe; początkowo celuje się w 20–50 walidatorów. Autorytet startowy wybiera początkowy zestaw z tymczasowymi uprawnieniami zarządczymi.

5.2 Zarządzanie i przejścia
Kontrola przechodzi do zestawu walidatorów; zmiany członkostwa wymagają superwiększości dwóch trzecich. Rotacja jest ograniczona, by zachować stabilność.

5.3 Wymagania uczestnictwa
Walidatory muszą spełniać minimalne wymogi dotyczące delegowanego staku i uzyskać aprobatę zestawu, by zapewnić zdolność i zgodność interesów.

5.4 Uzasadnienie i zarządzanie siecią
Mechanizm formalizuje egzekwowanie korzystnych zachowań bez istotnego zmniejszania decentralizacji, ponieważ każda superwiększość PoS może już wprowadzić fork. Umożliwia reakcję na trwałe problemy wydajności, nadużycia MEV, niewłaściwe przesyłanie bloków Turbine i inne szkodliwe działania.

6. Potencjalne rozszerzenia
Rozszerzenia rozważane są pod kątem zachowania kompatybilności z Solaną.

6.1 Opłata za token SPL
Typ transakcji fee_payer_unsigned oraz program opłat na łańcuchu pozwoliłyby na opłacanie opłat w tokenach SPL za pośrednictwem rynku relayerów bez potrzeby zmian protokołowych.

7. Zakończenie
Fogo łączy wydajną implementację klienta z dynamicznym, wielolokalnym konsensusem i selekcjonowanym zestawem walidatorów, aby osiągnąć bezprecedensową wydajność bez kompromisów w zakresie bezpieczeństwa PoS. Dynamiczna relokacja zapewnia wydajność i odporność z solidnymi trybami awaryjnymi; zachęty ekonomiczne naturalnie wyrównują interesy.
`
const PERSIAN_TEXT = `
نسخه 1.0

چکیده
این مقاله فُگو را معرفی می‌کند، یک پروتکل بلاک‌چین لایه ۱ نوآورانه که عملکردی بی‌نظیر در توان عملیاتی، تأخیر و مدیریت ازدحام ارائه می‌دهد. به عنوان توسعه‌ای از پروتکل سولانا، فگو سازگاری کامل را در لایه اجرای SVM حفظ می‌کند که امکان مهاجرت بی‌دردسر برنامه‌ها، ابزارها و زیرساخت‌های موجود سولانا را فراهم می‌سازد و در عین حال عملکرد بسیار بالاتر و تأخیر بسیار کمتری را به دست می‌آورد.
فگو سه نوآوری جدید را ارائه می‌دهد:
• پیاده‌سازی یکپارچه کلاینت بر اساس Firedancer خالص، که سطوح عملکردی فراتر از شبکه‌هایی با کلاینت‌های کندتر—از جمله خود سولانا—را ممکن می‌سازد.
• اجماع چند-محلی با هم‌مکانی پویا که زمان‌های بلاک و تأخیرهایی بسیار کمتر از هر بلاک‌چین بزرگ دیگر را فراهم می‌کند.
• مجموعه‌ای گزیده از اعتباردهنده‌ها که عملکرد بالا را تشویق و رفتارهای مخرب در سطح اعتباردهنده را بازمی‌دارد.
این نوآوری‌ها افزایش‌های قابل توجه عملکرد را در حالی ارائه می‌کنند که تمرکززدایی و مقاومت لازم برای یک بلاک‌چین لایه ۱ حفظ می‌شود.

1. مقدمه
شبکه‌های بلاک‌چین با چالشی مداوم در تعادل بین عملکرد، تمرکززدایی و امنیت روبرو هستند. بلاک‌چین‌های امروزی محدودیت‌های شدیدی در توان عملیاتی دارند که آنها را برای فعالیت‌های مالی جهانی نامناسب می‌سازد. اتریوم کمتر از ۵۰ تراکنش در ثانیه (TPS) در لایه پایه خود پردازش می‌کند. حتی متمرکزترین لایه‌های دوم کمتر از ۱۰۰۰ TPS دارند. در حالی که سولانا برای عملکرد بالاتر طراحی شده است، محدودیت‌های ناشی از تنوع کلاینت باعث ازدحام در ۵۰۰۰ TPS می‌شود. در مقابل، سیستم‌های مالی سنتی مانند NASDAQ، CME و Eurex به طور مرتب بیش از ۱۰۰,۰۰۰ عملیات در ثانیه پردازش می‌کنند.
تأخیر محدودیت بحرانی دیگری برای پروتکل‌های بلاک‌چین غیرمتمرکز است. در بازارهای مالی—به‌ویژه برای کشف قیمت در دارایی‌های ناپایدار—تأخیر کم برای کیفیت بازار و نقدینگی ضروری است. فعالان بازار سنتی با تأخیرهای انتها به انتها در مقیاس میلی‌ثانیه یا زیر میلی‌ثانیه فعالیت می‌کنند. این سرعت‌ها تنها وقتی ممکن می‌شوند که فعالان بازار بتوانند با محیط اجرا هم‌مکان شوند به دلیل محدودیت سرعت نور.
معماری‌های سنتی بلاک‌چین از مجموعه اعتباردهنده‌های جهانی پراکنده استفاده می‌کنند که بدون آگاهی جغرافیایی فعالیت می‌کنند و این محدودیت‌های بنیادی عملکرد را ایجاد می‌کند. نور خود بیش از ۱۳۰ میلی‌ثانیه برای گردش کامل در استوا صرف می‌کند حتی در مسیر دایره‌ای کامل — و مسیرهای شبکه واقعی شامل فاصله و تأخیرهای زیرساختی بیشتری است. این محدودیت‌های فیزیکی هنگامی که اجماع نیازمند چندین دور ارتباط بین اعتباردهنده‌ها باشد، تشدید می‌شود. در نتیجه، شبکه‌ها باید زمان‌های بلاک محافظه‌کارانه و تأخیرهای نهایی را برای حفظ پایداری اجرا کنند. حتی در شرایط بهینه، یک مکانیزم اجماع جهانی پراکنده نمی‌تواند بر این تأخیرهای اساسی شبکه غلبه کند.
با یکپارچه‌تر شدن بلاک‌چین‌ها با سیستم مالی جهانی، کاربران عملکردی در سطح سیستم‌های متمرکز امروزی طلب خواهند کرد. بدون طراحی دقیق، برآورده کردن این نیازها می‌تواند تمرکززدایی و مقاومت شبکه‌های بلاک‌چین را به طور قابل توجهی تضعیف کند. برای پاسخ به این چالش، ما بلاک‌چین لایه یک فگو را پیشنهاد می‌کنیم. فلسفه اصلی فگو حداکثر کردن توان عملیاتی و حداقل کردن تأخیر از طریق دو رویکرد کلیدی است: اول، استفاده از نرم‌افزار کلاینت با بالاترین عملکرد روی مجموعه‌ای بهینه از اعتباردهنده‌های تمرکززدایی شده؛ و دوم، پذیرش اجماع هم‌مکان با حفظ بیشتر مزایای تمرکززدایی اجماع جهانی.

2. خلاصه
این مقاله به بخش‌هایی تقسیم شده که تصمیمات اصلی طراحی فگو را پوشش می‌دهد. بخش ۳ به رابطه فگو با پروتکل بلاک‌چین سولانا و استراتژی آن در بهینه‌سازی و تنوع کلاینت می‌پردازد. بخش ۴ به اجماع چند-محلی، پیاده‌سازی عملی و موازنه‌های آن نسبت به اجماع جهانی یا محلی اختصاص دارد. بخش ۵ رویکرد فگو به راه‌اندازی و نگهداری مجموعه اعتباردهنده را پوشش می‌دهد. بخش ۶ گسترش‌های احتمالی که ممکن است پس از پیدایش معرفی شوند را بیان می‌کند.

3. پروتکل و کلاینت‌ها
در لایه پایه، فگو با تکیه بر پرکاربردترین پروتکل بلاک‌چین پرقدرت تا به امروز، سولانا، ساخته می‌شود. شبکه سولانا قبلاً شامل راه‌حل‌های بهینه‌سازی متعددی در طراحی پروتکل و پیاده‌سازی کلاینت‌ها است. فگو هدف حداکثر سازگاری برگشتی با سولانا، شامل سازگاری کامل در لایه اجرای SVM و سازگاری نزدیک با اجماع TowerBFT، انتشار بلاک Turbine، چرخش رهبر سولانا و همه اجزای مهم شبکه و اجماع را دنبال می‌کند. این سازگاری اجازه می‌دهد برنامه‌ها، ابزارها و زیرساخت‌های موجود سولانا به آسانی در فگو ادغام و استقرار یابند؛ همچنین از بهبودهای پیوسته سولانا بهره‌مند شوند.
اما برخلاف سولانا، فگو با یک کلاینت اصلی و یکپارچه اجرا می‌شود. این کلاینت اصلی بالاترین عملکرد را در بین کلاینت‌های عمده سولانا دارد. این امکان را می‌دهد که فگو عملکرد بسیار بالاتری داشته باشد، زیرا شبکه همیشه با سرعت سریع‌ترین کلاینت اجرا می‌شود، در حالی که سولانا به دلیل تنوع کلاینت‌ها همیشه توسط سرعت کندترین کلاینت محدود می‌شود. در حال حاضر و در آینده نزدیک این کلاینت اصلی مبتنی بر پشته Firedancer خواهد بود.

3.1 Firedancer
Firedancer، پیاده‌سازی کلاینت سازگار با سولانا و با عملکرد بالا از Jump Crypto است که توان عملیاتی پردازش تراکنش قابل توجهی بالاتر از کلاینت‌های اعتباردهنده فعلی از طریق پردازش موازی بهینه، مدیریت حافظه و دستورات SIMD نشان می‌دهد.
دو نسخه وجود دارد: "Frankendancer"، ترکیبی که از موتور پردازش Firedancer با شبکه‌بندی rust validator استفاده می‌کند، و پیاده‌سازی کامل Firedancer با بازنویسی کامل شبکه در C که در مرحله نهایی توسعه است.
هر دو نسخه با پروتکل سولانا سازگار باقی می‌مانند و عملکرد را به حداکثر می‌رسانند. پس از تکمیل، انتظار می‌رود پیاده‌سازی خالص Firedancer رکوردهای جدید عملکرد را ثبت کند و برای نیازهای توان عملیاتی بالای فگو ایده‌آل باشد. فگو ابتدا با شبکه‌ای مبتنی بر Frankendancer شروع می‌کند و سپس به تدریج به Firedancer خالص منتقل خواهد شد.

3.2 کلاینت‌های اصلی در مقابل تنوع کلاینت
پروتکل‌های بلاک‌چین از طریق نرم‌افزار کلاینتی که قوانین و مشخصات آنها را اجرا می‌کند، عمل می‌کنند. در حالی که پروتکل‌ها قوانین عملیات شبکه را تعریف می‌کنند، کلاینت‌ها این مشخصات را به نرم‌افزار اجرایی تبدیل می‌کنند. تنوع کلاینت به طور سنتی اهداف متعددی دارد: افزونگی، تأیید مستقل قوانین و کاهش خطر آسیب‌پذیری‌های نرم‌افزاری شبکه‌ای. بیت‌کوین نمونه‌ای است که بیت‌کوین کور را به عنوان کلاینت اصلی بدون حذف کامل کلاینت‌های جایگزین دارد.
با این حال، در شبکه‌های پرسرعت که نزدیک به حد سخت‌افزار هستند، فضای تنوع پیاده‌سازی کاهش می‌یابد. پیاده‌سازی‌های بهینه به راه‌حل‌های مشابه همگرا می‌شوند؛ انحراف‌ها عملکرد را به سطوح غیرقابل قبول کاهش می‌دهند. مزایای تنوع با افزایش سربار سازگاری بین کلاینتی به عنوان یک گلوگاه کاهش می‌یابد.

3.3 مشوق‌های پروتکل برای کلاینت‌های با عملکرد بالا
فگو هر کلاینت سازگار را مجاز می‌داند، اما معماری آن استفاده از سریع‌ترین کلاینت را تشویق می‌کند. در شرایط هم‌مکانی، تأخیر شبکه حداقلی است، بنابراین کارایی کلاینت عملکرد اعتباردهنده را تعیین می‌کند. پارامترهای بلاک پویا فشار اقتصادی برای حداکثر کردن توان عملیاتی ایجاد می‌کنند؛ کلاینت‌های کندتر یا بلاک‌ها را از دست می‌دهند یا باید رای‌دهی محافظه‌کارانه داشته باشند که درآمد را کاهش می‌دهد. این به طور طبیعی پیاده‌سازی کارآمدترین کلاینت را بدون نیاز به اعمال سخت پروتکل انتخاب می‌کند.

4. اجماع چند-محلی
اجماع چند-محلی تعادل دینامیکی بین عملکرد هم‌مکانی اعتباردهنده‌ها و امنیت توزیع جغرافیایی را ایجاد می‌کند. اعتباردهنده‌ها مکان‌های فیزیکی خود را در طول اپوک‌ها هماهنگ می‌کنند در حالی که هویت‌های رمزنگاری متمایز برای مناطق دارند، و اجماع با تأخیر بسیار پایین در عملیات عادی با بازگشت به اجماع جهانی در صورت نیاز به دست می‌آید.
این مدل از الگوی "دنبال کردن خورشید" در بازارهای سنتی الهام گرفته است، جایی که نقدینگی بین آسیا، اروپا و آمریکای شمالی حرکت می‌کند تا عملیات پیوسته و نقدینگی متمرکز را متعادل کند.

4.1 مناطق و چرخش منطقه‌ای
یک منطقه یک ناحیه جغرافیایی است — ترجیحاً یک دیتاسنتر — که در آن تأخیر به حد محدودیت سخت‌افزار می‌رسد. مناطق می‌توانند در صورت نیاز گسترش یابند. چرخش مناطق تمرکززدایی قضایی، مقاومت زیرساخت و بهینه‌سازی عملکرد استراتژیک (مثلاً نزدیک به منابع اطلاعات حساس به قیمت) را فراهم می‌کند.

4.2 مدیریت کلیدها
یک سیستم دو سطحی هویت اعتباردهنده جهانی را از مشارکت خاص منطقه جدا می‌کند. اعتباردهنده‌ها کلید جهانی برای عملیات سطح بالا نگه می‌دارند و به کلیدهای منطقه‌ای از طریق یک رجیستری در زنجیره واگذار می‌کنند. واگذاری‌ها در ابتدای اپوک‌ها با دید شبکه‌ای فعال می‌شوند.

4.3 پیشنهاد و فعال‌سازی منطقه
مناطق جدید با تاخیر اجباری برای آماده‌سازی زیرساخت، امنیت، شبکه و رویه‌های بازیابی روی زنجیره پیشنهاد می‌شوند. تنها پس از این تاخیر منطقه می‌تواند از طریق رأی‌گیری معمول انتخاب شود.

4.4 فرآیند رأی‌گیری انتخاب منطقه
اعتباردهنده‌ها با کلیدهای جهانی وزن‌دار به سهام به مناطق آینده و زمان‌های هدف بلاک رأی می‌دهند. اکثریت فوق‌العاده کوئوروم را برقرار می‌کند؛ در غیر این صورت شبکه به اجماع جهانی برای اپوک بعدی بازمی‌گردد. این بازه زمانی برای آماده‌سازی زیرساخت و گرم کردن کلیدها فراهم می‌شود.

4.5 حالت اجماع جهانی
حالت ایمنی و بازگشتی با پارامترهای محافظه‌کارانه (مثلاً زمان بلاک ۴۰۰ میلی‌ثانیه، اندازه بلاک کاهش یافته). در صورت شکست در انتخاب منطقه یا خرابی نهایی اجرا فعال می‌شود؛ اگر در نیمه اپوک فعال شود، تا اپوک بعدی باقی می‌ماند.

5. مجموعه اعتباردهنده
فگو از مجموعه‌ای گزیده از اعتباردهنده‌ها استفاده می‌کند تا به حد فیزیکی عملکرد برسد و سوءاستفاده MEV را کاهش دهد. در ابتدا مبتنی بر اثبات صلاحیت (PoA) است و سپس به مجوزدهی مستقیم اعتباردهنده‌ها منتقل می‌شود.

5.1 اندازه و پیکربندی اولیه
مجموعه اعتباردهنده محدودیت‌های پروتکلی دارد؛ هدف اولیه ۲۰ تا ۵۰ اعتباردهنده است. یک مرجع پیدایش مجموعه اولیه را با قدرت‌های مدیریتی موقت انتخاب می‌کند.

5.2 حاکمیت و انتقال‌ها
کنترل به مجموعه اعتباردهنده‌ها منتقل می‌شود؛ تغییرات عضویت نیازمند اکثریت دوسوم است. نرخ تغییر محدود می‌شود تا پایداری حفظ شود.

5.3 شرایط مشارکت
اعتباردهنده‌ها باید حداقل سهام واگذار شده را داشته باشند و تأیید مجموعه را برای اطمینان از قابلیت و هماهنگی کسب کنند.

5.4 منطق و حاکمیت شبکه
این مکانیزم اجرای رفتارهای سودمند را بدون کاهش قابل توجه تمرکززدایی رسمی می‌کند، زیرا هر اکثریت PoS می‌تواند فورک کند. این امکان پاسخ به مشکلات عملکردی مداوم، سوءاستفاده MEV، عدم انتقال بلاک‌های Turbine و دیگر رفتارهای مخرب را فراهم می‌کند.

6. گسترش‌های احتمالی
گسترش‌هایی که در نظر گرفته شده‌اند سازگاری با سولانا را حفظ می‌کنند.

6.1 پرداخت کارمزد با توکن SPL
نوع تراکنش fee_payer_unsigned به همراه برنامه کارمزد در زنجیره امکان پرداخت کارمزدها با توکن‌های SPL از طریق بازار تسهیل‌کنندگان بدون مجوز را فراهم می‌کند که نیازمند تغییرات حداقلی پروتکل است.

7. نتیجه‌گیری
فگو با ترکیب پیاده‌سازی کلاینت با عملکرد بالا، اجماع چند-محلی پویا و مجموعه‌های گزیده اعتباردهنده، عملکردی بی‌سابقه را بدون کاهش امنیت پایه PoS ارائه می‌دهد. جابه‌جایی پویا عملکرد و مقاومت را با بازگشت‌های مطمئن فراهم می‌کند؛ مشوق‌ها از طریق مکانیزم‌های اقتصادی به طور طبیعی هم‌راستا می‌شوند.
`
const ARABIC_TEXT = `
الإصدار 1.0

الملخص
تقدم هذه الورقة البحثية Fogo، وهو بروتوكول بلوكشين من الطبقة الأولى يقدم أداءً ثوريًا في مجالات الإنتاجية، الكمون، وإدارة الازدحام. كامتداد لبروتوكول سولانا، يحافظ Fogo على التوافق الكامل عند طبقة تنفيذ SVM، مما يسمح لبرامج سولانا الحالية، وأدواتها، وبنيتها التحتية بالهجرة بسلاسة مع تحقيق أداء أعلى بكثير وكمون أقل.
يساهم Fogo بثلاث ابتكارات جديدة:
• تنفيذ عميل موحد يعتمد على Firedancer فقط، مما يفتح مستويات أداء لا يمكن تحقيقها في الشبكات التي تستخدم عملاء أبطأ — بما في ذلك سولانا نفسها.
• إجماع متعدد المواقع مع تموضع ديناميكي، يحقق أزمنة كتلة وكمونات أقل بكثير من أي بلوكشين رئيسي.
• مجموعة مدققين مختارة تحفز الأداء العالي وتردع السلوكيات الضارة على مستوى المدققين.
تقدم هذه الابتكارات مكاسب أداء كبيرة مع الحفاظ على اللامركزية والصلابة الضرورية لبروتوكول طبقة أولى.

1. المقدمة
تواجه شبكات البلوكشين تحديًا مستمرًا في موازنة الأداء مع اللامركزية والأمان. تعاني البلوكشينات الحالية من قيود شديدة على الإنتاجية تجعلها غير مناسبة للنشاط المالي العالمي. يعالج الإيثيريوم أقل من 50 معاملة في الثانية (TPS) على طبقته الأساسية. حتى أفضل طبقات 2 المركزية تعالج أقل من 1000 TPS. رغم أن سولانا صُممت لأداء أعلى، فإن التنوع في العملاء يسبب ازدحامًا عند 5000 TPS. في المقابل، تعالج الأنظمة المالية التقليدية مثل ناسداك وCME وEurex أكثر من 100,000 عملية في الثانية بشكل منتظم.
الكمون يمثل قيدًا حرجًا آخر للبروتوكولات اللامركزية. في الأسواق المالية — خصوصًا في اكتشاف الأسعار للأصول المتقلبة — الكمون المنخفض ضروري لجودة السوق والسيولة. يعمل المشاركون التقليديون بسرعات كمون من ميلي ثانية إلى أقل من ميلي ثانية. هذه السرعات لا يمكن تحقيقها إلا عندما يكون المشاركون متقاربين جغرافيًا مع بيئة التنفيذ بسبب قيود سرعة الضوء.
تستخدم البلوكشينات التقليدية مجموعات مدققين موزعة عالميًا دون وعي جغرافي، مما يخلق قيودًا أداءً أساسية. يستغرق الضوء أكثر من 130 ميلي ثانية ليحيط بالأرض عند خط الاستواء حتى لو سافر في دائرة مثالية — والمسارات الحقيقية للشبكات تتضمن تأخيرات إضافية بسبب المسافة والبنية التحتية. تتراكم هذه القيود الفيزيائية عندما يتطلب الإجماع جولات تواصل متعددة بين المدققين. نتيجة لذلك، تضطر الشبكات إلى تطبيق أزمنة كتلة وتأخيرات نهائية محافظة للحفاظ على الاستقرار. حتى في أفضل الظروف، لا يمكن لآلية إجماع موزعة عالميًا التغلب على هذه التأخيرات الأساسية.
مع تزايد تكامل البلوكشينات مع النظام المالي العالمي، سيطلب المستخدمون أداءً مقاربًا للأنظمة المركزية الحالية. دون تصميم دقيق، قد يؤدي ذلك إلى تقليل اللامركزية والمرونة بشكل كبير. لمعالجة هذا التحدي، نقترح بلوكشين الطبقة الأولى Fogo. الفلسفة الأساسية لـ Fogo هي تعظيم الإنتاجية وتقليل الكمون عبر نهجين رئيسيين: أولاً، استخدام أفضل برامج العميل أداءً على مجموعة مدققين موزعة بشكل أمثل؛ وثانيًا، اعتماد إجماع متقارب الموقع مع الحفاظ على معظم فوائد اللامركزية الإجمالية.

2. المخطط
تنقسم الورقة إلى أقسام تغطي القرارات التصميمية الرئيسية حول Fogo. القسم 3 يتناول علاقة Fogo ببروتوكول سولانا واستراتيجيته فيما يخص تحسين وتنوع العملاء. القسم 4 يغطي الإجماع متعدد المواقع، تطبيقه العملي، والمقايضات التي يقوم بها مقارنة بالإجماع العالمي أو المحلي. القسم 5 يتناول نهج Fogo في تهيئة والحفاظ على مجموعة المدققين. القسم 6 يناقش الإضافات المحتملة التي قد تُطرح بعد التأسيس.

3. البروتوكول والعملاء
يبدأ Fogo على طبقة أساسية مبنية على أكثر بروتوكولات البلوكشين شيوعًا أداءً حتى الآن، وهو سولانا. تأتي شبكة سولانا مع العديد من الحلول التحسينية، من حيث تصميم البروتوكول وتنفيذ العملاء. يستهدف Fogo أقصى توافق ممكن مع سولانا، بما في ذلك التوافق الكامل عند طبقة تنفيذ SVM وتوافقًا وثيقًا مع إجماع TowerBFT، ونشر الكتل عبر Turbine، وتناوب القائد في سولانا، وكل المكونات الرئيسية الأخرى في طبقات الشبكة والإجماع. يسمح هذا التوافق لـ Fogo بالاندماج السلس وتشغيل البرامج الحالية، الأدوات، والبنية التحتية في نظام سولانا البيئي؛ وكذلك الاستفادة من التحسينات المستمرة في سولانا.
لكن، وعلى عكس سولانا، سيعمل Fogo بعميل واحد موحد canonical client. سيكون هذا العميل الموحد هو أعلى عميل أداءً في سولانا. يتيح ذلك لـ Fogo تحقيق أداء أعلى بكثير لأن الشبكة ستعمل دائمًا بسرعة أسرع عميل. بينما سولانا، بسبب تنوع العملاء، تكون دائمًا مقيدة بسرعة أبطأ عميل. في الوقت الحالي والمستقبل المنظور، سيكون هذا العميل الموحد مبنيًا على بنية Firedancer.

3.1 Firedancer
Firedancer هو تنفيذ عالي الأداء لعميل سولانا متوافق مع Jump Crypto، يظهر إنتاجية معالجة معاملات أعلى بكثير من عملاء المدققين الحاليين عبر معالجة متوازية محسنة، إدارة ذاكرة، وتعليمات SIMD.
يوجد إصداران: "Frankendancer"، وهو هجين يستخدم محرك Firedancer مع طبقة الشبكة الخاصة بمدقق Rust، والتنفيذ الكامل لـ Firedancer مع إعادة كتابة كاملة لطبقة الشبكة باستخدام لغة C، وهو في مرحلة تطوير متقدمة.
يحافظ كلا الإصدارين على توافق مع بروتوكول سولانا مع تعظيم الأداء. عند الاكتمال، من المتوقع أن يحدد تنفيذ Firedancer النقي معايير أداء جديدة، مما يجعله مثاليًا لمتطلبات Fogo العالية الإنتاجية. سيبدأ Fogo بشبكة قائمة على Frankendancer ثم ينتقل في النهاية إلى Firedancer النقي.

3.2 العملاء الموحدون مقابل تنوع العملاء
تعمل بروتوكولات البلوكشين من خلال برمجيات العملاء التي تنفذ قواعدها ومواصفاتها. بينما تحدد البروتوكولات قواعد عمل الشبكة، تترجم العملاء هذه القواعد إلى برمجيات قابلة للتنفيذ. عادةً ما يخدم تنوع العملاء أغراضًا متعددة: التكرار، التحقق المستقل من القواعد، وتقليل مخاطر الثغرات البرمجية على مستوى الشبكة. يُظهر البيتكوين سابقة حيث يعمل Bitcoin Core كعميل موحد فعلي حتى مع وجود بدائل.
لكن في الشبكات عالية الأداء القريبة من حدود العتاد الفيزيائي، يتقلص مجال تنوع التنفيذ. تتقارب التطبيقات المثلى على حلول مماثلة؛ الانحرافات تقلل الأداء إلى مستويات غير قابلة للتطبيق. تقل فوائد التنوع مع زيادة عبء التوافق بين العملاء الذي يصبح عنق زجاجة.

3.3 حوافز البروتوكول للعملاء ذوي الأداء العالي
يسمح Fogo لأي عميل متوافق، لكن هيكله يحفز استخدام أسرع عميل. في بيئات التقارب الجغرافي، يكون كمون الشبكة ضئيلاً، لذا تحدد كفاءة العميل أداء المدقق. تخلق معايير الكتل الديناميكية ضغطًا اقتصاديًا لتعظيم الإنتاجية؛ العملاء الأبطأ إما يفقدون الكتل أو يجب أن يصوتوا بشكل محافظ، مما يقلل الإيرادات. يختار هذا بشكل طبيعي أكثر تنفيذ فعال دون فرض صلب من البروتوكول.

4. الإجماع متعدد المواقع
يوازن الإجماع متعدد المواقع ديناميكيًا أداء تقارب المدققين مع أمان التوزيع الجغرافي. ينسق المدققون المواقع الفيزيائية عبر الفترات الزمنية مع الحفاظ على هويات تشفيرية مميزة للمناطق، محققين إجماعًا منخفض الكمون في التشغيل الطبيعي مع إمكانية العودة إلى الإجماع العالمي عند الحاجة.
يستلهم النموذج من نمط "اتباع الشمس" في الأسواق التقليدية، حيث تتحرك السيولة بين آسيا وأوروبا وأمريكا الشمالية لموازنة التشغيل المستمر والسيولة المركزة.

4.1 المناطق وتناوب المناطق
المنطقة هي منطقة جغرافية — ويفضل أن تكون مركز بيانات واحد — حيث يقترب الكمون من حدود العتاد. يمكن توسيع المناطق حسب الحاجة. يوفر التناوب لامركزية قضائية، مرونة البنية التحتية، وتحسين أداء استراتيجي (مثلاً، قرب مصادر المعلومات الحساسة للسعر).

4.2 إدارة المفاتيح
نظام ذو مستويين يفصل هوية المدقق العالمية عن المشاركة الخاصة بالمنطقة. يحتفظ المدققون بمفتاح عالمي للإجراءات عالية المستوى ويفوضون مفاتيح المناطق عبر سجل على السلسلة. تُفعّل التفويضات عند بداية الفترات بعد رؤية على مستوى الشبكة.

4.3 اقتراح المنطقة وتفعيلها
تُقترح المناطق الجديدة على السلسلة مع تأخير إلزامي لتحضير المدققين للبنية التحتية، الأمن، الشبكات، وإجراءات الاسترداد. لا يمكن اختيار المنطقة إلا بعد التأخير من خلال التصويت العادي.

4.4 عملية التصويت لاختيار المنطقة
يصوت المدققون على المناطق المستقبلية وأزمنة الكتل المستهدفة باستخدام مفاتيح عالمية موزونة بالحصة. يحدد أغلبية عظمى النصاب القانوني؛ وإلا تعود الشبكة إلى الإجماع العالمي للفترة التالية. تتيح النافذة تحضير البنية التحتية وتسخين المفاتيح.

4.5 وضع الإجماع العالمي
وضع احتياطي وآمن بمعايير محافظة (مثلاً، زمن كتلة 400 مللي ثانية، حجم كتلة مخفض). يُفعّل عند فشل اختيار المنطقة أو فشل نهائية التنفيذ؛ وبمجرد التفعيل منتصف الفترة، يبقى حتى الفترة التالية.

5. مجموعة المدققين
يستخدم Fogo مجموعة مدققين مختارة للوصول إلى حدود الأداء الفيزيائية وتخفيف MEV المسيء. في البداية يستخدم إثبات السلطة، مع انتقال تدريجي إلى السماح المباشر من قبل المدققين.

5.1 الحجم والتكوين الأولي
لمجموعة المدققين حدود برتوكولية؛ الهدف الأولي 20–50 مدقق. تختار سلطة التأسيس المجموعة الأولية مع صلاحيات إدارية مؤقتة.

5.2 الحوكمة والانتقالات
تنتقل السيطرة إلى مجموعة المدققين؛ تتطلب تغييرات العضوية أغلبية ثلثين. يتم تحديد معدل التغيير للحفاظ على الاستقرار.

5.3 متطلبات المشاركة
يجب على المدققين استيفاء حد أدنى من الرهان المفوض والحصول على موافقة المجموعة لضمان القدرة والمواءمة.

5.4 الأساس والمنهجية الحوكمة الشبكية
يوثق هذا النظام فرض السلوك المفيد دون تقليل اللامركزية بشكل جوهري، حيث يمكن لأي أغلبية إثبات حصة بالفعل عمل فورك. يتيح الرد على المشاكل المستمرة في الأداء، MEV المسيء، الفشل في تمرير كتل Turbine، والسلوكيات الضارة الأخرى.

6. الإضافات المحتملة
تتم دراسة إضافات تحافظ على توافق سولانا.

6.1 دفع رسوم رموز SPL
نوع معاملة fee_payer_unsigned وبرنامج رسوم على السلسلة يسمح بدفع الرسوم برموز SPL عبر سوق ميسّر بدون إذن، مع تغييرات طفيفة في البروتوكول.

7. الخاتمة
يجمع Fogo بين تنفيذ عميل عالي الأداء مع إجماع متعدد المواقع ديناميكي ومجموعات مدققين مختارة لتحقيق أداء غير مسبوق دون التضحية بأمان إثبات الحصة الأساسي. توفر التنقل الديناميكي أداء ومرونة مع آليات احتياطية قوية؛ وتتناغم الحوافز بشكل طبيعي من خلال الاقتصاد.
`
const JAPANESE_TEXT = `
バージョン 1.0

概要
本論文は、スループット、レイテンシ、および輻輳管理において画期的な性能を発揮する新しいレイヤー1ブロックチェーンプロトコル「Fogo」を紹介する。Solanaプロトコルの拡張として、FogoはSVM実行層で完全な互換性を維持し、既存のSolanaプログラム、ツール、およびインフラストラクチャがシームレスに移行可能でありながら、はるかに高い性能と低レイテンシを実現する。
Fogoは3つの革新的な技術を提供する：
• 純粋なFiredancerに基づく統一クライアント実装により、遅いクライアントを持つネットワーク（Solana自身を含む）では達成不可能な性能レベルを解放する。
• 動的共配置を用いたマルチローカルコンセンサスにより、主要などのブロックチェーンよりもはるかに短いブロックタイムとレイテンシを達成する。
• 高性能を促進し、バリデータレベルでの捕食的行動を抑制する厳選されたバリデータセット。
これらの革新は、レイヤー1ブロックチェーンに不可欠な分散性と堅牢性を保持しながら、実質的な性能向上をもたらす。

1. はじめに
ブロックチェーンネットワークは、性能と分散性およびセキュリティのバランスという継続的な課題に直面している。今日のブロックチェーンは深刻なスループット制限を抱えており、グローバルな金融活動には適さない。Ethereumは基盤層で1秒あたり50トランザクション（TPS）未満を処理している。最も中央集権的なレイヤー2でさえ1,000 TPS未満である。Solanaは高性能を目指して設計されたが、クライアントの多様性による制約で5,000 TPSの輻輳が発生している。一方、NASDAQ、CME、Eurexといった伝統的金融システムは、1秒あたり10万以上の処理を常時行っている。
レイテンシも分散型ブロックチェーンプロトコルにとって重要な制限である。特に変動の激しい資産の価格発見においては、市場の質と流動性のために低レイテンシが不可欠だ。従来の市場参加者はミリ秒またはサブミリ秒のエンドツーエンドレイテンシで動作しており、これは光速の制約のため実行環境と共配置が可能な場合にのみ実現できる。
従来のブロックチェーンアーキテクチャは、地理的認識のないグローバルに分散したバリデータセットを用いており、根本的な性能制約を生んでいる。光は赤道上で地球を一周するのに130ミリ秒以上かかり、理想的な円形の経路でもこれだけかかる。実際のネットワーク経路では距離やインフラ遅延が加わる。これらの物理的制約は、バリデータ間の複数通信ラウンドを必要とするコンセンサスではさらに影響が大きい。そのため、安定性を保つために保守的なブロックタイムと確定遅延を実装せざるを得ない。最適条件下でも、グローバル分散コンセンサスメカニズムはこれらのネットワーク遅延を克服できない。
ブロックチェーンがグローバル金融システムとさらに統合されるにつれて、ユーザーは現在の中央集権システムに匹敵する性能を要求するようになる。注意深い設計がなければ、この要求を満たすためにブロックチェーンの分散性や耐障害性が大きく損なわれる可能性がある。この課題に対し、我々はFogoレイヤー1ブロックチェーンを提案する。Fogoの核心理念は、最も高性能なクライアントソフトウェアを最適に分散したバリデータセット上で動作させることと、共配置コンセンサスを採用しつつもグローバルコンセンサスの分散性利点の多くを保持することにより、スループット最大化とレイテンシ最小化を図ることである。

2. 構成
本論文は、Fogoの主要設計決定をカバーするセクションに分かれている。セクション3はFogoとSolanaブロックチェーンプロトコルの関係およびクライアント最適化・多様性戦略について扱う。セクション4はマルチローカルコンセンサス、その実装およびグローバル・ローカルコンセンサスとのトレードオフについて述べる。セクション5はバリデータセットの初期化と維持について説明する。セクション6はジェネシス後に導入されうる将来的拡張について触れる。

3. プロトコルとクライアント
Fogoはベースレイヤーとして、これまでに最も性能の高い広く使用されているブロックチェーンプロトコルであるSolanaの上に構築する。Solanaネットワークはプロトコル設計やクライアント実装に多くの最適化を備えている。FogoはSolanaと最大限の下位互換性を目指しており、SVM実行層での完全互換性やTowerBFTコンセンサス、Turbineブロック伝播、Solanaリーダーのローテーション、その他主要なネットワークおよびコンセンサス層コンポーネントと高い互換性を持つ。この互換性により、Solanaエコシステムの既存プログラムやツール、インフラを容易に統合・展開でき、Solanaの継続的な上流改良の恩恵も受けられる。
しかしSolanaとは異なり、Fogoは単一の正準クライアントで運用される。この正準クライアントはSolana上で動作する最も高性能な主要クライアントであり、ネットワークは常に最速クライアントの速度で稼働できる。Solanaはクライアント多様性によって最も遅いクライアントの速度に制約されるため、性能向上に限界がある。現時点および近い将来、この正準クライアントはFiredancerスタックに基づくものとなる。

3.1 Firedancer
FiredancerはJump Cryptoによる高性能Solana互換クライアント実装で、並列処理の最適化、メモリ管理、SIMD命令の活用により、現在のバリデータクライアントよりも大幅に高いトランザクション処理スループットを実現している。
2つのバージョンが存在する。1つはFrankendancerと呼ばれ、Firedancerの処理エンジンとRustバリデータのネットワークスタックを組み合わせたハイブリッド版。もう1つは完全なCネットワークスタックの書き換えを含む純粋なFiredancer実装で、現在は最終開発段階にある。
両バージョンはSolanaプロトコル互換性を維持しつつ性能を最大化している。完成後は純粋なFiredancer実装が新たな性能基準を設定し、Fogoの高スループット要件に最適となる。FogoはまずFrankendancerベースのネットワークで開始し、後に純粋なFiredancerに移行する。

3.2 正準クライアントとクライアント多様性
ブロックチェーンプロトコルは、規則と仕様を実装したクライアントソフトウェアを通じて運用される。プロトコルがネットワークのルールを定義し、クライアントがそれを実行可能なソフトウェアに変換する。クライアントの多様性は伝統的に冗長性、規則の独立検証、ネットワーク全体のソフトウェア脆弱性リスクの軽減に役立つ。BitcoinではBitcoin Coreが事実上の正準クライアントとして機能しつつも代替クライアントが存在する先例がある。
しかし物理的ハードウェア限界に近い高性能ネットワークでは、実装の多様性の余地は狭まる。最適な実装は類似した解に収束し、逸脱は性能を実用外レベルまで低下させる。多様性の利点はクライアント間の互換性オーバーヘッドがボトルネックになるにつれて縮小する。

3.3 高性能クライアントのためのプロトコルインセンティブ
Fogoは準拠する任意のクライアントを許容するが、最速クライアントの使用を促す設計となっている。共配置環境ではネットワーク遅延は最小限であり、クライアント効率がバリデータ性能を決定する。動的ブロックパラメータはスループット最大化への経済的圧力を生み、遅いクライアントはブロックを逃すか慎重に投票せざるを得ず収益が減少する。これにより、硬直的なプロトコル強制なしに最も効率的な実装が自然選択される。

4. マルチローカルコンセンサス
マルチローカルコンセンサスは、バリデータの共配置性能と地理的分散のセキュリティを動的にバランスさせる。バリデータはエポック間で物理的配置を調整しつつ、ゾーンの暗号的識別を保持し、通常時には超低レイテンシのコンセンサスを達成し、必要時にはグローバルコンセンサスにフォールバックする。
このモデルは、アジア、ヨーロッパ、北米間で流動性が移動し連続稼働と集中流動性を両立させる伝統的市場の「太陽追従」パターンから着想を得ている。

4.1 ゾーンとゾーンローテーション
ゾーンは地理的領域、理想的には単一のデータセンターであり、レイテンシはハードウェア限界に近い。ゾーンは必要に応じて拡張可能。ローテーションは法域的分散、インフラ耐障害性、価格感応情報源近接などの戦略的性能最適化を提供する。

4.2 キーマネジメント
2層システムにより、グローバルバリデータIDとゾーン特定参加を分離。バリデータはグローバルキーを高レベル操作用に保持し、オンチェーンレジストリ経由でゾーンキーに委任する。委任はエポック境界で有効化され、ネットワーク全体に可視化される。

4.3 ゾーン提案と有効化
新ゾーンはオンチェーンで提案され、バリデータがインフラ・セキュリティ・ネットワーク・リカバリ準備を整えるための遅延が義務付けられる。その後、通常の投票によってゾーンが選択される。

4.4 ゾーン選択投票プロセス
バリデータはステーク加重グローバルキーで将来のゾーンと目標ブロックタイムに投票する。スーパー多数派が定足数を満たさなければ、ネットワークは次エポックでグローバルコンセンサスをデフォルトとする。期間はインフラ準備とキーウォームアップを許容。

4.5 グローバルコンセンサスモード
フォールバックおよび安全モードであり、保守的パラメータ（例：400msブロックタイム、縮小ブロックサイズ）を使用。ゾーン選択失敗またはランタイム確定失敗時に起動し、中途発動時は次エポックまで維持される。

5. バリデータセット
Fogoは物理的性能限界到達と悪質なMEV抑制のため厳選されたバリデータセットを使用する。初期はProof-of-Authority方式で、その後バリデータ主導の許可制へ移行予定。

5.1 サイズと初期構成
バリデータセットにはプロトコル上限があり、初期目標は20～50バリデータ。ジェネシス当局が初期セットを選定し、一時的管理権を持つ。

5.2 ガバナンスと移行
管理はバリデータセットに移行し、メンバー変更は3分の2スーパー多数派を必要とする。変動率は安定性維持のため制限される。

5.3 参加要件
バリデータは最低委任ステークを満たし、セット承認を得る必要がある。能力と整合性を確保するため。

5.4 理由とネットワークガバナンス
この仕組みは、有益行動の強制を形式化しつつ分散性を著しく損なわない。PoSのスーパー多数派は既にフォーク可能であり、この方式は性能問題、悪質なMEV、Turbineブロックの不転送、その他有害行為に対処可能とする。

6. 将来的拡張
拡張はSolana互換性を維持する予定。

6.1 SPLトークンによる手数料支払い
fee_payer_unsignedトランザクションタイプとオンチェーン手数料プログラムにより、許可不要なリレイヤーマーケットプレイスを介してSPLトークンでの手数料支払いが可能となる。プロトコル変更は最小限。

7. 結論
Fogoは高性能クライアント実装と動的マルチローカルコンセンサス、厳選バリデータセットを組み合わせ、PoSセキュリティを損なうことなく前例のない性能を達成する。動的配置は性能と耐障害性をもたらし、経済的インセンティブも自然に整合する。
`
const URDU_INGLISH_TEXT = `
Fogo: Ek High-Performance SVM Layer 1
Version 1.0

Abstract
Yeh paper Fogo ka taaruf karwata hai — aik naya Layer 1 blockchain protocol jo throughput, latency, aur congestion management mein bemaisal performance deta hai. Solana protocol ka extension hote hue, Fogo SVM execution layer par poori tarah compatible hai, jisse maujooda Solana programs, tooling, aur infrastructure asaani se migrate kar sakein, aur saath hi significantly zyada performance aur kam latency hasil ho.
Fogo teen nayi innovations deta hai:
• Pure Firedancer par mabni unified client implementation, jo aise performance levels unlock karta hai jo slow clients wali networks (jismain khud Solana bhi shamil hai) hasil nahin kar sakti.
• Dynamic colocation ke saath multi-local consensus, jo block times aur latencies ko kisi bhi bari blockchain se kaafi kam rakhta hai.
• Curated validator set jo high performance ko incentivize karta hai aur predatory ya harmful behavior ko validators ki level par rokta hai.
Yeh innovations decentralization aur robustness (jo aik layer 1 blockchain ke liye bunyadi hain) ko barqarar rakhte hue zabardast performance gains deti hain.

1. Introduction
Blockchain networks ko performance, decentralization, aur security ke darmiyan tawazun banaye rakhne ka masla darpesh rehta hai. Aaj ke blockchains mein throughput ki sakht hadbandein hain jo unhein global financial activity ke liye na-munasib banati hain. Ethereum apne base layer par 50 se kam transactions per second (TPS) process karta hai. Sab se centralized layer 2s bhi 1,000 TPS se kam handle karte hain. Jabke Solana high performance ke liye design ki gayi thi, client diversity ki wajah se abhi 5,000 TPS par congestion hoti hai. Iske muqablay mein, traditional financial systems jaise NASDAQ, CME, aur Eurex regularly 100,000 se zyada operations per second process karte hain.
Latency bhi decentralized blockchain protocols ke liye aik badi pabandi hai. Khusoosan volatile assets ke price discovery ke liye financial markets mein low latency market quality aur liquidity ke liye zaroori hoti hai. Traditional market participants end-to-end latency milliseconds ya sub-millisecond scale par operate karte hain. Yeh speed sirf tab mumkin hoti hai jab participants execution environment ke qareeb (co-locate) hon, kyun ke speed of light ki physical limitations hoti hain.
Riwayati blockchain architectures globally distributed validator sets use karti hain jo geographic awareness ke baghair chalti hain, jis se bunyadi performance limitations paida hoti hain. Roshanai (light) khud equator par globe ka chakkar lagane mein 130+ milliseconds leti hai—aur real-world network paths mein mazeed distance aur infrastructure delay bhi hotay hain. Jab consensus ke liye multiple communication rounds chahiye hotay hain, to yeh inter-regional latency compound hoti hai. Nateeja yeh hai ke networks ko stability ke liye conservative block times aur finality delays rakhne padte hain. Acha halaat honay par bhi, globally distributed consensus physical networking delays par qaboo nahin pa sakta.
Jab blockchains global financial system ke sath aur zyada integrate hongi, to users centralized systems jaisi performance ki demand karenge. Baghair sochi samjhi design ke, yeh decentralization aur resilience ka khatare mein pad sakta hai. Is maslay ka hal dene ke liye hum Fogo Layer One blockchain propose karte hain. Fogo ka core philosophy yeh hai ke throughput maximize kiya jaye aur latency minimize ki jaye do approaches se: pehla, sab se performant client software ko optimal decentralization wali validator set par chalana; doosra, co-located consensus ko apnana lekin global consensus ke decentralization ke faide zyada tar barqarar rakhna.

2. Outline
Yeh paper Fogo ke major design decisions ko alag sections mein todta hai.
Section 3: Fogo ka Solana blockchain protocol ke sath rishta, aur client optimization aur diversity ki strategy.
Section 4: Multi-local consensus, uski practical implementation, aur uske trade-offs—global ya local consensus ke muqablay mein.
Section 5: Validator set ko initialize aur maintain karne ka Fogo ka approach.
Section 6: Prospective extensions jo genesis ke baad introduce ho sakti hain.

3. Protocol aur Clients
Base layer par, Fogo sab se zyada performant aur widely used blockchain protocol—Solana—par build karta hai. Solana network mein already kai optimization solutions mojood hain, dono protocol design aur client implementations ke hawale se. Fogo Solana ke sath maximum backwards compatibility ko target karta hai: SVM execution layer par poori compatibility, TowerBFT consensus ke qareeb compatibility, Turbine block propagation, Solana leader rotation, aur networking/consensus ke tamam major components. Yeh compatibility Fogo ko Solana ecosystem ke existing programs, tooling, aur infrastructure ko asaani se integrate aur deploy karne ki ijazat deti hai, saath hi Solana mein aane wali upstream improvements se faida uthana possible banati hai.
Lekin Solana ke mukable mein, Fogo sirf ek canonical client ke sath chalega. Yeh canonical client Solana par chalte hue sab se zyada performance wala major client hoga. Is se network hamesha fastest client ki speed par chalega aur slowest client ki wajah se bottleneck nahi banayga—jo Solana mein client diversity ki wajah se hota hai. Filhal aur mustaqbil ke liye, yeh canonical client Firedancer stack par mabni hoga.

3.1 Firedancer
Firedancer Jump Crypto ka high-performance Solana-compatible client implementation hai, jo optimized parallel processing, memory management, aur SIMD instructions ke zariye maujooda validator clients se kaafi zyada transaction processing throughput dikhata hai.
Do versions hain:
Frankendancer: Hybrid jo Firedancer ke processing engine ko Rust validator ke networking stack ke sath use karta hai.
Full Firedancer: Poora C networking stack rewrite, jo late-stage development mein hai.
Dono versions Solana protocol compatibility banaye rakhte hain lekin performance maximize karte hain. Jab pure Firedancer complete ho jaye to naye performance benchmarks set karne ki tawaqqo hai; yeh Fogo ke high-throughput requirements ke liye ideal hoga. Fogo shuru mein Frankendancer se chalaye ga aur aakhir kar pure Firedancer par transition karega.

3.2 Canonical Clients vs. Client Diversity
Blockchain protocols clients ke zariye operate karte hain jo unke rules aur specifications ko executable software mein badalte hain. Protocols network ke rules define karte hain, aur clients unko chalane wali implementations hoti hain. Yeh rishta mukhtalif models follow karta raha hai: kuch networks client diversity ko promote karti hain jabke doosre naturally canonical implementations par converge karte hain.
Client diversity ke fawaid mein implementation redundancy, independent verification, aur theoretical vulnerability risk reduction shamil hain. Misal ke taur par, Bitcoin mein kai client implementations hain magar Bitcoin Core de facto canonical client hai jo practical network behavior ka reference define karta hai.
Lekin high-performance blockchain networks mein, jab protocol computing aur networking hardware ke physical limits ke qareeb aata hai, to implementation diversity ka daira kam hota chala jata hai. Optimal implementations ek jaisi halaton ka samna karte hue similar architectural decisions ki taraf converge karte hain; significant deviation performance degrade karega aur client ko non-viable bana dega.
Aise systems mein jahan minimum block times aur maximum throughput target ki jati ho, client diversity ke theoretical fawaid kam ho jate hain, kyun ke mukhtalif clients ke darmiyan compatibility maintain karne ka overhead khud performance bottleneck ban sakta hai. Jab blockchain performance physical limits push kare, to implementations core architectural similarities share karte hain, aur diversity ke security fawaid ziyada theoretical ho jate hain.

3.3 Protocol Incentives for Performant Clients
Fogo kisi bhi conforming client ko allow karta hai, lekin architecture natural taur par sab se zyada performant client use karne ko incentivize karta hai, kyunki co-located operations demand karti hain ke client implementation tez ho.
Riwayati networks mein geographic distance primary bottleneck hota hai, lekin Fogo ke co-located design mein client implementation efficiency validator performance ko seedha tay karti hai. Is environment mein network latency minimal hoti hai, to client speed critical factor ban jati hai.
Network ke dynamic block time aur size parameters economic pressure paida karte hain throughput maximize karne ka. Validators ko ya to fastest client use karna hota hai warna penalties ya kam revenue face karna padta hai. Slow clients chalane wale validators aggressive parameters mein blocks miss kar sakte hain, ya conservative parameters per revenue lose karte hain.
Yeh natural selection sab se efficient client implementation ki taraf drive karta hai. Co-located environment mein choti si speed difference bhi significant ho jati hai—thori si slow client consistent underperformance degi, jisse missed blocks aur penalties hongi. Yeh optimization validator self-interest se nikalti hai, protocol rules se nahi.
Client choice directly enforce nahi hoti, magar economic pressure network ko sab se efficient implementation ki taraf laata hai jabke competitive client development bhi qaim rehta hai.

4. Multi-Local Consensus
Multi-local consensus aik naya approach hai jo validator co-location ke performance faide aur geographic distribution ke security faide ke darmiyan dynamic balance banata hai. System validators ko epochs ke darmiyan apni physical locations coordinate karne ki ijazat deta hai jabke mukhtalif zones ke liye distinct cryptographic identities maintain ki jati hain. Is se network normal operation mein ultra-low latency consensus hasil karta hai, aur zarurat par global consensus par fallback bhi mumkin rehta hai.
Fogo ka multi-local consensus model traditional financial markets ke practices se inspiration leta hai, khaas taur par "follow the sun" trading model se jo foreign exchange aur global markets mein istemal hota hai. Riwayati finance mein market making aur liquidity center se center migrate karti hai, jis se continuous operation aur concentrated liquidity possible hoti hai. Yeh model is liye effective hai kyun ke yeh recognize karta hai ke markets global hain magar physical networking aur human reaction times ki limitations ki wajah se geographic concentration optimal price discovery aur efficiency ke liye zaroori hoti hai.

4.1 Zones aur Zone Rotation
Zone aik geographic area hoti hai jahan validators co-locate karte hain taake consensus performance optimal ho. Ideal tor par zone ek single data center hota hai jahan validators ke darmiyan latency hardware limits ke qareeb hoti hai. Zarurat par zones bare regions ko cover kar sakti hain, kuch performance compromise kar ke practicality hasil karte hue. Zone ki exact definition protocol mein sakhti se nahi, balki validators ke darmiyan social consensus se ubharti hai—iske wajah se network real-world infrastructure constraints ke mutabiq adapt kar sakta hai.
Zone rotation ke multiple faide hain:
• Jurisdictional Decentralization: Regular rotation kisi aik jurisdiction ke zariye consensus capture ko rokta hai, jis se regulatory control ka lamba asar mushkil ho jata hai.
• Infrastructure Resilience: Data centers ya regional infrastructure kharab ho sakte hain (natural disasters, power outages, etc.), zone rotation single failure point par dependency kam karti hai.
• Strategic Performance Optimization: Specific financial events ke dauran (jaise Federal Reserve announcements ya major economic reports) validators consensus ko un sources ke qareeb shift kar sakte hain taake latency kam ho aur price-sensitive operations behtar hon.

4.2 Key Management
Protocol ek two-tier key management system implement karta hai jo long-term validator identity ko zone-specific consensus participation se alag karta hai. Har validator ke paas:
• Global key pair: Root identity ke liye—stake delegation, zone registration, global consensus mein hissa lena.
• Zone-specific sub-keys: Jo designated co-location zones mein consensus ke liye authorized hoti hain.
Yeh separation security ke liye multiple faide deti hai: global keys ko normally offline rakh kar unka exposure kam hota hai; zone transitions ke doran key compromise ka risk reduce hota hai. Zone-specific key delegation on-chain registry program ke zariye manage hoti hai. Naye zone keys global key se register ki ja sakti hain, lekin yeh sirf epoch boundaries par active hoti hain—jis se participants ke paas verification ka waqt hota hai.

4.3 Zone Proposal aur Activation
Naye zones on-chain governance se propose kiye jaate hain using global keys. Network stability aur validators ki tayyari ke liye proposed zones ka ek mandatory delay hota hai jisme:
• Physical infrastructure ko secure kiya jaye
• Secure key management systems setup kiye jayein
• Networking infrastructure test ho
• Security audits kiye jayein
• Backup/recovery procedures established hon
Yeh delay potential malicious actors ke against bhi security layer ka kaam karta hai jo apni infrastructural advantage wali zones force karne ki koshish kar sakte hain. Sirf uske baad jo zone waiting period complete kar le, usay future epochs ke liye vote ke zariye select kiya ja sakta hai.

4.4 Zone Selection Voting Process
Consensus zone ka election on-chain voting se hota hai jo coordinated validator movement aur network security ka tawazun rakhta hai. Validators ko har ane wale epoch ke co-location zone par quorum hasil karna hota hai ek configurable quorum time ke andar. Aam tor par epoch schedule kuch lead time ke sath hota hai, jahan epoch n mein vote kar ke zone n + k ke liye select hota hai. Voting global keys se hoti hai (zone keys nahi, kyunki yeh high-security aur non-latency sensitive hoti hai), aur voting power stake ke weight par based hoti hai.
Quorum ek supermajority stake weight se hasil hoti hai taake choti group unilateral zone change na kar sake. Agar quorum na bana to network agle epoch ke liye automatically global consensus mode mein chala jata hai—jo continuity ko ensure karta hai. Voting period ke doran validators apni preferred zone aur target block time dono signal karte hain, jis se location aur performance parameters ka joint optimization mumkin hota hai. Yeh period infrastructure preparation ke liye bhi zaroori hota hai (zone-specific keys warm-up, connectivity tests, etc.).

4.5 Global Consensus Mode
Global consensus mode fallback aur safety feature dono hai. Jab zone-based ultra-low latency consensus fail ho ya next epoch ke liye quorum na bane, to network global consensus par shift hota hai. Is mode mein:
• Conservative parameters rakhay jate hain (fixed 400ms block time)
• Block size kum hoti hai taa ke geographically dispersed validators ke darmiyan latencies accommodate ho sakhein
Protocol do raste se is mode mein jata hai:
• Failed Zone Selection: Agar agle epoch ke consensus zone ke liye quorum na bane
• Runtime Consensus Failure: Agar current zone block finality timeout ke andar achieve na kare
Yeh fallback “sticky” hota hai—agar mid-epoch trigger hua to agle epoch transition tak global consensus rehta hai, jahan stability performance se zyada ahmiyat rakhti hai. Is mode mein validators global operation key use karte hain, aur fork choice rules zone-based consensus wale hi rehte hain. Ultra-low latency sacrifice hoti hai lekin network continuity aur safety maintain rehti hai.

5. Validator Set
High performance aur abusive MEV practices ko mitigate karne ke liye, Fogo aik curated validator set use karega. Kyun ke agar kuch under-provisioned validators network ke physical performance limits ko rok den, to poori efficiency nahi mil sakti. Ibtida mein curation proof-of-authority ke zariye hogi, phir dheere dheere validator set ki direct permissioning mein transition hogi. Validator set ko social layer punishment dene ki authority di jati hai bina is ke ke yeh traditional proof-of-authority se zyada centralized ho—kyun ke existing proof-of-stake networks mein 2/3 stake already fork power rakhta hai.

5.1 Size aur Initial Configuration
Fogo permissioned validator set rakhta hai jisme protocol-enforced minimum aur maximum number hota hai, taa ke decentralized rahte hue performance optimized rahe. Initial target size taqreeban 20–50 validators hogi; yeh cap protocol parameter ke taur par adjust ki ja sakti hai jese network mature ho. Genesis par, initial set genesis authority ke zariye select kiya jayega jo early stages mein temporary composition manage karegi.

5.2 Governance aur Transitions
Genesis authority ka control validator membership par temporary design kiya gaya hai. Initial stabilization ke baad yeh authority validator set ko mil jayegi. Is transition ke baad validator membership changes ke liye staked tokens ka two-thirds supermajority chahiye hoga—jo proof-of-stake protocol-level changes ke liye bhi required hota hai. Validator turnover ko sudden instability se bachane ke liye protocol parameters replacement/ejection rate ko limit karte hain; yeh percentage tunable parameter hoti hai.

5.3 Participation Requirements
Validators ko eligibility ke liye minimum delegated stake rakhna zaroori hoga, jo Solana ke economic model ke sath compatibility maintain karta hai magar permissioned component add karta hai. Dono cheezein—sufficient stake aur set approval—yeh ensure karti hain ke validators ke paas economic interest aur operational capability dono hon.

5.4 Rationale aur Network Governance
Permissioned validator set decentralization ko materially affect nahi karta, kyun ke kisi bhi proof-of-stake network mein 2/3 supermajority already arbitrary protocol changes ke liye capable hoti hai (fork ke zariye). Is mechanism ka maqsad aise network behaviors ko enforce karna hai jo seedha protocol rules mein mushkil se likhe ja sakte hain, jaise:
• Persistent performance issues
• Abusive MEV extraction jo usability ko nukhsan pohanchaye
• Network destabilizing behavior (jaise Turbine blocks ko leech karna ya forward na karna)
• Aise profitable lekin network ke long-term value ko nuksan pohanchane wale behaviors
Yeh governance model short-term profitability aur long-term viability ke darmiyan imbalance ko samajhta hai. Stake-weighted validator set membership control ke zariye aise behaviors ko police kar sakta hai, bina decentralization ko compromise kiye.

6. Prospective Extensions
Fogo ki core innovations multi-local consensus, client performance, aur validator set management par focus karti hain, lekin kuch additional protocol extensions genesis ya post-launch mein consider ki ja rahi hain. Yeh features functionality ko aur enhance karenge jabke Solana ecosystem ke sath backwards compatibility barqarar rahegi.

6.1 SPL Token Fee Payment
Wider ecosystem SPL token fees aur native fee payments ka support add kar sakta hai taake user experience aur adoption improve ho. Yeh mechanism network fees ko diversify karta hai aur native tokens ke zariye network economy ko empower karta hai.

6.2 Layer-2 Framework Integration
Fogo Layer 2 solutions ke liye strong base provide karta hai, jo transaction throughput aur privacy enhancements ke liye zyada scalable infrastructure offer karte hain. Yeh framework zero-knowledge proofs aur off-chain computation support kar sakta hai.

6.3 Distributed Storage and Compute
Additional protocol modules shamil kiye ja sakte hain jo distributed file storage aur off-chain compute resources network ke zariye coordinate karte hain, jisse decentralized applications aur services ki performance aur scalability behtar ho.

Conclusion
Fogo aik naya Layer 1 blockchain protocol hai jo Solana ecosystem ke upar zabardast performance aur kam latency lata hai. Yeh pure Firedancer based canonical client implementation, multi-local consensus, aur curated validator set jaise innovations se mumkin hota hai. Yeh design blockchain technology ko global financial systems ki demand ke mutabiq evolve karta hai, decentralization aur security ko barqarar rakhte hue.

`;



export async function GET(_req: Request, ctx: { params: { slug: string[] } }) {
  const slug = (ctx.params?.slug || []).join("/")
  if (!slug || !slug.endsWith(".pdf")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const lang = slug.replace(/\.pdf$/i, "").toLowerCase()

  // If English, generate a PDF from the exact content provided.
  if (lang === "english") {
    const bytes = await generatePdfFromText("Fogo: A High-Performance SVM Layer 1", ENGLISH_TEXT)
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${lang}.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    })
  }

  // Placeholder for other languages until real PDFs are added.
  const placeholder = await generatePdfFromText(
    `Fogo Whitepaper – ${lang.charAt(0).toUpperCase() + lang.slice(1)}`,
    `The ${lang} PDF is not yet uploaded.\n\nPlace a file at /public/pdfs/${lang}.pdf or add a handler here to serve it.\n\nTip: Keep filenames lowercase, e.g., ${lang}.pdf`,
  )

  return new NextResponse(placeholder, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${lang}.pdf"`,
      "Cache-Control": "public, max-age=300",
    },
  })
}
