const ReviewQA = [
    {
        row: [
            {
                text: "Unisex Bathroom",
                input_type: "bathroom_toggle",
                field_name: "unisexBathroom",
                optional: true
            },
            {
                text: "Trans Inclusive",
                input_type: "trans_toggle",
                field_name: "inclusiveTransgender",
                optional: true
            },
            {
                text: "LGBTQ Inclusive",
                input_type: "lgbtq_toggle",
                field_name: "inclusiveSexuality",
                optional: true
            },
        ]
    },
    {
        text: "Bathroom Location Description",
        input_type: "text",
        field_name: "bathroomLocationDescription",
        optional: true
    },
    {
        text: "Notes",
        input_type: "textarea",
        field_name: "description",
        optional: true
    },
]

export default ReviewQA;