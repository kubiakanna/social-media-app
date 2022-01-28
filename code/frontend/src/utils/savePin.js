import { v4 as uuidv4 } from 'uuid';
import { client } from '../client';
import { fetchUser } from '../utils/fetchUser';

export const savePin = (id, save) => {
    const user = fetchUser();

    const alreadySaved = save?.some((item) => item?.postedBy._id === user?.googleId);
    if (!alreadySaved) {
        client
            .patch(id)
            .setIfMissing({ save: [] })
            .insert('after', 'save[-1]', [{
                _key: uuidv4(),
                userId: user?.googleId,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user?.googleId
                }
            }])
            .commit()
            .then(() => {
                window.location.reload();

            })
    } else {
        const updatedSavedArr = save.filter((item) => item && item?.postedBy._id !== user?.googleId);
        client
            .patch(id)
            .insert('replace', 'save[0:]', [updatedSavedArr])
            .commit()
            .then(() => {
                window.location.reload();
            })
    }
}