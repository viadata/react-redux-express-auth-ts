import {genSalt, hash} from 'bcryptjs';
import {Document, DocumentQuery, Model, model, Schema} from 'mongoose';

export interface IUser {
    email: string;
    name: string;
}

export interface IUserModel extends IUser, Document {}

export interface IUserModelStatic extends Model<IUserModel> {
    findByEmail(email: string): DocumentQuery<IUserModel, IUserModel>;
}

export const userSchema: Schema = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

/* Hooks */
userSchema.pre('save', function(next) {
    const user = this;

    genSalt(10, (err: any, salt: string) => {
        if (err) { return next(err); }

        hash(user.password, salt, (err: any, hash: string) => {
            if (err) { return next(err); }

            user.password = hash;
            next();
        });
    });
});


/* Statics */
userSchema.statics.findByEmail = function(email: string): DocumentQuery<IUserModel, IUserModel> {
    return this.findOne({ email });
};

const User = model<IUserModel, IUserModelStatic>('User', userSchema);
export default User;
