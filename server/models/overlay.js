import mongoose from 'mongoose';

const overlaySchema = new mongoose.Schema({
    positionX: Number,
    positionY: Number,
    width: Number,
    height: Number,
    content: String,
})

const Overlay = mongoose.model('Overlay', overlaySchema);

export default Overlay;
