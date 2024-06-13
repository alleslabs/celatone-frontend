import { createTxHash } from "../createTxHash";

describe("createTxHash", () => {
  test("success", () => {
    expect(
      createTxHash(
        "CpUCCpICChovaW5pdGlhLm1vdmUudjEuTXNnRXhlY3V0ZRLzAQoraW5pdDFwZ2d3bTZua3F6djdqbWdmOGtzZnc5Mzdza2Ezc3NjODRuOTIyMBIqMHhFNjA2MDgxMTVDRjE2QzhBN0UwNzkwMjEwQzBBNjcyMTVCN0JFQzA5GhdleHRlcm5hbF9pbnRlbnRfbWFuYWdlciIsdmVyaWZ5X2Nsb3NlX3Bvc2l0aW9uX3RyYW5zZmVyX2ludGVudF9maWxsZWQyJSRhYThjNjg0Ni04OGJjLTRmYjAtODYxZS01ZDgyZWYwYjQ4NjYyIPTuyaaQLdM3TWJy5evGnv+8yN+DKDxzy/fGo97NVMUBMgjaVuUAAAAAABJaClIKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECDycOMnG0mAWpG2gBCPgq1NBZ263AGLCMGzX3OuQQZi8SBAoCCAEYu7wCEgQQqYgUGkBGZNRBO0VYqen0E4GTpdFZ5tJVdjPlFQ8cHhbzZYmAlRUiaMOaQLhQaLhmVdoMpy7HlN/4BWSPHn923pgi3xvq"
      )
    ).toEqual(
      "5BCB87ACD981F366183B3624CE552294012216167DDCEBA5BE9717969AA48249"
    );
  });
});
