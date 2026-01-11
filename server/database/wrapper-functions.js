export const execute = async (db, sql, params = []) => {
    if (params && params.length > 0) {
        return await new Promise((resolve, reject) => {
            db.run(sql, params, (error) => {
                if (error) reject(error);
                resolve();
            });
        });
    } else {
        return await new Promise((resolve, reject) => {
            db.exec(sql, (error) => {
                if (error) reject(error);
                resolve();
            });
        });
    };
};

export const fetchAll = async (db, sql, params = []) => {
    return await new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) reject(error);
            resolve(rows);
        });
    });
};
