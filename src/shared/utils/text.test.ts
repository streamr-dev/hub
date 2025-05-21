import { truncate, truncateStreamName, parseStreamId as psi } from './text'
describe('text utils', () => {
    describe('truncate', () => {
        it('does not truncate inputs without 0x prefix', () => {
            expect(truncate('123')).toBe('123')
        })

        it('does not truncate non-hex inputs', () => {
            expect(truncate('0xxy')).toBe('0xxy')
        })

        it('does not truncate hashes that are too short', () => {
            expect(truncate('0x0123456789abcdef0123456789abcdef01234567')).toBe(
                '0x012...34567',
            )
            expect(truncate('0x0123456789abcdef0123456789abcdef0123456')).toBe(
                '0x0123456789abcdef0123456789abcdef0123456',
            )
        })

        it('has configurable truncateLongerThan threshold', () => {
            expect(truncate('0x0123456789abcdef0123456789abcdef01234567890', 100)).toBe(
                '0x0123456789abcdef0123456789abcdef01234567890',
            )
            expect(truncate('0x0123456789abcdef0123456789abcdef01234567890', 40)).toBe(
                '0x012...67890',
            )
        })

        it('has configurable pickFirst and pickLast parameters', () => {
            expect(truncate('0x0123456789abcdef0123456789abcdef01234567890', 40, 10, 10)).toBe(
                '0x01234567...1234567890',
            )
        })

        it('does not truncate non-eth address', () => {
            expect(truncate('sandbox/test/my-stream')).toBe('sandbox/test/my-stream')
            expect(truncate('FwhuQBTrtfkddf2542asd')).toBe('FwhuQBTrtfkddf2542asd')
        })

        it('truncates paths starting with eth address', () => {
            expect(
                truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/test/my-stream'),
            ).toBe('0xa3d...47De1/test/my-stream')
            expect(
                truncate('0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1/test/my-stream'),
            ).toBe('0xA3D...47DE1/test/my-stream')
        })

        it('truncates address in the middle of text', () => {
            expect(
                truncate(
                    'address is 0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1 inside text',
                ),
            ).toBe('address is 0xA3D...47DE1 inside text')
        })

        it('truncates paths with mutiple eth address', () => {
            expect(
                truncate(
                    '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1/test/0x13581255eE2D20e780B0cD3D07fac018241B5E03/path',
                ),
            ).toBe('0xa3d...47De1/test/0x135...B5E03/path')
        })

        it('only truncates valid eth addresses', () => {
            expect(truncate('0xa3d1F77ACfF3c7fEC78df847De1/test/my-stream')).toBe(
                '0xa3d1F77ACfF3c7fEC78df847De1/test/my-stream',
            )
        })

        it('truncates single eth address', () => {
            expect(truncate('0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1')).toBe(
                '0xa3d...47De1',
            )
            expect(truncate('0xA3D1F77ACFF0060F7213D7BF3C7fEC78DF847DE1')).toBe(
                '0xA3D...47DE1',
            )
        })

        it('truncates transaction hash', () => {
            expect(
                truncate(
                    '0x8b549d1526d0f6168eed061041d6cb5243c2c283b6d35cf41fe9c95b1e606ff1',
                ),
            ).toBe('0x8b5...06ff1')
        })
    })

    describe('truncateStreamName', () => {
        ;[
            {
                streamName: 'short.eth/loremipsum',
                expectedOutput: 'short.eth/loremipsum',
            },
            {
                streamName: '0x3b8fc939003AB15F66D340FdbD82F5f1E3763FA8/loremipsum',
                expectedOutput: '0x3b8...63FA8/loremipsum',
            },
            {
                streamName:
                    'shortaddress.eth/verylongstramnamewhichshouldbeshortenedinthiscase',
                expectedOutput: 'shortaddress.eth/veryl...scase',
            },
            {
                streamName:
                    'theverylongensnamewhichprobablywillnotoccurbutneverthelessweshouldtruncateitifitoccurrs.eth/loremipsum',
                expectedOutput: 'theve...currs.eth/loremipsum',
            },
            {
                streamName:
                    '0x3b8fc939003AB15F66D340FdbD82F5f1E3763FA8/loremipsumdolorisametitsaverylongnamelikethis',
                expectedOutput: '0x3b8...63FA8/lorem...ethis',
            },
            {
                streamName:
                    '0x3b8fc939003AB15F66D340FdbD82F5f1E3763FA8/loremipsum/dolor/sit/amet/its/a/very/long/name/like/this',
                expectedOutput: '0x3b8...63FA8/lorem.../this',
            },
        ].forEach((testCase) => {
            it(`should properly truncate the stream name: ${testCase.streamName}`, () => {
                expect(truncateStreamName(testCase.streamName)).toEqual(
                    testCase.expectedOutput,
                )
            })
        })
    })

    describe('parseStreamId', () => {
        it('parses different stream ids correctly', () => {
            expect(psi('owner/pathname')).toMatchObject({
                owner: 'owner',
                pathname: '/pathname',
            })

            expect(
                psi('0x0000000000000000000000000000000000000001/stream-id'),
            ).toMatchObject({
                owner: '0x0000000000000000000000000000000000000001',
                pathname: '/stream-id',
            })

            expect(psi('ens-domain.eth/stream-id')).toMatchObject({
                owner: 'ens-domain.eth',
                pathname: '/stream-id',
            })
        })

        it('explodes on invalid stream ids', () => {
            expect(() => psi('')).toThrow(/invalid/i)

            expect(() => psi(' /')).toThrow(/invalid/i)

            expect(() => psi('/ ')).toThrow(/invalid/i)

            expect(() => psi(' / ')).toThrow(/invalid/i)

            expect(() => psi('/')).toThrow(/invalid/i)

            expect(() => psi('/whatever')).toThrow(/invalid/i)

            expect(() => psi('whatever/')).toThrow(/invalid/i)
        })
    })
})
