# ProofCore v1.0.2 - Hugging Face Spaces Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying ProofCore live demo to Hugging Face Spaces.

## Prerequisites

1. **Hugging Face Account**
   - Sign up at https://huggingface.co
   - Create API token (Settings → Access Tokens)
   - Keep token secure

2. **Git Configuration**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **HF CLI (Optional but recommended)**
   ```bash
   pip install huggingface_hub
   huggingface-cli login
   ```

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

#### Step 1: Create GitHub Repository
```bash
# In your GitHub account, create new public repository
# Name: proofcore-hf-demo
# Description: ProofCore v1.0.2 Live Demo on Hugging Face Spaces
# Public: YES (required for HF Spaces)
```

#### Step 2: Initialize Demo Repository Locally
```bash
cd hf_demo
git init
git add .
git commit -m "Initial commit: ProofCore v1.0.2 demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/proofcore-hf-demo.git
git push -u origin main
```

#### Step 3: Create HF Space from GitHub
1. Go to https://huggingface.co/spaces/create
2. Fill in form:
   - **Repo name**: `proofcore-demo`
   - **License**: Select one (recommended: MIT or Apache-2.0)
   - **Space SDK**: Gradio
3. Click "Create space"
4. In Space settings:
   - **Repository URL**: (will auto-populate)
   - **Git visibility**: Public
5. HF Spaces will auto-sync from GitHub

#### Step 4: Configure GitHub Webhook (Optional)
For auto-deployment on GitHub push:
```bash
# In your GitHub repo
Settings → Webhooks → Add webhook
- Payload URL: (provided by HF Spaces)
- Events: Push events
```

### Method 2: Direct Upload to HF Spaces

#### Step 1: Create HF Space
1. Go to https://huggingface.co/spaces/create
2. Fill form:
   - **Repo name**: `proofcore-demo`
   - **License**: MIT/Apache-2.0
   - **Space SDK**: Gradio
3. Click "Create space"

#### Step 2: Clone Space Repository
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
cd proofcore-demo
```

#### Step 3: Copy Files
```bash
# Copy from hf_demo/ directory
cp ../hf_demo/app.py .
cp ../hf_demo/requirements.txt .
cp ../hf_demo/README.md .
```

#### Step 4: Push to HF Space
```bash
git add .
git commit -m "Deploy ProofCore v1.0.2 demo"
git push
```

HF Spaces will auto-build and launch.

### Method 3: Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 7860

CMD ["python", "app.py"]
```

#### Step 2: Create .gitignore
```
__pycache__/
*.py[cod]
*$py.class
*.so
.env
.venv
venv/
```

#### Step 3: Create HF Space
1. Go to https://huggingface.co/spaces/create
2. Select **SDK: Docker**
3. Follow upload instructions

## Verification & Testing

### Test Local Demo First
```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py

# Open browser
http://localhost:7860
```

### Test Cases
1. **Load Example Proof**
   - Select "Algebra: Quadratic Formula"
   - Click "Load Proof"
   - Verify steps display correctly

2. **Verify Proof**
   - Click "Verify Proof"
   - Check all steps return valid status
   - View performance metrics (should show ~0 network calls)

3. **Custom Verification**
   - Enter custom claim: "x² = 4 when x = 2"
   - Enter equation: "x^2 = 4"
   - Select domain: algebra
   - Click "Verify Step"
   - Verify result shows high confidence

4. **Performance Metrics**
   - Check avg verification time < 200ms
   - Verify network calls = 0
   - Check offline status = 100%

### Monitoring HF Space

After deployment:
1. Visit https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
2. Click "Settings" tab
3. Check:
   - Build status (should be green ✓)
   - Last updated timestamp
   - Resource usage

4. Monitor logs:
   - Click "Logs" tab
   - Watch for any errors
   - Check startup messages

## Troubleshooting

### Issue: Build fails with dependency errors

**Solution**:
```bash
# Update requirements.txt
pip freeze > requirements.txt

# Ensure correct versions
# Gradio: 4.26.0+
# Python: 3.11+
```

### Issue: Demo runs slowly

**Check**:
- Browser cache: Ctrl+Shift+Delete
- Close other tabs
- Check HF Space resources (Settings → Hardware)
- May need to upgrade to CPU space

### Issue: Examples not loading

