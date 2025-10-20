# Deploy ProofCore Live Demo to Hugging Face Spaces [QUICK START]

**Time Required**: ~10 minutes
**Difficulty**: Easy
**Status**: Ready to Deploy ✓

---

## What You're Deploying

A production-ready Gradio application showcasing ProofCore v1.0.2:

- **100% Offline-First**: Zero network calls
- **4 Example Proofs**: Algebra, logic, geometry
- **Custom Verification**: User input support
- **Performance Metrics**: Real-time monitoring
- **Quality**: 98.0 Ω score

## Quick Deploy (5 minutes)

### Step 1: Create HF Space
1. Go to https://huggingface.co/spaces/create
2. Fill in:
   - **Repo name**: `proofcore-demo` (or your choice)
   - **License**: MIT (recommended)
   - **Space SDK**: Gradio
3. Click "Create space"

### Step 2: Get Clone URL
After creation, HF shows:
```
Clone URL: https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
```

### Step 3: Clone & Deploy Locally
```bash
# Clone the space
git clone https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
cd proofcore-demo

# Copy files from main repo
cp ../Proofcore\ AI-benchmark/hf_demo/* .

# Verify files
ls -la
# Should show: app.py, requirements.txt, README.md, etc.
```

### Step 4: Push to HF
```bash
# Stage files
git add .

# Commit
git commit -m "Deploy ProofCore v1.0.2 demo"

# Push (HF auto-builds)
git push
```

**Done!** HF Spaces will auto-build in ~1-2 minutes.

## Verify Deployment

### Check Build Status
1. Visit: https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
2. Look for green checkmark ✓
3. Click "Open" to launch

### Test the Demo
1. **Example Proofs Tab**
   - Select "Algebra: Quadratic Formula"
   - Click "Load Proof"
   - Click "Verify Proof"
   - Should show 5 steps verified ✓

2. **Custom Verification Tab**
   - Enter claim: "2+2=4"
   - Enter equation: "2 + 2 = 4"
   - Select domain: algebra
   - Click "Verify Step"
   - Should show high confidence ✓

3. **Metrics Check**
   - Network calls should be **0** ✓
   - Offline status should be **100% Verified** ✓

## Advanced: GitHub Auto-Sync

For automatic updates on GitHub push:

### Setup (One-time)

```bash
# 1. Create GitHub repo
git init proofcore-hf-demo
cd proofcore-hf-demo
cp -r ../Proofcore\ AI-benchmark/hf_demo/* .

# 2. Set up GitHub
git add .
git commit -m "Initial: ProofCore demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/proofcore-hf-demo.git
git push -u origin main

# 3. Create HF Space with GitHub URL
# Visit: https://huggingface.co/spaces/create
# Select GitHub sync in settings
# Paste repo URL: https://github.com/YOUR_USERNAME/proofcore-hf-demo
```

### Now It Works Like This

```bash
# Make changes locally
# ...edit app.py...

# Push to GitHub
git add .
git commit -m "Update: Add new example"
git push

# HF Space automatically rebuilds! ✨
```

## Troubleshooting

### Issue: Build fails
**Solution**: Check Python syntax
```bash
cd hf_demo
python -m py_compile app.py
```

### Issue: Demo runs slowly
**Solution**: Upgrade HF Space CPU (Settings → Hardware)

### Issue: Changes not showing
**Solution**: Force rebuild in HF (Settings → Restart application)

### Issue: Dependencies not installing
**Solution**: Check requirements.txt
```bash
# Should only have:
# gradio==4.26.0
# pydantic==2.5.0
```

## File Structure

```
hf_demo/
├── app.py                      # Main Gradio app
├── requirements.txt            # Python dependencies
├── README.md                   # User guide
├── HF_DEPLOYMENT_GUIDE.md     # Detailed guide
├── test_demo.py               # Test suite
└── .gitignore                 # Git config
```

## After Deployment

### Share Your Demo
- URL: `https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo`
- Share on GitHub, Twitter, etc.
- Link in project README

### Monitor Usage
- Visit space to see traffic
- Check "Logs" tab for errors
- Monitor performance

### Update Demo
```bash
# Make changes
# ...edit app.py...

# Commit & push
git add .
git commit -m "Update: [description]"
git push

# HF rebuilds automatically
```

## Important Notes

✓ **Zero Network Calls**: Demo is 100% offline
✓ **No API Keys Needed**: No external services
✓ **Free to Host**: HF Spaces free tier works great
✓ **No Data Collection**: Stateless sessions
✓ **Persistent Demo**: Always available on HF

## Performance Expected

| Operation | Time | Status |
|-----------|------|--------|
| Load demo page | 2-5s | Expected |
| Verify proof | 50-200ms | Fast |
| Custom step | 10-50ms | Fast |
| Network calls | 0 | Verified |

## Support Resources

- **Demo README**: `hf_demo/README.md`
- **Deploy Guide**: `hf_demo/HF_DEPLOYMENT_GUIDE.md`
- **Test Suite**: `hf_demo/test_demo.py` (run locally first)
- **GitHub Repo**: https://github.com/Flamehaven/Proofcore-AI-Benchmark

## Quick Commands

```bash
# Test locally before deploying
cd hf_demo
pip install -r requirements.txt
python test_demo.py

# Deploy to HF
cd proofcore-demo  # (HF Space clone)
cp ../Proofcore\ AI-benchmark/hf_demo/* .
git add .
git commit -m "Deploy ProofCore demo"
git push
```

---

## Status: READY TO DEPLOY ✓

All files prepared. All tests passing.
Next step: Create HF Space and follow "Quick Deploy" section above.

**Questions?** See `HF_DEPLOYMENT_GUIDE.md` for detailed instructions.

**Live URL After Deployment**:
```
https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
```

---

**ProofCore v1.0.2 Live Demo**
**Quality**: 98.0 Ω (Production Ready)
**Last Updated**: 2025-10-24
