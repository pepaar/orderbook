import { mapDeltaToData, mapSnapshotToData } from "./orderBookMapping";
import { DeltaResponseMessage, SnapshotResponseMessage } from "./orderBookModel";

const snapshotMessage: SnapshotResponseMessage = {
  feed: "book_ui_1_snapshot",
  numLevels: 4,
  product_id: "PI_XBTUSD",
  asks: [
    [38531.5, 9022],
    [38532, 10000],
    [38537, 10000],
    [38539, 5000],
  ],
  bids: [
    [38518.5, 6480],
    [38517, 5066],
    [38510.5, 8609],
    [38510, 165000],
  ],
};

describe("orderBookMapping", () => {
  test("mapSnapshotToData", () => {
    let book = mapSnapshotToData(snapshotMessage);

    expect(book.currency).toBe("Bitcoin");
    expect(book.asks.length).toBe(4);
    expect(book.bids.length).toBe(4);

    expect(book.asks[0].price).toBe(38531.5);
    expect(book.asks[1].price).toBe(38532);
    expect(book.asks[2].price).toBe(38537);
    expect(book.asks[3].price).toBe(38539);

    expect(book.asks[0].size).toBe(9022);
    expect(book.asks[1].size).toBe(10000);
    expect(book.asks[2].size).toBe(10000);
    expect(book.asks[3].size).toBe(5000);

    expect(book.asks[0].total).toBe(9022);
    expect(book.asks[1].total).toBe(19022);
    expect(book.asks[2].total).toBe(29022);
    expect(book.asks[3].total).toBe(34022);

    expect(book.bids[0].price).toBe(38518.5);
    expect(book.bids[1].price).toBe(38517);
    expect(book.bids[2].price).toBe(38510.5);
    expect(book.bids[3].price).toBe(38510);

    expect(book.bids[0].size).toBe(6480);
    expect(book.bids[1].size).toBe(5066);
    expect(book.bids[2].size).toBe(8609);
    expect(book.bids[3].size).toBe(165000);

    expect(book.bids[0].total).toBe(6480);
    expect(book.bids[1].total).toBe(11546);
    expect(book.bids[2].total).toBe(20155);
    expect(book.bids[3].total).toBe(185155);
  });

  test("mapSnapshotToData", () => {
    let book = mapSnapshotToData(snapshotMessage);

    expect(book.currency).toBe("Bitcoin");
    expect(book.asks.length).toBe(4);
    expect(book.bids.length).toBe(4);

    expect(book.asks[0].price).toBe(38531.5);
    expect(book.asks[1].price).toBe(38532);
    expect(book.asks[2].price).toBe(38537);
    expect(book.asks[3].price).toBe(38539);

    expect(book.asks[0].size).toBe(9022);
    expect(book.asks[1].size).toBe(10000);
    expect(book.asks[2].size).toBe(10000);
    expect(book.asks[3].size).toBe(5000);

    expect(book.asks[0].total).toBe(9022);
    expect(book.asks[1].total).toBe(19022);
    expect(book.asks[2].total).toBe(29022);
    expect(book.asks[3].total).toBe(34022);

    expect(book.bids[0].price).toBe(38518.5);
    expect(book.bids[1].price).toBe(38517);
    expect(book.bids[2].price).toBe(38510.5);
    expect(book.bids[3].price).toBe(38510);

    expect(book.bids[0].size).toBe(6480);
    expect(book.bids[1].size).toBe(5066);
    expect(book.bids[2].size).toBe(8609);
    expect(book.bids[3].size).toBe(165000);

    expect(book.bids[0].total).toBe(6480);
    expect(book.bids[1].total).toBe(11546);
    expect(book.bids[2].total).toBe(20155);
    expect(book.bids[3].total).toBe(185155);
  });

  test("mapDeltaToData - new, edited and removed bids and asks", () => {
    const deltaMessage: DeltaResponseMessage = {
      feed: "book_ui_1",
      product_id: "PI_XBTUSD",
      asks: [
        [38536.5, 6000],
        [38537, 20000],
        [38539, 0],
      ],
      bids: [
        [38510.5, 0],
        [38515, 100],
        [38517, 1200],
      ],
    };

    let book = mapSnapshotToData(snapshotMessage);
    book = mapDeltaToData(deltaMessage, book);

    expect(book.currency).toBe("Bitcoin");
    expect(book.asks.length).toBe(4);
    expect(book.bids.length).toBe(4);

    expect(book.asks[0].price).toBe(38531.5);
    expect(book.asks[1].price).toBe(38532);
    expect(book.asks[2].price).toBe(38536.5);
    expect(book.asks[3].price).toBe(38537);

    expect(book.asks[0].size).toBe(9022);
    expect(book.asks[1].size).toBe(10000);
    expect(book.asks[2].size).toBe(6000);
    expect(book.asks[3].size).toBe(20000);

    expect(book.asks[0].total).toBe(9022);
    expect(book.asks[1].total).toBe(19022);
    expect(book.asks[2].total).toBe(25022);
    expect(book.asks[3].total).toBe(45022);

    expect(book.bids[0].price).toBe(38518.5);
    expect(book.bids[1].price).toBe(38517);
    expect(book.bids[2].price).toBe(38515);
    expect(book.bids[3].price).toBe(38510);

    expect(book.bids[0].size).toBe(6480);
    expect(book.bids[1].size).toBe(1200);
    expect(book.bids[2].size).toBe(100);
    expect(book.bids[3].size).toBe(165000);

    expect(book.bids[0].total).toBe(6480);
    expect(book.bids[1].total).toBe(7680);
    expect(book.bids[2].total).toBe(7780);
    expect(book.bids[3].total).toBe(172780);
  });

  test("mapDeltaToData - empty bids and asks", () => {
    const simpleSnapshotMessage: SnapshotResponseMessage = {
      feed: "book_ui_1_snapshot",
      numLevels: 2,
      product_id: "PI_XBTUSD",
      asks: [
        [38530, 100],
        [38520, 50],
      ],
      bids: [
        [38515, 200],
        [38510, 300],
      ],
    };

    const deltaMessage1: DeltaResponseMessage = {
      feed: "book_ui_1",
      product_id: "PI_XBTUSD",
      asks: [],
      bids: [[38500, 1]],
    };

    const deltaMessage2: DeltaResponseMessage = {
      feed: "book_ui_1",
      product_id: "PI_XBTUSD",
      asks: [[38530, 400]],
      bids: [],
    };

    let book = mapSnapshotToData(simpleSnapshotMessage);
    book = mapDeltaToData(deltaMessage1, book);
    book = mapDeltaToData(deltaMessage2, book);

    expect(book.currency).toBe("Bitcoin");
    expect(book.asks.length).toBe(2);
    expect(book.bids.length).toBe(3);
  });

  test("mapSnapshotToData - with incorrect input arrays", () => {
    const errorSnapshotMessage: SnapshotResponseMessage = {
      feed: "book_ui_1_snapshot",
      numLevels: 2,
      product_id: "PI_XBTUSD",
      asks: [[38530]],
      bids: [[38510, 100, 1231, 123123]],
    };
    let book = mapSnapshotToData(errorSnapshotMessage);
    expect(book.currency).toBe("Bitcoin");
    expect(book.asks.length).toBe(0);
    expect(book.bids.length).toBe(1);

    expect(book.bids[0].price).toBe(38510);
    expect(book.bids[0].size).toBe(100);
    expect(book.bids[0].total).toBe(100);
  });

  // TODO: Cover more edge cases
});