**Check**:
- Verify `app.py` contains `EXAMPLE_PROOFS`
- Check Python syntax: `python -m py_compile app.py`
- View HF Space logs for errors

### Issue: Changes not reflecting

**Solution**:
```bash
# Force rebuild
# In HF Space Settings → Advanced:
# Click "Restart the application"
# Or push new commit (auto-triggers rebuild)
```

## Performance Optimization

### Initial Load
- **Expected**: 2-5 seconds
- **Optimization**: Gradio caches UI assets
- **Cache clearing**: Browser Ctrl+Shift+Delete

### Proof Verification
- **Expected**: 50-200ms per step
- **Metric**: Shown in "Performance Metrics"
- **Network**: Always 0 calls (100% local)

### Bundle Size
- **Expected**: ~350KB for JavaScript
- **Gradio UI**: ~2-3MB total
- **Demo**: < 50MB total deployment

### Resource Usage
- **Memory**: ~50-100MB running
- **CPU**: Minimal (no GPU needed)
- **Disk**: ~200MB for Python + dependencies

## Maintenance

### Update Demo
To update with new ProofCore features:

```bash
# Update source files
# 1. Modify app.py locally
# 2. Test locally: python app.py
# 3. Commit changes
git add .
git commit -m "Update: Add new proof examples"
git push

# HF Space auto-rebuilds on push
```

### Add New Examples
Edit `EXAMPLE_PROOFS` dictionary in `app.py`:

```python
EXAMPLE_PROOFS = {
    "New Example": {
        "domain": "algebra",
        "steps": [
            ProofStep(1, "Claim", "equation", "reasoning"),
            # ... more steps
        ]
    }
}
```

### Monitor Metrics
The demo tracks:
- Proofs verified (accumulates per session)
- Average verification time
- Network calls (always 0)
- Offline status (always 100%)

Note: Metrics reset on Space restart.

## Security Considerations

### No External Data Collection
- ✓ Zero telemetry
- ✓ No user tracking
- ✓ No third-party APIs
- ✓ Stateless sessions

### Data Privacy
- All proof data processed locally
- No data persisted to disk
- Session memory only
- Complete between requests

### Safe Dependencies
```
gradio==4.26.0     # Web framework
pydantic==2.5.0    # Data validation
# No machine learning frameworks
# No external API clients
```

## Scaling Considerations

### Single User (Default)
- Works fine for 1-10 concurrent users
- Standard HF Space CPU

### Multiple Users (10-100)
- Upgrade to "Pro" Space
- Enable CPU or GPU acceleration
- Consider space-specific settings

### High Traffic (100+)
- Deploy standalone server
- Use ProofCore as library
- Scale with load balancing

See `README_V1.0.2.md` for architecture details.

## Post-Deployment Checklist

- [ ] Space created and accessible
- [ ] Demo loads without errors
- [ ] Example proofs load and verify
- [ ] Custom verification works
- [ ] Performance metrics show 0 network calls
- [ ] README visible in Space
- [ ] Settings configured (description, tags)
- [ ] Sharing link working
- [ ] Mobile view tested

## URLs & Resources

### Live Demo (After Deployment)
```
https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
```

### Documentation
- **README**: In Space Files
- **GitHub**: https://github.com/Flamehaven/Proofcore-AI-Benchmark
- **Full Docs**: README_V1.0.2.md

### Support
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **HF Support**: HF Spaces documentation

## Example Deployment Output

```
[>] Cloning repository...
[+] Repository cloned
[>] Building Gradio app...
[+] Dependencies installed
[>] Starting application...
[+] Running on http://0.0.0.0:7860
[>] Space is public and accessible

Access URL: https://huggingface.co/spaces/YOUR_USERNAME/proofcore-demo
```

## Next Steps

After successful deployment:

1. **Promote the Demo**
   - Add to GitHub README
   - Share on social media
   - Include in project documentation

2. **Collect Feedback**
   - Monitor HF Space discussions
   - Watch GitHub issues
   - Iterate on examples

3. **Expand Examples**
   - Add domain-specific proofs
   - Include challenging cases
   - Create tutorial proofs

4. **Optimize Performance**
   - Monitor average verification times
   - Optimize heuristic scoring
   - Reduce bundle size further

---

**Status**: Ready for Deployment
**Version**: 1.0.2
**Last Updated**: 2025-10-24

[*] All systems go for live demo launch!
