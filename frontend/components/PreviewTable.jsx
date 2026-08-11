
"use client";

export default function PreviewTable({ data }) {

    if (!data) return null;

    if (!data.preview || !data.preview.length) {

        return (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-gray-400">
                    No preview data available.
                </p>
            </div>
        );
    }


    const headers = Object.keys(
        data.preview[0]
    );


    return (

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">

            <h2 className="mb-4 text-lg font-semibold text-white">
                Dataset Preview
            </h2>


            <div className="overflow-x-auto">

                <table className="min-w-full text-sm">

                    <thead>

                        <tr className="border-b border-white/10">

                            {headers.map((header) => (

                                <th
                                    key={header}
                                    className="px-4 py-3 text-left font-medium text-gray-300"
                                >
                                    {header}
                                </th>

                            ))}

                        </tr>

                    </thead>


                    <tbody>

                        {data.preview.map(
                            (row, index) => (

                                <tr
                                    key={index}
                                    className="border-b border-white/5"
                                >

                                    {headers.map(
                                        (header) => (

                                            <td
                                                key={header}
                                                className="px-4 py-3 text-gray-400"
                                            >
                                                {row[header] === null ||
                                                row[header] === undefined
                                                    ? "-"
                                                    : String(row[header])}
                                            </td>

                                        )
                                    )}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}
