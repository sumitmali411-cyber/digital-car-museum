import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Order Book Visualization ─────────────────────────────────────────────────
function OrderBookViz() {
  const asks = [
    { price: 150.25, qty: 200 },
    { price: 150.20, qty: 350 },
    { price: 150.15, qty: 500 },
    { price: 150.10, qty: 150 },
  ]
  const bids = [
    { price: 150.05, qty: 400 },
    { price: 150.00, qty: 800 },
    { price: 149.95, qty: 600 },
    { price: 149.90, qty: 300 },
  ]
  const maxQty = Math.max(...asks.map(a => a.qty), ...bids.map(b => b.qty))

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', padding: '12px 20px 8px', borderBottom: `1px solid ${C.border}` }}>
        ORDER BOOK — AAPL (Level 2 Market Data)
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
          {['PRICE', 'QTY', 'DEPTH'].map(h => (
            <div key={h} style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.textMuted, textAlign: 'right', letterSpacing: '0.1em' }}>{h}</div>
          ))}
        </div>

        {/* Asks (sell orders) — displayed in reverse (lowest ask first) */}
        {asks.slice().reverse().map((ask, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '4px 0', position: 'relative' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.red, textAlign: 'right' }}>{ask.price.toFixed(2)}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.textDim, textAlign: 'right' }}>{ask.qty}</div>
            <div style={{ position: 'relative', height: 18 }}>
              <div style={{ position: 'absolute', right: 0, top: 2, height: 14, width: `${(ask.qty / maxQty) * 100}%`, background: `${C.red}25`, borderRadius: 2 }} />
            </div>
          </div>
        ))}

        {/* Spread */}
        <div style={{ textAlign: 'center', padding: '6px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, margin: '4px 0' }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.textMuted }}>SPREAD: </span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.amber }}>$0.05</span>
        </div>

        {/* Bids (buy orders) */}
        {bids.map((bid, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '4px 0', position: 'relative' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.green, textAlign: 'right' }}>{bid.price.toFixed(2)}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.textDim, textAlign: 'right' }}>{bid.qty}</div>
            <div style={{ position: 'relative', height: 18 }}>
              <div style={{ position: 'absolute', right: 0, top: 2, height: 14, width: `${(bid.qty / maxQty) * 100}%`, background: `${C.green}25`, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch13StockExchange() {
  const [activeOrderType, setActiveOrderType] = useState(0)

  const orderTypes = [
    {
      name: 'Market Order',
      color: C.cyan,
      desc: 'Execute immediately at the best available price. No price guarantee. Always fills (unless no liquidity).',
      example: 'BUY 100 AAPL @ MARKET → fills against lowest asks immediately',
      risk: 'Slippage on large orders or thin markets. Can fill at far worse price than expected.',
      code: `market_order = Order(
    side='BUY', quantity=100, symbol='AAPL',
    type='MARKET'
)
# Matching engine: take from ask side until qty filled
# Priority: price-time → take lowest ask first`,
    },
    {
      name: 'Limit Order',
      color: C.green,
      desc: 'Execute only at specified price or better. May not fill immediately (rests in order book). Price guarantee.',
      example: 'BUY 100 AAPL @ $149.95 → rests in book if no asks at ≤$149.95',
      risk: 'May never fill if market moves away. Partial fills possible.',
      code: `limit_order = Order(
    side='BUY', quantity=100, symbol='AAPL',
    type='LIMIT', price=149.95
)
# If asks exist at ≤ 149.95: fill immediately (aggressive)
# Otherwise: add to bid side of order book at $149.95`,
    },
    {
      name: 'Stop Order',
      color: C.amber,
      desc: 'Becomes a market order when stop price is reached. Used for stop-loss and momentum strategies.',
      example: 'SELL 100 AAPL STOP @ $148.00 → triggers if last price falls to $148',
      risk: 'Gap risk: if price gaps below stop price, executes at market, potentially far below stop.',
      code: `stop_order = Order(
    side='SELL', quantity=100, symbol='AAPL',
    type='STOP', stop_price=148.00
)
# Held in stop book (separate from main order book)
# When last_trade_price <= 148.00:
#   convert to MARKET SELL order, route to matching engine`,
    },
  ]

  return (
    <div>
      <Section title="Order Book Data Structure" icon="📈">
        <InfoBox type="info">
          The order book is the central data structure of any exchange. It maintains two
          sorted lists: bids (buy orders, sorted descending by price) and asks (sell orders,
          sorted ascending by price). The matching engine continuously matches bids against asks.
        </InfoBox>

        <OrderBookViz />

        <SubSection title="Order Book Implementation">
          <CodeBlock lang="order book (python)" code={`import sortedcontainers  # SortedList for O(log N) operations

class OrderBook:
    def __init__(self, symbol: str):
        self.symbol = symbol
        # Bids: sorted descending (highest price = best bid)
        self.bids = SortedList(key=lambda o: (-o.price, o.timestamp))
        # Asks: sorted ascending (lowest price = best ask)
        self.asks = SortedList(key=lambda o: (o.price, o.timestamp))
        # Fast lookup by order_id for cancellation: O(1)
        self.orders_by_id: dict[str, Order] = {}

    def best_bid(self) -> float:
        return self.bids[0].price if self.bids else None

    def best_ask(self) -> float:
        return self.asks[0].price if self.asks else None

    def spread(self) -> float:
        return self.best_ask() - self.best_bid()

    def add_limit_order(self, order: Order):
        if order.side == 'BUY':
            self.bids.add(order)
        else:
            self.asks.add(order)
        self.orders_by_id[order.id] = order

    def cancel_order(self, order_id: str):
        order = self.orders_by_id.pop(order_id)
        side = self.bids if order.side == 'BUY' else self.asks
        side.discard(order)`} />
        </SubSection>
      </Section>

      <Section title="Price-Time Priority Matching Engine" icon="⚡">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The matching engine implements FIFO (First In, First Out) with price-time priority:
          among all orders at the same price, the order placed <em>earliest</em> gets priority.
          This is the fairness guarantee at the heart of exchange design.
        </p>

        <StepList steps={[
          { title: 'New order arrives at matching engine', body: 'Order validated (symbol exists, price within circuit breaker limits, account has sufficient buying power). Order assigned a monotonically increasing sequence number — this determines time priority at the same price level.' },
          { title: 'Check for immediate match', body: 'For a LIMIT BUY at $150.05: check if any asks exist at price ≤ $150.05. If so, match against the lowest ask. If multiple asks at same price, match oldest first (time priority). Execute trade.' },
          { title: 'Trade execution', body: 'On match: generate a trade record with: buyer_order_id, seller_order_id, execution_price, quantity, timestamp, trade_id. Update both orders\' remaining quantities. Publish trade event to market data feed.' },
          { title: 'Partial fills and remainder', body: 'If buy order wants 500 shares but only 300 available at the price: fill 300 (partial fill), leave 200 remaining in order book. Continue matching against next price level if aggressive (market order) or rest if passive (limit).' },
        ]} />

        <CodeBlock lang="matching engine core loop" code={`def match(order_book: OrderBook, incoming: Order) -> list[Trade]:
    trades = []

    if incoming.side == 'BUY':
        while incoming.remaining_qty > 0 and order_book.asks:
            best_ask = order_book.asks[0]
            # Price check: limit orders only match at acceptable price
            if incoming.type == 'LIMIT' and incoming.price < best_ask.price:
                break  # No match at this price — rest in order book

            # Match!
            fill_qty = min(incoming.remaining_qty, best_ask.remaining_qty)
            exec_price = best_ask.price  # Passive order's price

            trade = Trade(
                buyer_id=incoming.order_id,
                seller_id=best_ask.order_id,
                price=exec_price,
                quantity=fill_qty,
                timestamp=now()
            )
            trades.append(trade)

            incoming.remaining_qty -= fill_qty
            best_ask.remaining_qty -= fill_qty

            if best_ask.remaining_qty == 0:
                order_book.asks.remove(best_ask)  # Fully filled

    if incoming.remaining_qty > 0 and incoming.type == 'LIMIT':
        order_book.add_limit_order(incoming)  # Rest in book

    return trades`} />
      </Section>

      <Section title="Order Types" icon="📋">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {orderTypes.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveOrderType(i)}
              style={{
                flex: 1, padding: '8px 4px', background: 'none', border: 'none',
                borderBottom: activeOrderType === i ? `2px solid ${t.color}` : '2px solid transparent',
                fontFamily: FONTS.mono, fontSize: 10,
                color: activeOrderType === i ? t.color : C.textMuted,
                cursor: 'pointer', transition: 'color 0.15s',
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        <motion.div
          key={activeOrderType}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}
        >
          <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 8px' }}>
            {orderTypes[activeOrderType].desc}
          </p>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: orderTypes[activeOrderType].color, margin: '8px 0 4px' }}>EXAMPLE:</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.textDim, background: '#0d1117', padding: '8px 12px', borderRadius: 5, marginBottom: 8 }}>
            {orderTypes[activeOrderType].example}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.amber, margin: '8px 0 4px' }}>RISK:</div>
          <p style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, lineHeight: 1.65, margin: '0 0 8px' }}>
            {orderTypes[activeOrderType].risk}
          </p>
          <CodeBlock lang="python" code={orderTypes[activeOrderType].code} />
        </motion.div>
      </Section>

      <Section title="Market Data Feed (L1 / L2)" icon="📡">
        <ConceptGrid>
          <ConceptCard title="Level 1 (L1) Data" icon="1️⃣" color={C.cyan}>
            Best bid price, best ask price, last trade price, and volume. The minimum data
            every market participant needs. Published via low-latency UDP multicast.
            Public on most exchanges. Updates every trade or quote change.
          </ConceptCard>
          <ConceptCard title="Level 2 (L2) Data" icon="2️⃣" color={C.green}>
            Full order book depth: all price levels and quantities for bids and asks.
            Reveals market liquidity and institutional interest. Paid subscription on
            most exchanges. Critical for algorithmic and high-frequency traders.
          </ConceptCard>
          <ConceptCard title="ITCH Protocol" icon="⚡" color={C.amber}>
            NASDAQ's binary market data protocol. Ultra-low latency, raw order-level
            events (order add, cancel, execute). Allows rebuilding full order book
            from scratch. Used by HFT firms for microsecond-level strategies.
          </ConceptCard>
          <ConceptCard title="FIX Protocol" icon="📊" color={C.purple}>
            Financial Information eXchange protocol. Standard for order entry and
            execution reports between brokers and exchanges. Text-based but well-defined.
            Most brokerages use FIX for order routing.
          </ConceptCard>
        </ConceptGrid>

        <SubSection title="Market Data Distribution Architecture">
          <CodeBlock lang="market data pipeline" code={`# Matching engine publishes each event to market data bus
class MatchingEngine:
    def on_trade_executed(self, trade: Trade):
        event = {
            'type': 'TRADE',
            'symbol': trade.symbol,
            'price': trade.price,
            'quantity': trade.quantity,
            'timestamp_ns': time.time_ns()  # nanosecond precision
        }
        # Publish to market data sequencer
        self.market_data_sequencer.publish(event)

class MarketDataSequencer:
    """Assigns monotonic sequence numbers to all events.
    Ensures all subscribers see events in identical order.
    No two subscribers can see event 42 before event 41."""
    def publish(self, event):
        event['seq_num'] = self.next_seq_num()
        self.broadcast_udp_multicast(event)  # fastest distribution`} />
        </SubSection>
      </Section>

      <Section title="Trade Settlement Pipeline" icon="🏦">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Trade execution and settlement are separate processes. Execution confirms the
          trade occurred. Settlement (T+2 for equities in US) is the actual transfer of
          securities and cash between parties.
        </p>

        <StepList steps={[
          { title: 'Trade confirmation (T+0)', body: 'Matching engine generates execution report sent to both buyer and seller brokers via FIX protocol within microseconds. Trade recorded in exchange\'s systems. Regulatory reporting submitted to FINRA/SEC within 10 seconds (Rule 10b-10).' },
          { title: 'Clearing (T+0 to T+1)', body: 'Clearinghouse (DTCC in US) becomes the central counterparty. Novation: DTCC inserts itself between buyer and seller — each now has a contract with DTCC, not each other. Netting: thousands of buy/sell transactions netted to minimize settlement obligations.' },
          { title: 'Settlement (T+2)', body: 'Two business days after trade: securities transferred from seller\'s DTC account to buyer\'s. Cash transferred opposite direction via Fedwire or CHIPS. Final, irrevocable. Failed settlements result in buy-in procedures.' },
          { title: 'Risk management during T+2 window', body: 'Counterparty risk exists during 2-day window. Clearinghouse requires margin deposits from brokers proportional to their net open positions. Mark-to-market daily — margin calls if positions move against broker.' },
        ]} />
      </Section>

      <Section title="High Availability for Matching Engine" icon="🛡️">
        <InfoBox type="danger">
          The matching engine is the most critical single component in an exchange. Downtime
          means no trading, regulatory violations, and hundreds of millions in lost revenue.
          NYSE/NASDAQ target 99.999% uptime — &lt;5 minutes downtime per year.
        </InfoBox>

        <TradeoffTable rows={[
          {
            approach: 'Active-Passive Failover',
            pros: 'Simple. Passive mirrors all state changes. On failure, passive promoted. NYSE uses this.',
            cons: 'Failover takes seconds to minutes. Orders in-flight at moment of failure may be lost.',
            when: 'Equities matching (T+1 orders can be resubmitted). Recovery < 30 seconds acceptable.',
          },
          {
            approach: 'Active-Active (Parallel Matching)',
            pros: 'Zero downtime. Both engines always running.',
            cons: 'Extremely complex: must ensure identical order book state. Requires deterministic processing.',
            when: 'Derivatives exchanges, crypto exchanges where seconds of downtime is unacceptable.',
          },
          {
            approach: 'Deterministic Replay',
            pros: 'Log all input events (FIX orders) to durable WAL. On recovery, replay log to rebuild state.',
            cons: 'Replay time grows with log size. Requires periodic checkpoints.',
            when: 'Most practical approach: event log + hot standby for fast recovery.',
          },
        ]} />

        <SubSection title="Deterministic State Machine">
          <CodeBlock lang="matching engine as state machine" code={`# Key insight: matching engine must be DETERMINISTIC
# Given the same sequence of orders, always produces identical state
# This enables hot standby replication and audit replay

class MatchingEngineStateMachine:
    def __init__(self):
        self.order_book = OrderBook()
        self.sequence_number = 0  # Monotonic — never skip or reuse

    def process_command(self, seq_num: int, command: dict):
        # seq_num enforces ordering — reject out-of-order commands
        assert seq_num == self.sequence_number + 1

        if command['type'] == 'NEW_ORDER':
            self.order_book.add(command)
        elif command['type'] == 'CANCEL':
            self.order_book.cancel(command['order_id'])
        elif command['type'] == 'MODIFY':
            self.order_book.modify(command)

        self.sequence_number = seq_num
        # State is fully deterministic given input sequence
        # Secondary replica processes same commands → identical state`} />
        </SubSection>
      </Section>

      <Section title="Co-location and Latency" icon="⚡">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          High-frequency trading firms pay exchanges (NYSE: $14,000/month) to co-locate
          their servers in the same data center as the matching engine. Every nanosecond
          of latency advantage translates to trading edge.
        </p>

        <ConceptGrid>
          <ConceptCard title="Network Distance" icon="📡" color={C.cyan}>
            Speed of light: ~1ms per 300km. NYSE Euronext data center in Mahwah, NJ.
            HFT firms co-locate to get latency of &lt;500μs to matching engine. Cross-country
            (NY to Chicago) introduces ~8ms — significant disadvantage.
          </ConceptCard>
          <ConceptCard title="FPGA Matching" icon="⚡" color={C.amber}>
            Some exchanges (LMAX, Aquis) implement matching engine on FPGA (field-programmable
            gate arrays). Hardware-level matching: 1-4 microseconds vs 10-50μs for software.
            No OS scheduling jitter. Deterministic latency.
          </ConceptCard>
          <ConceptCard title="Kernel Bypass" icon="🔧" color={C.green}>
            HFT firms use DPDK or RDMA to bypass OS kernel for network I/O.
            Standard Linux TCP stack: ~30-50μs. Kernel bypass: ~1-3μs.
            Solarflare/Exablaze NICs with onload stack.
          </ConceptCard>
          <ConceptCard title="Microwave Networks" icon="📶" color={C.purple}>
            Microwave towers between Chicago and NYC for faster-than-fiber trading data
            (fiber follows road curves; microwaves travel straight line). ~8.6ms vs 13ms
            fiber. Used for arbitrage between CME and NYSE.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Order book: sorted bid (descending) and ask (ascending) lists, fast by-ID lookup map',
            'Price-time priority: lowest ask matched first, oldest at same price first',
            'Matching engine must be deterministic: given same input sequence → identical state',
            'Market, Limit, Stop orders — explain mechanics and risk of each',
            'L1 (best bid/ask) via multicast; L2 (full depth) for subscribers; ITCH for raw feed',
            'Settlement T+2: clearinghouse novates trades, netting reduces obligations',
            'HA: active-passive with event log replay + periodic checkpoints',
            'Circuit breakers: halt trading if price moves > 7%/13%/20% (S&P 500 rules)',
            'Co-location and FPGA/kernel bypass explain sub-millisecond latency targets',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 0', borderBottom: i < 8 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ color: C.green, fontFamily: FONTS.mono, fontSize: 13, lineHeight: 1.5 }}>✓</span>
              <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
