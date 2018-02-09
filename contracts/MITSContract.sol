pragma solidity ^0.4.11;
// We have to specify what version of compiler this code will compile with

import "./strings.sol";

contract MITSContract {

  using strings for *;

  event AddPlantAssetEvent(
    string assetInfo
  );
  event ModifyPlantAssetStateEvent(
    string assetInfo
  );

  event AddPackageAssetEvent(
    string assetInfo
  );
  event ModifyPackageAssetStateEvent(
    string assetInfo
  );

  //  debugging events
  event TestOutputStringEvent(
    string s
  );
  event TestOutputBytes32Event(
    bytes32 x
  );
  event TestOutputIntEvent(
    int x
  );

  function MITSContract() {
  }

  // Utility functions
  //https://ethereum.stackexchange.com/questions/29295/how-to-convert-a-bytes-to-string-in-solidity
  function bytes32ToString(bytes32 x) constant returns (string) {
    //TestOutputBytes32Event(x);
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[charCount] = char;
            charCount++;
        }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
        bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }

  //https://ethereum.stackexchange.com/questions/6591/conversion-of-uint-to-string
  function uintToBytes(uint v) constant returns (bytes32 ret) {
    if (v == 0) {
        ret = '0';
    }
    else {
        while (v > 0) {
            ret = bytes32(uint(ret) / (2 ** 8));
            ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
            v /= 10;
        }
    }
    return ret;
  }

  function AYT(){
    var s = "AYT".toSlice().concat(",MITS YIA".toSlice());
    TestOutputStringEvent(s);
  }

  function addPlantAsset(bytes32 _unique_id, bytes32 _create_op, bytes32 _asset_type, bytes32 _txee_id){
    string memory id = bytes32ToString(_unique_id);
    var create_op = bytes32ToString(_create_op);
    var asset_type = bytes32ToString(_asset_type);
    var txee_id = bytes32ToString(_txee_id);

    var s = create_op.toSlice().concat(",ID,".toSlice());
    s = s.toSlice().concat(id.toSlice());
    s = s.toSlice().concat(",".toSlice());
    s = s.toSlice().concat(asset_type.toSlice());
    s = s.toSlice().concat(",TXEE,".toSlice());
    s = s.toSlice().concat(txee_id.toSlice());
    s = s.toSlice().concat(",Result,".toSlice());
    s = s.toSlice().concat("ALLOWED".toSlice());
    AddPlantAssetEvent(s);
  }

  function addPackageAsset(bytes32 _unique_id, bytes32 _create_op, bytes32 _asset_type, bytes32 _txee_id){
    string memory id = bytes32ToString(_unique_id);
    var create_op = bytes32ToString(_create_op);
    var asset_type = bytes32ToString(_asset_type);
    var txee_id = bytes32ToString(_txee_id);

    var s = create_op.toSlice().concat(",ID,".toSlice());
    s = s.toSlice().concat(id.toSlice());
    s = s.toSlice().concat(",".toSlice());
    s = s.toSlice().concat(asset_type.toSlice());
    s = s.toSlice().concat(",TXEE,".toSlice());
    s = s.toSlice().concat(txee_id.toSlice());
    s = s.toSlice().concat(",Result,".toSlice());
    s = s.toSlice().concat("ALLOWED".toSlice());
    AddPackageAssetEvent(s);
  }
}
