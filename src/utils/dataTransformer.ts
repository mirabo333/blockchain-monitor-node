export const transformValuesToString = <T>(obj: any): T => {
  const transformed = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string") return [key, value];
      if (typeof value === "bigint") {
        return [key, value.toString()];
      }
      if (Array.isArray(value)) {
        // BigInt를 문자열로 변환하는 로직 추가
        const serializedArray = value.map((item) => {
          if (typeof item === "bigint") return item.toString();
          if (typeof item === "object") {
            return Object.fromEntries(
              Object.entries(item).map(([k, v]) => [
                k,
                typeof v === "bigint" ? v.toString() : v,
              ])
            );
          }
          return item;
        });
        return [key, JSON.stringify(serializedArray)];
      }
      return [key, value != null ? String(value) : ""];
    })
  );
  return transformed as T;
};
