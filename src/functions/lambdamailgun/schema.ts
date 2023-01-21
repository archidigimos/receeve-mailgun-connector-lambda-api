// export default {
//   type: "object",
//   properties: {
//     signature: {
//       type: 'object',
//       items: {
//         type: 'object',
//         properties: {
//           timestamp: {
//             type: "string"
//           },
//           token: {
//             type: "string"
//           },
//           signature: {
//             type: "string"
//           }
//         }
//       }
//     },
//     eventData: {
//       type: 'object',
//       items: {
//         type: 'object',
//         properties: {
//           event: {
//             type: "string"
//           },
//           timestamp: {
//             type: "number"
//           },
//           id: {
//             type: "string"
//           }
//         }
//       }
//     }
//   },
//   required: ['signature', 'eventData']
// } as const;

export default {
  type: "object",
  properties: {
    webhook_name: {
      type: 'string',
    },
  },
  required: ['webhook_name']
} as const;