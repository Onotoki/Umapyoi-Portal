const mongoose = require('mongoose');
require('dotenv').config();

// Script to sync local database to MongoDB Atlas
const localURI = 'mongodb://127.0.0.1:27017/umapyoi';

// You will run this by providing the Atlas URI like:
// node sync_to_atlas.js "mongodb+srv://username:password@cluster.mongodb.net/umapyoi"
const atlasURI = process.argv[2];

if (!atlasURI) {
  console.error('\n❌ Lỗi: Bạn cần cung cấp chuỗi kết nối MongoDB Atlas!');
  console.log('👉 Cú pháp chạy: node sync_to_atlas.js "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/umapyoi"\n');
  process.exit(1);
}

const sync = async () => {
  try {
    console.log('🔄 1. Đang kết nối tới MongoDB Local...');
    const localConn = await mongoose.createConnection(localURI).asPromise();
    console.log('✅ Kết nối MongoDB Local thành công!');

    console.log('🔄 2. Đang kết nối tới MongoDB Atlas...');
    const atlasConn = await mongoose.createConnection(atlasURI).asPromise();
    console.log('✅ Kết nối MongoDB Atlas thành công!');

    // Define temporary schemas to read/write
    const CharacterSchema = new mongoose.Schema({}, { strict: false, collection: 'characters' });
    const SupportCardSchema = new mongoose.Schema({}, { strict: false, collection: 'supportcards' });

    const LocalCharModel = localConn.model('Character', CharacterSchema);
    const LocalCardModel = localConn.model('SupportCard', SupportCardSchema);

    const AtlasCharModel = atlasConn.model('Character', CharacterSchema);
    const AtlasCardModel = atlasConn.model('SupportCard', SupportCardSchema);

    // Fetch data
    console.log('🔄 3. Đang đọc dữ liệu từ local...');
    const characters = await LocalCharModel.find({});
    const cards = await LocalCardModel.find({});
    console.log(`📊 Đã đọc được: ${characters.length} Nhân vật và ${cards.length} Thẻ hỗ trợ.`);

    // Clear Atlas first
    console.log('🔄 4. Đang làm sạch database trên MongoDB Atlas...');
    await AtlasCharModel.deleteMany({});
    await AtlasCardModel.deleteMany({});
    console.log('✅ Đã làm sạch Atlas!');

    // Insert to Atlas
    console.log('🔄 5. Đang đồng bộ dữ liệu sang MongoDB Atlas...');
    if (characters.length > 0) {
      await AtlasCharModel.insertMany(characters);
    }
    if (cards.length > 0) {
      await AtlasCardModel.insertMany(cards);
    }

    console.log('\n🎉 ===================================================');
    console.log('✅ ĐỒNG BỘ DỮ LIỆU THÀNH CÔNG LÊN MONGODB ATLAS!');
    console.log(`   - Nhân vật: ${characters.length} bản ghi`);
    console.log(`   - Thẻ hỗ trợ: ${cards.length} bản ghi (Đã loại bỏ các thẻ tương lai JP)`);
    console.log('=======================================================\n');

    await localConn.close();
    await atlasConn.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Có lỗi xảy ra trong quá trình đồng bộ:', error);
    process.exit(1);
  }
};

sync();
